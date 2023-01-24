import {Departments} from "./departments";
import {FormFiller} from "./form-filler";
import {ResultTable} from "./result-table";
import XhrSubstitute from "./xhr-substitute";
import {LocationSearch} from "./location-search";
import {MouseEventSimulator} from "./mouse-simulator";
import {BackendService} from "./backend-service";
import {FinderSlots} from "./finder-slots";

const xhrSubstitute = new XhrSubstitute();
xhrSubstitute.substitute();

(new MouseEventSimulator()).randomize();

const token = 'wSoSKdefRxkqCIUpXRKzNS';
const backendService = new BackendService(token);

const gifPath = document.documentElement.dataset.gifPath;
const resultTable = new ResultTable({
	gifPath,
	backendService,
});
const departments = new Departments();
const locationSearch = new LocationSearch(
	{departments, resultTable, xhrSubstitute, backendService}
);

locationSearch.fallbackWhenDateNotInLabel(() => {
	const finderSlots = new FinderSlots({departments, resultTable, backendService});
	finderSlots.start();
});

delete document.documentElement.dataset.gifPath;

(new FormFiller({backendService})).fillByMySelf();