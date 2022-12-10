import {FormFiller} from "./form-filler";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.action === 'fill' && request.person)
	{
		(new FormFiller()).fill(request.person);
	}
	console.log(request, sender, sendResponse);
	sendResponse(JSON.stringify('ok'));
});