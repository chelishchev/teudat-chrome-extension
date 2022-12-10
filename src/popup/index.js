import {PersonManager} from "./person-manager";
import {ColorByIndex} from "./colors";
import {FinderControl} from "./finder-control";
import {CodeInjector} from "./code-injector";

const finderControl = new FinderControl();
finderControl.renderTo(document.body);

const codeInjector = new CodeInjector();
const personManager = new PersonManager(new ColorByIndex());
(async () => {
	await codeInjector.inject();
	await personManager.loadPeopleFromConfig();
	personManager.renderTo(document.body);
})();
