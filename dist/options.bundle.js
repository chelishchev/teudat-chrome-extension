/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/page-worker/backend-service.js
class BackendService {
    constructor(token) {
        this.token = token;
        this.userData = null;
    }

    async getUserData() {
        if (this.userData !== null) {
            return this.userData;
        }

        return this.get('getMySelf').then(response => {
            if (response.ok) {
                return response.json();
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
        const url = `https://myvisit.pumpkinlatte.club/api/${action}`;
        // const url = `http://127.0.0.1:8000/api/${action}`;

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
    const backendService = new BackendService(token);
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