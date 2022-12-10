import {PersonManager} from "./person-manager";
import {ColorByIndex} from "./colors";


const personManager = new PersonManager(new ColorByIndex());
(async () => {
	await personManager.ready();
	await personManager.loadPeopleFromConfig();
	personManager.registerClickHandlerForPersonButton();
	personManager.renderTo(document.body);
})();
