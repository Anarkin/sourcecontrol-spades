import https from "https";

export class HttpClient {

    public async getAsync<TResponse>(httpRequestOptions: HttpRequestOptions): Promise<TResponse> {
        return new Promise((resolve, reject) => {
            const clientRequest = https.get(httpRequestOptions, incomingMessage => {
                let data = "";

                incomingMessage.on("data", chunk => {
                    data += chunk;
                });

                incomingMessage.on("end", () => {
                    const response = JSON.parse(data) as TResponse;
                    resolve(response);
                });
            });

            clientRequest.on("error", error => {
                reject(error);
            });

            clientRequest.end();
        });
    }
}

export interface HttpRequestOptions extends https.RequestOptions {

}
