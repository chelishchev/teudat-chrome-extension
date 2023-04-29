chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    sendResponse(JSON.stringify({success: true}));

	if (request.action === 'sync-config')
	{
        const config = request.config;
        const status = await chrome.storage.sync.get('isDisabled');
        const token = await chrome.storage.sync.get('personalToken');
        const configDepartments = await chrome.storage.sync.get('departments');
        console.log('sync', config, status, token, configDepartments);

        document.documentElement.dataset.syncConfig = JSON.stringify(config || {});
        document.documentElement.dataset.syncIsDisabled = JSON.stringify(status.isDisabled || false);
        document.documentElement.dataset.syncToken = token.personalToken;
        document.documentElement.dataset.configDepartments = JSON.stringify(configDepartments.departments || []);
	}
    if (request.action === 'site-opened')
    {
        console.log('site-opened', request.url)
        const initialUrl = new URL(request.url);
        const hash = initialUrl.hash;
        if (hash && hash.includes('?'))
        {
            const urlSearchParams = new URLSearchParams(hash.substring(hash.indexOf('?') + 1));
            document.documentElement.dataset.desiredDepartmentId = urlSearchParams.get('d')
        }
    }

    return true;
})