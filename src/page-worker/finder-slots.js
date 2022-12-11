import {Departments} from "./departments";
import {AutoQueue} from "./queue";

const TIMEOUT = 3300;
export class FinderSlots
{
	constructor(departments)
	{
		/** @type {Departments} */
		this.departments = departments;
		this.tokenConfig = {};
	}

	loadRequestConfig()
	{
		return new Promise(resolve => {
			chrome.storage.sync.get("config", ({config}) => {
				this.tokenConfig = config;
				resolve();
			});
		});
	}

	#sleep() {
		return new Promise(resolve => setTimeout(resolve, TIMEOUT));
	}
	start()
	{
		const departments = this.departments;
		const autoQueue = new AutoQueue();

		const _ = ({departmentInfo} = {}) => {
			return async () => {
				await this.sendMessage({
					action: 'page-worker-work-with',
					department: departmentInfo,
				});

				return await this.requestSlots(departmentInfo);
			};
		};

		for (let department of departments)
		{
			let departmentInfo = department;
			autoQueue.enqueue(_({departmentInfo})).then(({department, data}) => {
				console.log('QUEUE', {department, data});
				if (data.Success)
				{
					console.warn(arguments, department, data);
					console.log(department.name, JSON.stringify(data.Results), Date.now());

					if (data.TotalResults > 0)
					{
						this.highlightAddress(department, data.Results);
					}
					else
					{
						this.highlightAddress(department, []);
					}
				}
			});
			autoQueue.enqueue(this.#sleep);
		}

		autoQueue.enqueue(() => new Promise(resolve => { resolve(); })).then(() => {
			this.sendMessage({
				action: 'page-worker-finish',
			});
		});
	}

	async sendMessage(message)
	{
		console.log('sendMessage', message);

		// const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
		// return await chrome.tabs.sendMessage(tab.id, message);
		return true;
	}

	getRequestHeaders()
	{
		return {
			"accept": "application/json, text/plain, */*",
			"accept-language": "en",
			"application-api-key": this.tokenConfig["application-api-key"],
			"application-name": this.tokenConfig["application-name"],
			"cache-control": "no-cache",
			"pragma": "no-cache",
			"preparedvisittoken": this.tokenConfig["preparedvisittoken"],
			"sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"macOS\"",
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-site"
		};
	}

	requestSlots(department)
	{
		return new Promise((resolve, reject) => {
			const currentDateString = this.getCurrentDateString();

			fetch(`https://central.myvisit.com/CentralAPI/SearchAvailableDates?maxResults=31&serviceId=${department.ServiceId}&startDate=${currentDateString}`, {
				"headers": this.getRequestHeaders(),
				"referrer": "https://myvisit.com/",
				"referrerPolicy": "no-referrer-when-downgrade",
				"body": null,
				"method": "GET",
				"mode": "cors",
				"credentials": "include"
			}).then(response => response.json().then(data => {
				resolve({department, data});
				console.log('RESPONSE', {department, data});
			}));

		});
	}

	getCurrentDateString()
	{
		const currentDate = new Date();
		const ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(currentDate);
		const mo = new Intl.DateTimeFormat('en', {month: '2-digit'}).format(currentDate);
		const da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(currentDate);

		return `${ye}-${mo}-${da}`;
	}

	highlightAddress(department, data)
	{
		let highlightData = {};
		if (!data || !data.length)
		{
			highlightData.color = "currentcolor";
		}
		else
		{
			highlightData.color = "darkseagreen";
			highlightData.text = data[0].calendarDate.substring(0, 10);
		}

		this.departments.highlightAddress(department, highlightData);
	}
}