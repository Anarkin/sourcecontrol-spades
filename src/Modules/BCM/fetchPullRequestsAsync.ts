import { from, of } from "rxjs";
import { flatMap, map, reduce, concatMap, delay, single } from "rxjs/operators";

import { BitbucketConfigProvider } from "../../DataSources/Bitbucket/Config";
import { BitbucketClient } from "../../DataSources/Bitbucket/Client";
import { IPullRequest as IAtlassianPullRequest } from "../../DataSources/Bitbucket/Models.Atlassian";

import { ConfigProvider } from "./Config";
import { IPullRequest } from "./Models";

export async function fetchPullRequestsAsync(): Promise<IPullRequest[]> {

    const bitbucketConfig = new BitbucketConfigProvider().load();
    const bitbucketClient = new BitbucketClient(bitbucketConfig.host, bitbucketConfig.basicAuth);
    const config = new ConfigProvider().load();

    return from(config.dataSource.repositories)
        .pipe(

            flatMap(repository => from(Array(config.dataSource.pullRequestNoOfPages).keys())
                .pipe(
                    flatMap(pageNumber => from(bitbucketClient.getPullRequests(repository.project, repository.repo, pageNumber, config.dataSource.pullRequestPagingSize))),
                    map(response => response.values),
                    reduce((pullRequests, prsResponse) => [...pullRequests, ...prsResponse], [] as IAtlassianPullRequest[]),
                    flatMap(pullRequests => from(pullRequests)),
                )
            ),

            concatMap(_ => of(0).pipe(delay(1000 / bitbucketConfig.apiRateLimitNoOfRequestsPerSec)), _ => _),

            flatMap(pullRequest => {
                const project = pullRequest.fromRef.repository.project.key;
                const repo = pullRequest.fromRef.repository.name;
                return from(bitbucketClient.getPullRequestActivities(project, repo, pullRequest.id, config.dataSource.activityPagingSize))
                    .pipe(
                        map(prActivity => prActivity.values),
                        map(prActivities => ({ pullRequest, prActivities }))
                    );
            }),

            // map to internal domain
            map(pr => ({
                id: pr.pullRequest.id,
                userName: pr.pullRequest.author.user.name,
                userEmail: pr.pullRequest.author.user.emailAddress,

                activities: pr.prActivities
                    .filter(a => ["approved", "unapproved", "commented"].indexOf(a.action.toLowerCase()) > -1)
                    .map(a => ({
                        date: a.createdDate,
                        userName: a.user.name,
                        userEmail: a.user.emailAddress,
                        action: a.action
                    }))
            } as IPullRequest)),

            reduce((prs, pr) => [...prs, pr], [] as IPullRequest[]),
            single()
        )
        .toPromise();
}
