import {Departments} from "./departments";
import AutoSelectDepartment from "./auto-select-department";

const TIMEOUT = 3*60*1000;

export class LocationSearch {
	constructor({departments, resultTable, xhrSubstitute, backendService, configDepartments}) {
		this.configDepartments = configDepartments;
		/** @type {BackendService} */
		this.backendService = backendService;
		/** @type {ResultTable} */
		this.resultTable = resultTable;
		/** @type {Departments} */
		this.departments = departments;
		/** @type {XhrSubstitute} */
		this.xhrSubstitute = xhrSubstitute;
		this.fallback = null;
		this.resultTableInserted = false;
		this.tokenConfig = {};
		this.originalLocationSearchUrl = null;

		this.xhrSubstitute.addHandler("https://central.myvisit.com/CentralAPI/LocationSearch", (url, response) => {
			this.handleLocationSearchResponse(JSON.parse(response));
			this.originalLocationSearchUrl = url;
		});
		this.xhrSubstitute.addHandler("https://piba-api.myvisit.com/CentralAPI/LocationSearch", (url, response) => {
			this.handleLocationSearchResponse(JSON.parse(response));
			this.originalLocationSearchUrl = url;
		});
	}

	getSyncValue(key)
	{
		if (!(key in document.documentElement.dataset))
		{
			return null;
		}
		const value = document.documentElement.dataset[key];

		return JSON.parse(value);
	}
	runAutoSelectDepartment()
	{
		const desiredDepartmentId = this.getSyncValue('desiredDepartmentId');
		if (desiredDepartmentId)
		{
			const autoSelectDepartment = new AutoSelectDepartment(desiredDepartmentId, {
				departments: this.departments,
				xhrSubstitute: this.xhrSubstitute,
				backendService: this.backendService,
			});

			setTimeout(() => {
				autoSelectDepartment.helpPeopleToSelectDesiredDepartment();
			}, 1000);
		}
	}

	loadRequestConfig()
	{
		const syncConfig = document.documentElement.dataset.syncConfig;
		if (syncConfig === undefined) {
			this.tokenConfig = {};
		} else {
			this.tokenConfig = JSON.parse(syncConfig);
		}
	}

	getRequestHeaders()
	{
		return {
			"accept": "application/json, text/plain, */*",
			"accept-language": "en",
			"application-api-key": this.tokenConfig["application-api-key"],
			"application-name": this.tokenConfig["application-name"],
			"preparedvisittoken": this.tokenConfig["preparedvisittoken"],
			"user-agent": this.tokenConfig["user-agent"],
			"cache-control": "no-cache",
			"pragma": "no-cache",
		};
	}

	queryLocation() {
		return new Promise((resolve, reject) => {
			console.log('START REQUEST', Date.now());
			const requestHeaders = this.getRequestHeaders();

			if (requestHeaders["preparedvisittoken"] === undefined) {
				console.warn("Can't find preparedvisittoken");
				resolve({});

				return;
			}

			fetch(this.originalLocationSearchUrl, {
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
						resolve(data);
					});
				}
				//todo work with "NEED TO RELOAD", "NEED TO AUTH". Probably need to reload page when status 403
				this.backendService.notify('reloadPage');
				// response.status
				resolve({});

				console.warn('BAD RESPONSE', response);

			}).catch((error) => {
				resolve({});

				console.warn('BAD RESPONSE', error);
			});
		});
	}

	handleLocationSearchResponse(response) {
		if (!response || !response.Success || !response.Results) {

			this.resultTable.changeStatusAsError();
			this.backendService.notify('reloadPage');

			return;
		}
		this.runAutoSelectDepartment();

		if (!this.hasResultDateInLocationName(response.Results[0])) {
			console.warn("Can't find date in location name");

			if (this.fallback) {
				console.warn("Fall back to original location search");

				this.fallback(response.Results);
			}

			return;
		}

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
		const goodDepartmentServiceIds = departments.getGoodDepartmentServiceIds();

		response.Results.forEach(departmentInfo => {
			if(!departmentInfo.ServiceId || !goodDepartmentServiceIds.includes(departmentInfo.ServiceId)) {
				return;
			}

			if (!this.configDepartments.length || this.configDepartments.includes(departmentInfo.ServiceId))
			{
				this.addDepartmentToResultTable(departmentInfo);
			}
		});

		console.log('WAITING FOR NEXT REQUEST', Date.now(), Date.now() + TIMEOUT);
		setTimeout(async () => {
			this.loadRequestConfig();
			const data = await this.queryLocation();
			this.handleLocationSearchResponse(data);
		}, TIMEOUT);
	}

	hasResultDateInLocationName(department) {
		return this.matchDateFromLocationName(department.LocationName) !== null;
	}

	matchDateFromLocationName(locationName) {
		const regex = /(\d{2})\/(\d{2})\/(\d{4})/;

		return locationName.match(regex);
	}

	addDepartmentToResultTable(department)
	{
		const probablyDateString = department.LocationName;
		const match = this.matchDateFromLocationName(probablyDateString);
		const date = match[0] ? `${match[3]}-${match[2]}-${match[1]}` : null;
		const label = department.ExtRef.replace(/ShowDate_/g, '')

		if (!date)
		{
			this.resultTable.appendResult({
				href: `https://piba.myvisit.com/#!/home/provider/56?d=${department.ServiceId}`,
				name: label,
			})
		}
		else
		{
			this.resultTable.appendResult({
				href: `https://piba.myvisit.com/#!/home/provider/56?d=${department.ServiceId}`,
				name: label,
				date: date,
				serviceId: department.ServiceId,
			});
		}
	}

	fallbackWhenDateNotInLabel(fallback) {
		this.fallback = fallback;
	}
}