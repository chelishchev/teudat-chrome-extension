import {PersonManager} from "./person-manager";
import {ColorByIndex} from "./colors";
import {FinderControl} from "./finder-control";

const finderControl = new FinderControl();
finderControl.renderTo(document.body);

const personManager = new PersonManager(new ColorByIndex());
(async () => {
	await personManager.ready();
	await personManager.loadPeopleFromConfig();
	personManager.renderTo(document.body);
})();
