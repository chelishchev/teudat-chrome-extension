import {BackendService} from "../page-worker/backend-service";

const tokenInput = document.querySelector('#token');
const saveButton = document.querySelector('#save');
const status = document.querySelector('#status');

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

async function loadConfig() {
    const token = await chrome.storage.sync.get('personalToken');

    return token.personalToken || '';
}