import {Departments} from "./departments";
import {FormFiller} from "./form-filler";
import {FinderSlots} from "./finder-slots";
import {ResultTable} from "./result-table";

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
	console.log('page-worker chrome.runtime.onMessage request', request, Date.now());
	if (request.action === 'inject-code')
	{
	}
	else if (request.action === 'fill' && request.person)
	{
		(new FormFiller()).fill(request.person);
	}
	else if (request.action === 'find')
	{
		const resultTable = new ResultTable();
		const departments = new Departments();
		const finderSlots = new FinderSlots(departments, resultTable);

		await finderSlots.loadRequestConfig();
		finderSlots.start();
	}

	sendResponse(JSON.stringify({success: true}));
});