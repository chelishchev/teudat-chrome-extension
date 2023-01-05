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
				urls: ['*://*/*'],
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
	}

	handleSiteOpened(details) {
		const tabId = details.tabId;

		if (details.statusCode !== 200) {
			return;
		}

		// chrome.scripting.executeScript({
		// 	target: {tabId: tabId},
		// 	files: ['dist/page-worker.bundle.js'],
		// }, () => {
		// 	console.log('page-worker.bundle.js injected');
		// });
	}

	handleSendHeaders(details)
	{
		const config = this.getConfig(details.requestHeaders);
		if (config['application-api-key'])
		{
			console.warn('onpageRequest', config, details);
			chrome.storage.local.set({config});
		}
	}

	getConfig(headers)
	{
		const importantHeaders = {
			'preparedvisittoken': null,
			'application-api-key': null,
			'application-name': null,
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
