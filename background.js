class RequestTokenExtractor
{
	constructor()
	{
		this.registerListener();
	}

	registerListener()
	{
		chrome.webRequest.onSendHeaders.addListener(
			this.handleSendHeaders.bind(this),
			{
				urls: ['https://central.myvisit.com/*'],
				types: ['main_frame', 'sub_frame', 'xmlhttprequest'],
			},
			['requestHeaders'],
		);

		chrome.webRequest.onCompleted.addListener(
			this.handleSiteOpened.bind(this),
			{
				urls: ['https://myvisit.com/*'],
				types: ['main_frame'],
			}
		);

		chrome.runtime.onInstalled.addListener(details => {
			if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
				chrome.runtime.openOptionsPage(() => {
					console.log('Installed. Options page opened');
				});
			}
			if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
				chrome.storage.sync.get('personalToken').then((data) => {
					if (!data.personalToken) {
						chrome.runtime.openOptionsPage(() => {
							console.log('Updated. Options page opened');
						});
					}
				});

				// chrome.runtime.setUninstallURL('https://example.com/extension-survey');
			}
		});
	}

	handleSiteOpened(details) {
		const tabId = details.tabId;

		if (details.statusCode !== 200) {
			return;
		}

		chrome.scripting.executeScript({
			target: {tabId: tabId},
			files: ['injected-by-background.js'],
		}, () => {
			console.log('injected-by-background.js injected');
		});
	}

	handleSendHeaders(details)
	{
		const config = this.getConfig(details.requestHeaders);
		if (config['application-api-key'])
		{
			console.log('requestHeaders: ', config);
			chrome.storage.local.set({config});

			const message = {
				action: 'sync-config',
			};
			chrome.tabs.sendMessage(details.tabId, message, response => {});
		}
	}

	getConfig(headers)
	{
		const importantHeaders = {
			'preparedvisittoken': null,
			'application-api-key': null,
			'application-name': null,
			'user-agent': null,
		};

		for (const header of headers)
		{
			const name = header.name ? header.name.toLowerCase() : null;
			if (name && importantHeaders.hasOwnProperty(name))
			{
				importantHeaders[name] = header.value;
			}
		}

		return importantHeaders;
	}
}

new RequestTokenExtractor();
