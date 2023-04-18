class RequestTokenExtractor
{
	constructor()
	{
		this.cacheSiteOpened = new Map();
		this.registerListeners();
	}

	registerListeners()
	{
		chrome.webRequest.onSendHeaders.addListener(
			this.handleSendHeaders.bind(this),
			{
				urls: ['https://piba-api.myvisit.com/*'],
				types: ['main_frame', 'sub_frame', 'xmlhttprequest'],
			},
			['requestHeaders'],
		);

		chrome.webRequest.onCompleted.addListener(
			this.handleSiteOpened.bind(this),
			{
				urls: ['https://piba.myvisit.com/*', 'https://myvisit.com/*'],
				types: ['main_frame'],
			}
		);

		chrome.action.onClicked.addListener((tab) => {
			chrome.runtime.openOptionsPage(() => {});
		});

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

	injectScript(tabId, successCallback) {
		chrome.scripting.executeScript({
			target: {tabId: tabId},
			files: ['injected-by-background.js'],
		}, () => {
			console.log('Try to inject injected-by-background.js');

			successCallback();
		});
	}

	handleSiteOpened(details) {
		const tabId = details.tabId;
		console.log('handleSiteOpened', details.url, details.statusCode, tabId);

		if (details.statusCode !== 200) {
			return;
		}

		this.cacheSiteOpened.set(tabId, details.url);

		this.injectScript(tabId, () => {
			chrome.tabs.sendMessage(details.tabId, {
				action: 'site-opened',
				url: details.url,
			}, response => {
				console.log('site-opened response', response, chrome.runtime.lastError);
			});
		})
	}

	handleSendHeaders(details)
	{
		const config = this.getConfig(details.requestHeaders);
		if (config['application-api-key'])
		{
			console.log('requestHeaders: ', config);
			const message = {
				action: 'sync-config',
				config: config,
			};
			chrome.tabs.sendMessage(details.tabId, message, response => {
				console.log('sync-config', response, chrome.runtime.lastError);
				if (!response && chrome.runtime.lastError) {
					console.log('RETRY to inject injected-by-background.js');

					this.injectScript(details.tabId, () => {

						const openedUrlInTab = this.cacheSiteOpened.get(details.tabId);
						if (openedUrlInTab) {
							chrome.tabs.sendMessage(details.tabId, {
								action: 'site-opened',
								url: openedUrlInTab,
							}, response => {
								console.log('RETRY site-opened', response, chrome.runtime.lastError);
							});
						}

						chrome.tabs.sendMessage(details.tabId, message, response => {
							console.log('RETRY sync-config', response, chrome.runtime.lastError);
						});
					});

				}
			});
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
