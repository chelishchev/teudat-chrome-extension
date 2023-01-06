import {Departments} from "./departments";
import {FormFiller} from "./form-filler";
import {ResultTable} from "./result-table";
import XhrSubstitute from "./xhr-substitute";
import {LocationSearch} from "./location-search";
import {MouseEventSimulator} from "./mouse-simulator";

const xhrSubstitute = new XhrSubstitute();
xhrSubstitute.substitute();

(new MouseEventSimulator()).randomize();

const gifPath = document.documentElement.dataset.gifPath;
const resultTable = new ResultTable({
	gifPath,
});
const departments = new Departments();
const locationSearch = new LocationSearch(
	departments, resultTable, xhrSubstitute
);

delete document.documentElement.dataset.gifPath;

(new FormFiller()).fill({
	phoneNumber: '***REMOVED***',
	idNumber: '***REMOVED***',
	shortMobilePhone: '***REMOVED***',
});