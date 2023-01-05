chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
	if (request.action === 'sync-config')
	{
        const config = await new Promise((resolve) => {
            chrome.storage.local.get(['config'], (result) => {
                resolve(result.config);
            });
        });

        const syncConfig = JSON.stringify(config);
        document.body.dataset.syncConfig = syncConfig;
	}

	sendResponse(JSON.stringify({success: true}));
})