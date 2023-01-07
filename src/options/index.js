import {BackendService} from "../page-worker/backend-service";

const tokenInput = document.querySelector('#token');
const saveButton = document.querySelector('#save');
const status = document.querySelector('#status');

saveButton.addEventListener('click', (event) => {
    const token = tokenInput.value.trim();
    chrome.storage.sync.set({
        personalToken: token,
    });
    status.innerText = 'Ok';
    setTimeout(() => {
        status.innerText = '';
    }, 2000);

    showUserData(tokenInput.value);

    event.preventDefault();
});


(async () => {
    tokenInput.value = await loadConfig();
    showUserData(tokenInput.value);
})();

async function showUserData(token) {
    if (!token) {
        return;
    }
    const backendService = new BackendService(token);
    const userData = await backendService.getUserData();
    if(userData) {
        document.querySelector('#userData').innerText = JSON.stringify(userData);
    }
}

async function loadConfig() {
    const token = await chrome.storage.sync.get('personalToken');

    return token.personalToken || '';
}