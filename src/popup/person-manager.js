import {Person} from "./person";
import {ColorByIndex} from "./colors";
import {blablaClass} from "../page-worker/form-filler";

export class PersonManager
{
	constructor(colorByIndex)
	{
		this.colorByIndex = colorByIndex;
		this.people = [];
	}

	ready()
	{
		return new Promise((resolve, reject) => {
			chrome.tabs.query({active: true, currentWindow: true}, tabs => {
				const [tab] = tabs;
				chrome.scripting.executeScript({
					target: {tabId: tab.id},
					files: ['dist/page-worker.bundle.js'],
				}, () => {
					resolve();
				});
			});
		});
	}

	loadPeopleFromConfig()
	{
		return new Promise((resolve, reject) => {
			chrome.storage.sync.get(['people'], result => {
				const config = result.people || this.getDefaultPersonsConfig();
				this.people = config.map((personData, i) => new Person(
					personData.phoneNumber,
					personData.idNumber,
					personData.name,
					this.colorByIndex.getColor(i),
				));

				resolve();
			});
		});
	}

	getPeople()
	{
		return this.people || [];
	}

	getDefaultPersonsConfig()
	{
		return [
			{
				phoneNumber: '***REMOVED***',
				idNumber: '***REMOVED***',
				name: 'Nadia',
			},
			{
				phoneNumber: '***REMOVED***',
				idNumber: '***REMOVED***',
				name: 'Ivan',
			},
		];
	}

	createButtonNodeByPerson(person, index)
	{
		const button = document.createElement('button');
		button.classList.add('person-button');
		button.style.backgroundColor = person.getColor();
		button.innerText = person.getName();
		button.dataset.personIndex = index;

		return button;
	}

	renderTo(node)
	{
		this.getPeople().forEach((person, index) => {
			const personNode = this.createButtonNodeByPerson(person, index);
			node.appendChild(personNode);
		});
	}

	registerClickHandlerForPersonButton()
	{
		document.body.addEventListener('click', this.handleClickOnPersonButton.bind(this));
	}

	async handleClickOnPersonButton(event)
	{
		let personButton = event.target;
		if (personButton.classList.contains('person-button'))
		{
			personButton.classList.add('current');

			const message = {
				action: 'fill',
				person: this.getPeople()[personButton.dataset.personIndex]?.exportToMessage(),
			};

			console.log('person-button', personButton);
			const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
			chrome.tabs.sendMessage(tab.id, message, response => {
				// handle the response from the page here
			});
		}
	}
}
