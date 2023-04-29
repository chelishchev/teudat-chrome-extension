export class FetchTransport {

    static async query(url, body, method = 'POST', customHeaders = {}, additionalOptions = {}) {
        const headers = {
            ...customHeaders,
        };

        return new Promise((resolve, reject) => {
            const reqId = Math.random().toString(36).substring(2, 15)

            window.postMessage({
                reqId: reqId,
                type: 'FETCH',
                method: method,
                headers: headers,
                body: method !== 'GET' ? JSON.stringify(body) : null,
                url: url,
                ...additionalOptions,
            }, window.location.origin)

            window.addEventListener('message', function (event) {
                if (event.data.reqId === reqId && event.data.type === 'FETCH_RESPONSE') {
                    console.log('FetchTransport RESPONSE', event.data);
                    resolve(event.data.response);
                }
            });
        });
    }
}