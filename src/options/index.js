import {BackendService} from "../page-worker/backend-service";

const tokenInput = document.querySelector('#token');
const saveButton = document.querySelector('#save');
const status = document.querySelector('#status');
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

    status.innerText = statusText;
    setTimeout(() => {
        status.innerText = '';
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