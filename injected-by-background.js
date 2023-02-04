chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
	if (request.action === 'sync-config')
	{
        const config = await chrome.storage.local.get(['config']);
        const status = await chrome.storage.sync.get('isDisabled');
        const token = await chrome.storage.sync.get('personalToken');

        document.documentElement.dataset.syncConfig = JSON.stringify(config.config);
        document.documentElement.dataset.syncIsDisabled = status.isDisabled;
        document.documentElement.dataset.syncToken = token.personalToken;
	}

	sendResponse(JSON.stringify({success: true}));
})