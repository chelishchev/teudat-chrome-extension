import {Departments} from "./departments";
import {AutoQueue} from "./queue";

const MAX_RESPONSE_RESULT = 2;
const TIMEOUT = 4*1000;
const TIMEOUT_TO_REPEAT = 3*60*1000;
export class FinderSlots
{
	constructor({departments, resultTable, backendService})
	{
		this.preventContinue = false;
		/** @type {BackendService} */
		this.backendService = backendService;
		/** @type {ResultTable} */
		this.resultTable = resultTable;
		this.resultTableInserted = false;
		/** @type {Departments} */
		this.departments = departments;
		this.tokenConfig = {};
	}

	loadRequestConfig()
	{
		const syncConfig = document.body.dataset.syncConfig;
		if (syncConfig === undefined) {
			this.tokenConfig = {};
		} else {
			this.tokenConfig = JSON.parse(syncConfig);
		}
	}

	#sleep() {
		return new Promise(resolve => setTimeout(resolve, TIMEOUT));
	}

	async start()
	{
		const findLocationBlock = document.querySelector(".locationSearchInput.ng-isolate-scope")?.parentNode.parentNode;
		if (!findLocationBlock) {
			console.warn("Can't find location block");
			return;
		}

		if (!this.resultTableInserted) {
			findLocationBlock.prepend(this.resultTable.createNode());
			this.resultTableInserted = true;
		} else {
			this.resultTable.clearResults();
		}

		this.resultTable.changeLastCheckDatetime();
		this.resultTable.changeStatusAsWorking();

		const departments = this.departments;
		const autoQueue = new AutoQueue();

		const _ = ({departmentInfo} = {}) => {
			return async () => {
				await this.loadRequestConfig();
				this.resultTable.changeDepartment(departmentInfo.Label);
				await this.sendMessage({
					action: 'page-worker-work-with',
					department: departmentInfo,
				});
				if (this.preventContinue)
				{
					return {department: departmentInfo, data: {Success: false, Message: 'STOPPED'}};
				}

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
				else
				{
					this.resultTable.changeStatusAsError();
				}
			});
			autoQueue.enqueue(this.#sleep);
		}

		autoQueue.enqueue(() => new Promise(resolve => { resolve(); })).then(() => {
			this.resultTable.changeStatusAsContinue();
			console.log('WAITING FOR NEXT REQUEST', Date.now(), Date.now() + TIMEOUT);

			this.sendMessage({
				action: 'page-worker-finish',
			});

			setTimeout(() => {
				this.start();
			}, TIMEOUT_TO_REPEAT);
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
			console.log('START REQUEST', Date.now());
			const requestHeaders = this.getRequestHeaders();

			if (requestHeaders["preparedvisittoken"] === undefined) {
				console.warn("Can't find preparedvisittoken");
				resolve({department: department, data: {Success: false, Message: 'Can\'t find preparedvisittoken'}});

				return;
			}

			const currentDateString = this.getCurrentDateString();

			fetch(`https://central.myvisit.com/CentralAPI/SearchAvailableDates?maxResults=${MAX_RESPONSE_RESULT}&serviceId=${department.ServiceId}&startDate=${currentDateString}`, {
				"headers": requestHeaders,
				"referrer": "https://myvisit.com/",
				"referrerPolicy": "no-referrer-when-downgrade",
				"body": null,
				"method": "GET",
				"mode": "cors",
				"credentials": "include"
			}).then(response => {
				if(response.ok) {
					return response.json().then(data => {
						const status = response.status;
						resolve({department, data});
						console.log('RESPONSE', {department, data}, status);
					});
				}

				this.backendService.notify('reloadPage');
				resolve({department: department, data: {Success: false, Message: 'BAD RESPONSE'}});

				console.warn('BAD RESPONSE', response);
			}).catch((error) => {
				this.preventContinue = true;
				this.backendService.notify('reloadPage');
				resolve({department: department, data: {Success: false, Message: error.message}});

				console.log('BAD RESPONSE', error);
			});
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
			this.resultTable.appendResult({
				href: `https://myvisit.com/#!/home/service/${department.ServiceId}`,
				name: department.Label,
			})

			highlightData.color = "currentcolor";
		}
		else
		{
			this.resultTable.appendResult({
				href: `https://myvisit.com/#!/home/service/${department.ServiceId}`,
				name: department.Label,
				date: data[0].calendarDate.substring(0, 10),
			})

			highlightData.color = "darkseagreen";
			highlightData.text = data[0].calendarDate.substring(0, 10);
		}

		this.departments.highlightAddress(department, highlightData);
	}
}