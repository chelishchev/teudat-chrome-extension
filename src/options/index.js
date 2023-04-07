import {BackendService} from "../page-worker/backend-service";

const tokenInput = document.querySelector('#token');
const saveButton = document.querySelector('#save');
const status = document.querySelector('#status');
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
    let statusText = 'Ok';
    if (!result) {
        statusText = 'Неверный уникальный код';
    }

    status.innerText = statusText;
    setTimeout(() => {
        status.innerText = '';
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