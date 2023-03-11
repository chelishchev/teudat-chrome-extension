/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/page-worker/backend-service.js
class BackendService {
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
;// CONCATENATED MODULE: ./src/options/index.js


const tokenInput = document.querySelector('#token');
const saveButton = document.querySelector('#save');
const options_status = document.querySelector('#status');
const switchOff = document.querySelector('#switchOff');
const switchOn = document.querySelector('#switchOn');

switchOff.addEventListener('click', async (event) => {
    chrome.storage.sync.set({
        isDisabled: true,
    });
    toggleSwitchButtons(true);
});

switchOn.addEventListener('click', async (event) => {
    chrome.storage.sync.set({
        isDisabled: false,
    });
    toggleSwitchButtons(false);
});

saveButton.addEventListener('click', async (event) => {
    const token = tokenInput.value.trim();
    const result = await showUserData(token);
    let statusText = 'Ok';
    if (!result) {
        statusText = 'Неверный токен';
    } else {
        chrome.storage.sync.set({
            personalToken: token,
        });
    }

    options_status.innerText = statusText;
    setTimeout(() => {
        options_status.innerText = '';
    }, 2000);


    event.preventDefault();
});


(async () => {
    tokenInput.value = await loadConfig();
    showUserData(tokenInput.value);

    const isDisabled = await chrome.storage.sync.get('isDisabled');
    toggleSwitchButtons(isDisabled.isDisabled);
})();

async function showUserData(token) {
    if (!token) {
        return false;
    }
    const backendService = new BackendService(token, false);
    const userData = await backendService.getUserData();
    if (userData) {
        document.querySelector('#userDetail').style.visibility = 'visible';
        document.querySelector('#name').innerText = userData.name;
        document.querySelector('#idNumber').innerText = userData.idNumber;
        document.querySelector('#shortMobilePhone').innerText = userData.shortMobilePhone;
    }

    return userData !== null;
}

function toggleSwitchButtons(isDisabled) {
    if (isDisabled) {
        switchOff.style.visibility = 'hidden';
        switchOn.style.visibility = 'visible';
    }
    else {
        switchOff.style.visibility = 'visible';
        switchOn.style.visibility = 'hidden';
    }
}

async function loadConfig() {
    const token = await chrome.storage.sync.get('personalToken');

    return token.personalToken || '';
}
/******/ })()
;