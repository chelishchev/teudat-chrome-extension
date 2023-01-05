import {Departments} from "./departments";

const TIMEOUT = 3300;

export class LocationSearch {
	constructor(departments, resultTable, xhrSubstitute) {
		/** @type {ResultTable} */
		this.resultTable = resultTable;
		/** @type {Departments} */
		this.departments = departments;
		/** @type {XhrSubstitute} */
		this.xhrSubstitute = xhrSubstitute;
		this.tokenConfig = {};

		this.xhrSubstitute.addHandler("https://central.myvisit.com/CentralAPI/LocationSearch", (url, response) => {
			console.log('https://central.myvisit.com/CentralAPI/LocationSearch', response, )
			this.handleLocationSearchResponse(response);
		});
	}

	handleLocationSearchResponse(responseText) {
		const response = JSON.parse(responseText);
		if (!response || !response.Success || !response.Results) {
			return;
		}

		const findLocationBlock = document.querySelector(".locationSearchInput.ng-isolate-scope").parentNode.parentNode;
		findLocationBlock.prepend(this.resultTable.createNode());
		this.resultTable.changeStatusAsWorking();

		const departments = this.departments;
		const goodDepartmentServiceIds = departments.getGoodDepartmentServiceIds();

		response.Results.forEach(departmentInfo => {
			if(!departmentInfo.ServiceId || !goodDepartmentServiceIds.includes(departmentInfo.ServiceId)) {
				return;
			}

			this.resultTable.changeDepartment(departmentInfo.Label);
			this.highlightAddress(departmentInfo);
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

	highlightAddress(department)
	{
		const probablyDateString = department.LocationName;
		const regex = /(\d{2})\/(\d{2})\/(\d{4})/;

		const match = probablyDateString.match(regex);
		const date = match[0] ? `${match[3]}-${match[2]}-${match[1]}` : null;

		console.log(probablyDateString,'date', date);

		if (!date)
		{
			this.resultTable.appendResult({
				href: `https://myvisit.com/#!/home/service/${department.ServiceId}`,
				name: department.Label || department.ExtRef,
			})

		}
		else
		{
			this.resultTable.appendResult({
				href: `https://myvisit.com/#!/home/service/${department.ServiceId}`,
				name: department.Label || department.ExtRef,
				date: date,
			})
		}
	}
}