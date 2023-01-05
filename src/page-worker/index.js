import {Departments} from "./departments";
import {FormFiller} from "./form-filler";
import {ResultTable} from "./result-table";
import XhrSubstitute from "./xhr-substitute";
import {LocationSearch} from "./location-search";

const xhrSubstitute = new XhrSubstitute();
xhrSubstitute.substitute();

const resultTable = new ResultTable();
const departments = new Departments();
const locationSearch = new LocationSearch(
	departments, resultTable, xhrSubstitute
);


(new FormFiller()).fill({
	phoneNumber: '***REMOVED***',
	idNumber: '***REMOVED***',
	shortMobilePhone: '***REMOVED***',
});