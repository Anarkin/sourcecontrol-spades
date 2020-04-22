import { readFileSync } from "fs";

export class ConfigProvider<T> {

    constructor(private path: string, private encoding = "utf8") {
    }

    public load(): T {
        const fileContent = readFileSync(this.getPath(), this.encoding);

        const t = JSON.parse(fileContent) as T;
        return t;
    }

    private getPath(): string {
        const environment = process.env["ENV"];
        if (environment) {
            return `${this.path}.${environment}`;
        }

        return this.path;
    }
}
