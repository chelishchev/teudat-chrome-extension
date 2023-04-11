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
const switcher = document.querySelector('#switcher');

switcher.addEventListener('click', async (event) => {
    const desiredStatus = switcher.dataset.isDisabled === '1' ;
    chrome.storage.sync.set({
        isDisabled: desiredStatus,
    });
    toggleSwitchButtons(desiredStatus);
});

saveButton.addEventListener('click', async (event) => {
    const token = tokenInput.value.trim();
    const result = await saveNewToken(token);
    let statusText = 'Код сохранен 👌';
    if (!result) {
        statusText = 'Неверный уникальный код :(';
    } else {
        showUserData(result)
    }

    const currentText = saveButton.textContent;
    saveButton.textContent = statusText;
    saveButton.style.pointerEvents = 'none';

    setTimeout(() => {
        saveButton.textContent = currentText;
        saveButton.style.pointerEvents = 'auto';
    }, 2000);


    event.preventDefault();
});


(async () => {
    tokenInput.value = await loadConfig();
    const userData = await loadUserData(tokenInput.value);
    if (userData) {
        showUserData(userData);
    }

    const isDisabled = await chrome.storage.sync.get('isDisabled');
    toggleSwitchButtons(isDisabled.isDisabled);
})();

async function saveNewToken(token) {
    if (!token) {
        return null;
    }

    const userData = await loadUserData(token);
    if (userData) {
        chrome.storage.sync.set({
            personalToken: token,
        });
    }

    return userData;
}

function showUserData(userData) {
    document.querySelector('#userDetail').style.visibility = 'visible';
    document.querySelector('#name').innerText = userData.name;
    document.querySelector('#idNumber').innerText = userData.idNumber;
    document.querySelector('#shortMobilePhone').innerText = userData.shortMobilePhone;
}

async function loadUserData(token, ) {
    if (!token) {
        return null;
    }

    const backendService = new BackendService(token, false);

    return await backendService.getUserData();
}

function toggleSwitchButtons(isDisabled) {
    if (isDisabled) {
        switcher.dataset.isDisabled = '0';
        switcher.textContent = 'Включить';
    } else {
        switcher.dataset.isDisabled = '1';
        switcher.textContent = 'Отключить';
    }
}

async function loadConfig() {
    const token = await chrome.storage.sync.get('personalToken');

    return token.personalToken || '';
}
/******/ })()
;