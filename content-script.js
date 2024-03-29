(async () => {
    const status = await chrome.storage.sync.get('isDisabled');
    const token = await chrome.storage.sync.get('personalToken');
    const configDepartments = await chrome.storage.sync.get('departments');

    document.documentElement.dataset.syncIsDisabled = JSON.stringify(('isDisabled' in status) ? status.isDisabled : false);
    document.documentElement.dataset.syncToken = JSON.stringify(('personalToken' in token) ? token.personalToken : false.personalToken);
    document.documentElement.dataset.configDepartments = JSON.stringify(configDepartments.departments || []);

    const s = document.createElement('script')
    s.src = chrome.runtime.getURL('dist/page-worker.bundle.js')
    s.onload = async function () {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
    document.documentElement.dataset.gifPath = chrome.runtime.getURL('images/process.gif');


    window.addEventListener("message", function (event) {
        if (event.source !== window)
            return;

        if (event.data.type === "FETCH") {
            const { reqId, url, ...fetchProps } = event.data;

            fetch(url, fetchProps).then(async response => {
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
            }, () => {
                return {
                    status: 503,
                    response: null,
                }
            }).then(response => {
                window.postMessage({
                    type: 'FETCH_RESPONSE',
                    reqId: reqId,
                    response: response,
                }, window.location.origin)
            });
        }
    }, false);
})();