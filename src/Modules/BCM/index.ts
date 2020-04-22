import { fetchPullRequestsAsync } from "./fetchPullRequestsAsync";
import { calcNoOfPrsInteractedWith } from "./Process/calcNoOfPrsInteractedWith";
import { calcNoOfCommentsWritten } from "./Process/calcNoOfCommentsWritten";

export = async function main(): Promise<void> {

    const pullRequests = await fetchPullRequestsAsync();

    calcNoOfPrsInteractedWith(pullRequests);
    calcNoOfCommentsWritten(pullRequests);
}
