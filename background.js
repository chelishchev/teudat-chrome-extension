class Analyzer
{
	constructor()
	{
		chrome.webRequest.onSendHeaders.addListener(
			this.onSendHeaders.bind(this),
			{
				urls: ["*://*/*"],
				types: ["main_frame", "sub_frame", "xmlhttprequest"]
			},
			["requestHeaders"]
		);
	}

	onSendHeaders(details)
	{
		const config = this.getConfig(details.requestHeaders);
		if (config['application-api-key'])
		{
			//config['departments'] = this.getDepartments();
			console.warn('onpageRequest', config, details);
			chrome.storage.sync.set({config});
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

const analyzer = new Analyzer();