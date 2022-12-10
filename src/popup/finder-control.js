export class FinderControl
{
	constructor()
	{
		this.node = this.createButtonNode();
	}

	createButtonNode()
	{
		const button = document.createElement('button');
		button.classList.add('find-button');
		button.innerText = 'Find!';

		return button;
	}

	renderTo(node)
	{
		node.appendChild(this.node);
		this.registerClickHandler();
	}

	registerClickHandler()
	{
		this.node.addEventListener('click', this.handleClick.bind(this));
	}

	listenForMessages()
	{
		chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
			if (message.action === 'page-worker-finish')
			{
				this.handleWorkerFinish(message);
			}
			else if (message.action === 'page-worker-work-with')
			{
				this.handleWorkerProgress(message);
			}
		});
	}

	async handleClick(event)
	{
		let button = event.target;
		if (!button.classList.contains('find-in-progress'))
		{
			button.classList.add('find-in-progress');
			button.innerText = 'Working...';

			const message = {
				action: 'find',
			};

			const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
			chrome.tabs.sendMessage(tab.id, message, response => {
				// handle the response from the page here
			});
		}
	}

	handleWorkerFinish(message)
	{
		this.node.classList.remove('find-in-progress');
		this.node.innerText = 'Finished!';
	}

	handleWorkerProgress(message)
	{
		this.node.innerText = message.location;
	}
}
