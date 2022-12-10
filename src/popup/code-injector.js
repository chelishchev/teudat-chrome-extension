export class CodeInjector
{
    constructor()
    {
    }

    async inject()
    {
        const message = {
            action: 'inject-code',
        };

        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

		return new Promise((resolve, reject) => {
            chrome.tabs.sendMessage(tab.id, message, response => {
                if (!response)
                {
                    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                        const [tab] = tabs;
                        chrome.scripting.executeScript({
                            target: {tabId: tab.id},
                            files: ['dist/page-worker.bundle.js'],
                        }, () => {
                            resolve();
                        });
                    });
                }
                else
                {
                    resolve();
                }
            });
		});
    }
}