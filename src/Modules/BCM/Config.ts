import { ConfigProvider as ConfigProviderBase } from "../../ConfigProvider";

export class ConfigProvider extends ConfigProviderBase<IConfig> {

    constructor(path = "configuration/module-bcm.json") {
        super(path);
    }
}

export interface IConfig {

    dataSource: {
        pullRequestPagingSize: number;
        pullRequestNoOfPages: number;
        activityPagingSize: number;
        repositories: [{
            project: string;
            repo: string;
        }];
    };

    teams: [{
        name: string;
        members: string[];
    }];
}
