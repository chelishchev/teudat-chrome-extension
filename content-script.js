(async () => {
    const status = await chrome.storage.sync.get('isDisabled');
    const token = await chrome.storage.sync.get('personalToken');

    document.documentElement.dataset.syncIsDisabled = JSON.stringify(status.isDisabled);
    document.documentElement.dataset.syncToken = JSON.stringify(token.personalToken);

    const s = document.createElement('script')
    s.src = chrome.runtime.getURL('dist/page-worker.bundle.js')
    s.onload = async function () {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
    document.documentElement.dataset.gifPath = chrome.runtime.getURL('images/process.gif');
})();