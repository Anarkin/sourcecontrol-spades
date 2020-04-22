import { HttpClient, HttpRequestOptions } from "../../HttpClient";
import { IGetPullRequestsResponse, IGetPullRequestActivitiesResponse } from "./Models.Atlassian";

export class BitbucketClient {

    private readonly route = "rest/api/1.0";
    private readonly options: HttpRequestOptions = {
        host: this.host,
        port: 443,
        headers: { 'Authorization': 'Basic ' + Buffer.from(`${this.basicAuth.userName}:${this.basicAuth.password}`).toString('base64') }
    }

    constructor(private host: string, private basicAuth: { userName: string, password: string }) {
    }

    public async getPullRequests(project: string, repository: string, page: number, pagingSize: number) {
        return new HttpClient()
            .getAsync<IGetPullRequestsResponse>({
                ...this.options,
                path: `/${this.route}/projects/${project}/repos/${repository}/pull-requests?state=ALL&limit=${pagingSize}&start=${page * pagingSize}`
            });
    }

    public async getPullRequestActivities(project: string, repository: string, prId: number, pagingSize: number) {
        return new HttpClient()
            .getAsync<IGetPullRequestActivitiesResponse>({
                ...this.options,
                path: `/${this.route}/projects/${project}/repos/${repository}/pull-requests/${prId}/activities?state=ALL&limit=${pagingSize}&start=0`
            });
    }
}
