import {FetchTransport} from "./fetch-transport";

export class BackendService {
    constructor(token, useTrickyFetch = true) {
        this.lastSentTimes = {};
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
        const reasonWithoutLimit = ['closeDate'];
        const currentTime = Date.now();

        if (reasonWithoutLimit.includes(reason) || !this.lastSentTimes[reason] || currentTime - this.lastSentTimes[reason] >= 5 * 60 * 1000) {
            this.lastSentTimes[reason] = currentTime;
            this.query(`notify?reason=${reason}`, {
                reason: reason,
                data: data,
            });
        }
    }

    async saveDepartmentIds(ids) {
        return this.query('saveDepartmentIds', {
            ids: ids,
        });
    }

    async get(action) {
        return this.query(action, {}, 'GET');
    }

    async query(action, body, method = 'POST', customHeaders = {}) {
        const url = `https://myvisit.pumpkinlatte.club/api/${action}`;
        // const url = `http://127.0.0.1:8000/api/${action}`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
            ...customHeaders,
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

        return FetchTransport.query(url, body, method, headers);
    }
}