import {BackendService} from "../page-worker/backend-service";
import {Departments} from "../page-worker/departments";


const tokenInput = document.querySelector('#token');
const saveButton = document.querySelector('#save');
const switcher = document.querySelector('#switcher');

const selectComponent = initSelectComponent();
selectComponent.on('change', () => {
    chrome.storage.sync.set({
        departments: selectComponent.getValue().map(v => parseInt(v)),
    });
});

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

    selectComponent.setValue(await loadSelectedDepartments());

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

async function loadSelectedDepartments() {
    const data = await chrome.storage.sync.get('departments');

    return data.departments || [];
}

function initSelectComponent()
{
    let choices = [];
    const departments = new Departments();
    for (let department of departments)
    {
        choices.push({id: department.ServiceId, label: department.Label, city: department.City});
    }
    return new TomSelect("#departments", {
        plugins: ['remove_button'],
        create: false,
        maxItems: 5,
        valueField: 'id',
        labelField: 'label',
        searchField: ['label', 'city'],
        options: choices,
    });
}