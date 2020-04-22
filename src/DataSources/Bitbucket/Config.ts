import { ConfigProvider } from "../../ConfigProvider";

export class BitbucketConfigProvider extends ConfigProvider<IBitbucketConfig> {

    constructor(path = "configuration/bitbucket.json") {
        super(path);
    }
}

export interface IBitbucketConfig {

    host: string;
    basicAuth: {
        userName: string,
        password: string
    };
    apiRateLimitNoOfRequestsPerSec: number;
}
