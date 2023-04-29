import {Departments} from "./departments";
import {AutoQueue} from "./queue";
import {FetchTransport} from "./fetch-transport";

const MAX_DEPARTMENT_STEPS = 5;
const MAX_RESPONSE_RESULT = 2;
const TIMEOUT = 5*1000;
const TIMEOUT_TO_REPEAT = 3*60*1000;
export class FinderSlots
{
	constructor({departments, resultTable, backendService, prepareVisit, configDepartments})
	{
		/** @type {PrepareVisit} */
		this.prepareVisit = prepareVisit;
		this.preventContinue = false;
		/** @type {BackendService} */
		this.backendService = backendService;
		/** @type {ResultTable} */
		this.resultTable = resultTable;
		this.resultTableInserted = false;
		/** @type {Departments} */
		this.departments = departments;
		this.configDepartments = configDepartments;
		this.tokenConfig = {};
	}

	async loadRequestConfig()
	{
		const syncConfig = document.documentElement.dataset.syncConfig;
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
				if (this.preventContinue)
				{
					return {department: departmentInfo, data: {Success: false, Message: 'STOPPED'}};
				}
				this.resultTable.changeDepartment(departmentInfo.Label);
				console.log('page-worker-work-with', departmentInfo);

				return await this.requestSlots(departmentInfo);
			};
		};

		let counter = 0;
		for (let department of departments)
		{
			counter++;
			if (!this.configDepartments.length)
			{
				if (counter > MAX_DEPARTMENT_STEPS)
				{
					break;
				}
			}
			else if (!this.configDepartments.includes(department.ServiceId))
			{
				continue;
			}

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
					this.resultTable.changeStatusAsError(data.Type);
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
				this.preventContinue = false;
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
		};
	}

	requestSlots(department)
	{
		return new Promise((resolve, reject) => {
			console.log('START REQUEST', Date.now());
			const requestHeaders = this.getRequestHeaders();

			if (requestHeaders["preparedvisittoken"] === undefined) {
				console.warn("Can't find preparedvisittoken");
				resolve({department: department, data: {Success: false, Message: 'Can\'t find preparedvisittoken', Type: 'preparedvisittoken'}});

				return;
			}

			const currentDateString = this.getCurrentDateString();
			FetchTransport.query(
				`https://piba-api.myvisit.com/CentralAPI/SearchAvailableDates?maxResults=${MAX_RESPONSE_RESULT}&serviceId=${department.ServiceId}&startDate=${currentDateString}`,
				null,
				'GET',
				requestHeaders,
				{
					"referrer": "https://piba.myvisit.com/",
					"referrerPolicy": "no-referrer-when-downgrade",
					// "mode": "cors",
					"credentials": "include",
				}
			).then(async response => {
				const status = response.status;
				if (status >= 200 && status < 300)
				{
					resolve({department, data: response.response});
					console.log('RESPONSE', {department, data: response.response}, status);
					return;
				}
				if (status === 503)
				{
					const newVisitToken = await this.prepareVisit.getPreparedVisitToken();
					if (newVisitToken)
					{
						this.tokenConfig["preparedvisittoken"] = newVisitToken;
						let syncConfig = document.documentElement.dataset.syncConfig;
						if (syncConfig)
						{
							syncConfig = JSON.parse(syncConfig);
							syncConfig["preparedvisittoken"] = newVisitToken;
							document.documentElement.dataset.syncConfig = JSON.stringify(syncConfig);
						}
					}
				}
				if (status === 403 || status === 401)
				{
					this.preventContinue = true;
					this.backendService.notify('reloadPage');
				}
				resolve({department: department, data: {Success: false, Message: 'BAD RESPONSE', Type: 'reloadPage'}});

				console.warn('BAD RESPONSE 1', response);
			}).catch((error) => {
				this.preventContinue = true;
				this.backendService.notify('blockedPage');
				resolve({department: department, data: {Success: false, Message: error.message, Type: 'blockedPage'}});

				console.log('BAD RESPONSE 2', error);
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
				href: `https://piba.myvisit.com/#!/home/provider/56?d=${department.ServiceId}`,
				name: department.Label,
			})

			highlightData.color = "currentcolor";
		}
		else
		{
			this.resultTable.appendResult({
				href: `https://piba.myvisit.com/#!/home/provider/56?d=${department.ServiceId}`,
				name: department.Label,
				date: data[0].calendarDate.substring(0, 10),
				serviceId: department.ServiceId,
			})

			highlightData.color = "darkseagreen";
			highlightData.text = data[0].calendarDate.substring(0, 10);
		}

		// this.departments.highlightAddress(department, highlightData);
	}
}