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

    event.preventDefault();
});


(async () => {
    tokenInput.value = await loadConfig();
})();

async function loadConfig() {
    const token = await chrome.storage.sync.get('personalToken');

    return token.personalToken || '';
}