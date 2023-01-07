export class BackendService {
    constructor(token) {
        this.token = token;
    }

    async notify(reason, data = {}) {
        return this.query(`notify?reason=${reason}`, {
            reason: reason,
            data: data,
        });
    }

    async query(action, body, method = 'POST') {
        const url = `http://127.0.0.1:8000/api/${action}`;
        //send request to backend by fetch with json body
        return fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`,
            },
            body: JSON.stringify(body),
        });
    }
}