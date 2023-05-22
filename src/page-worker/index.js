import {Departments} from "./departments";
import {FormFiller} from "./form-filler";
import {ResultTable} from "./result-table";
import XhrSubstitute from "./xhr-substitute";
import {LocationSearch} from "./location-search";
import {MouseEventSimulator} from "./mouse-simulator";
import {BackendService} from "./backend-service";
import {FinderSlots} from "./finder-slots";
import AutoSelectDepartment from "./auto-select-department";
import {PrepareVisit} from "./prepare-visit";

const xhrSubstitute = new XhrSubstitute();
xhrSubstitute.substitute();

(new MouseEventSimulator()).randomize();

(async () => {
	const token = getSyncValue('syncToken');
	const status = getSyncValue('syncIsDisabled');
	const configDepartments = getSyncValue('configDepartments');

	if (status) {
		console.warn('Disabled by user');

		return;
	}
	if (!token) {
		console.warn('Token not found!');

		return;
	}
	const backendService = new BackendService(token);

	const gifPath = document.documentElement.dataset.gifPath;
	const resultTable = new ResultTable({
		gifPath,
		backendService,
	});

	(new FormFiller({backendService})).fillByMySelf();

	const prepareVisit = new PrepareVisit({backendService});
	const departments = new Departments();

	const locationSearch = new LocationSearch(
		{departments, resultTable, xhrSubstitute, backendService, configDepartments}
	);

	locationSearch.fallbackWhenDateNotInLabel((locationResponse) => {
		departments.setOriginalOrderByLocationResponse(locationResponse);
		const finderSlots = new FinderSlots({departments, resultTable, backendService, prepareVisit, configDepartments});
		finderSlots.start();
	});

	delete document.documentElement.dataset.gifPath;
})();

function getSyncValue(key) {
	if (!(key in document.documentElement.dataset)) {
		return null;
	}
	const value = document.documentElement.dataset[key];

	return JSON.parse(value);
}