export class BackendService {
    constructor(token, useTrickyFetch = true) {
        this.token = token;
        this.useTrickyFetch = useTrickyFetch;
        this.userData = null;
    }

    async getUserData() {
        if (this.userData !== null) {
            return this.userData;
        }

        return this.get('getMySelf').then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response.response;
            }

            return {
                user: null,
                status: response.status,
            };
        }).then(data => {
            this.userData = data?.user;

            return this.userData;
        });
    }

    notify(reason, data = {}) {
        this.query(`notify?reason=${reason}`, {
            reason: reason,
            data: data,
        });
    }

    async get(action) {
        return this.query(action, {}, 'GET');
    }

    async query(action, body, method = 'POST') {
        const url = `https://myvisit.pumpkinlatte.club/api/${action}`;
        // const url = `http://127.0.0.1:8000/api/${action}`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
        };

        if (!this.useTrickyFetch) {
            return fetch(url, {
                method: method,
                headers: headers,
                body: method !== 'GET' ? JSON.stringify(body) : null,
            }).then(async response => {
                if (response.ok) {
                    const jsonResponse = await response.json()
                    return {
                        status: response.status,
                        response: jsonResponse,
                    }
                } else {
                    return {
                        status: response.status,
                        response: null,
                    }
                }
            });
        }

        return new Promise((resolve, reject) => {
            const reqId = Math.random().toString(36).substring(2, 15)

            window.postMessage({
                reqId: reqId,
                type: 'FETCH',
                method: method,
                headers: headers,
                body: method !== 'GET' ? JSON.stringify(body) : null,
                url: url,
            }, window.location.origin)

            window.addEventListener('message', function (event) {
                console.log('RESPONSE', event.data);
                if (event.data.reqId === reqId && event.data.type === 'FETCH_RESPONSE') {
                    resolve(event.data.response);
                }
            });
        });
    }
}