import {Departments} from "./departments";

const TIMEOUT = 3*60*1000;
const SEEMS_CLOSE_DATE = 14*24*60*60*1000;

export class LocationSearch {
	constructor(departments, resultTable, xhrSubstitute) {
		/** @type {ResultTable} */
		this.resultTable = resultTable;
		/** @type {Departments} */
		this.departments = departments;
		/** @type {XhrSubstitute} */
		this.xhrSubstitute = xhrSubstitute;
		this.resultTableInserted = false;
		this.tokenConfig = {};
		this.originalLocationSearchUrl = null;

		this.xhrSubstitute.addHandler("https://central.myvisit.com/CentralAPI/LocationSearch", (url, response) => {
			this.handleLocationSearchResponse(JSON.parse(response));
			this.originalLocationSearchUrl = url;
		});
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
				//todo sendMessage "NEED TO RELOAD", "NEED TO AUTH"
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

			this.addDepartmentToResultTable(departmentInfo);
		});

		console.log('WAITING FOR NEXT REQUEST', Date.now(), Date.now() + TIMEOUT);
		setTimeout(async () => {
			this.loadRequestConfig();
			const data = await this.queryLocation();
			this.handleLocationSearchResponse(data);
		}, TIMEOUT);
	}

	isCloseEnough(dateString) {
		return (new Date(dateString)).getTime() - Date.now() < SEEMS_CLOSE_DATE;
	}

	addDepartmentToResultTable(department)
	{
		const probablyDateString = department.LocationName;
		const regex = /(\d{2})\/(\d{2})\/(\d{4})/;

		const match = probablyDateString.match(regex);
		const date = match[0] ? `${match[3]}-${match[2]}-${match[1]}` : null;
		const label = department.ExtRef.replace(/ShowDate_/g, '')

		if (!date)
		{
			this.resultTable.appendResult({
				href: `https://myvisit.com/#!/home/service/${department.ServiceId}`,
				name: label,
			})

		}
		else
		{
			const closeEnough = this.isCloseEnough(date);
			this.resultTable.appendResult({
				href: `https://myvisit.com/#!/home/service/${department.ServiceId}`,
				name: label,
				date: date,
			}, closeEnough);

			if(closeEnough) {
				console.warn('CLOSE ENOUGH', label, date, Date.now());
				//todo sendMessage "WOW! Close date"
			}
		}
	}
}