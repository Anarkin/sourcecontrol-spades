export interface IPullRequest {

    id: number;
    userName: string;
    userEmail: string;

    activities: {
        date: number;
        userName: string;
        userEmail: string;
        action: string;
    }[];
}
