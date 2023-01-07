export class BackendService {
    constructor(token) {
        this.token = token;
        this.userData = null;
    }

    async getUserData() {
        if (this.userData !== null) {
            return this.userData;
        }

        return this.get('getMySelf').then(response => response.json()).then(data => {
            this.userData = data?.user;

            return this.userData;
        });
    }

    async notify(reason, data = {}) {
        return this.query(`notify?reason=${reason}`, {
            reason: reason,
            data: data,
        });
    }

    async get(action) {
        return this.query(action, {}, 'GET');
    }

    async query(action, body, method = 'POST') {
        const url = `http://127.0.0.1:8000/api/${action}`;

        return fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`,
            },
            body: method !== 'GET' ? JSON.stringify(body) : null,
        });
    }
}