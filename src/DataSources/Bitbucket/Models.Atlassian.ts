// responses

export interface IGetPullRequestsResponse extends IPagedResponse {

    values: IPullRequest[];
}

export interface IGetPullRequestActivitiesResponse extends IPagedResponse {

    values: IPullRequestActivity[];
}

// common

export interface IPagedResponse {

    size: number;
    limit: number;
    start: number;
    nextPageStart: number;
    isLastPage: boolean;
}

export interface IUser {

    name: string;
    emailAddress: string;
    id: number;
    displayName: string;
    active: boolean;
    slug: string;
    type: string;
}

export interface IUserActivity {

    user: IUser;

    role: string;
    approved: boolean;
    status: string;
}

export interface IRef {

    id: string,
    repository: {
        slug: string,
        name: string,
        project: {
            key: string
        }
    }
}

//

export interface IPullRequest {

    id: number,
    version: number,
    title: string,
    description: string,
    state: string,
    open: boolean,
    closed: boolean,
    createdDate: number,
    updatedDate: number,
    locked: boolean,

    fromRef: IRef,
    toRef: IRef,

    author: IUserActivity,
    reviewers: IUserActivity[],
    participants: IUserActivity[],

    links: {
        self: [{
            href: string
        }]
    }
}

export interface IPullRequestActivity {

    id: number,
    createdDate: number,
    user: IUser,
    action: string,

    // the rest differs depending on "action", update if/when needed

    [x: string]: any
}
