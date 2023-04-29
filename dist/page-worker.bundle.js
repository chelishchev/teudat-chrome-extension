/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/page-worker/departments.js
class Departments
{
	constructor()
	{
		this.orderedDepartmentIds = [];
		this.departments = this.loadData();
		this.cache = new Map();
	}

	setOriginalOrderByLocationResponse(orderedDepartments)
	{
		this.orderedDepartmentIds = orderedDepartments.map(department => department.ServiceId);
	}

	#toBinary(string)
	{
		const codeUnits = new Uint16Array(string.length);
		for (let i = 0; i < codeUnits.length; i++)
		{
			codeUnits[i] = string.charCodeAt(i);
		}

		return btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
	}

	#fromBinary(encoded)
	{
		const binary = atob(encoded);
		const bytes = new Uint8Array(binary.length);
		for (let i = 0; i < bytes.length; i++)
		{
			bytes[i] = binary.charCodeAt(i);
		}

		return String.fromCharCode(...new Uint16Array(bytes.buffer));
	}

	#normalize(department)
	{
		if (!department.hasProcessed)
		{
			department.LocationName = this.#fromBinary(department.LocationName);
			department.Label = department.ExtRef.replace(/ShowDate_/g, '');
			department.hasProcessed = true;
		}
	}

	getNodeOnPage(department)
	{
		const escapedAddress = department.LocationName.replace(/"/g, '\\"');
		if (!this.cache.has(escapedAddress))
		{
			this.cache.set(escapedAddress, document.body.querySelector(`span[title="${escapedAddress}"]`));
		}

		return this.cache.get(escapedAddress);
	}

	clickOnDepartment(departmentId)
	{
		const departmentInfo = this.getDepartmentById(departmentId);
		if (!departmentInfo)
		{
			console.log('Department not found', departmentId);
			return;
		}

		let parent = this.getNodeOnPage(departmentInfo);
		while (parent && !parent.getAttribute('data-ng-click'))
		{
			parent = parent.parentNode;
		}
		parent.click();
	}

	highlightAddress(department, data)
	{
		const {color, text} = data

		let row = this.getNodeOnPage(department);
		if (!row)
		{
			return;
		}

		row.style.backgroundColor = color;
		row.textContent = `${text} in ${row.textContent}`;
	}

	getGoodDepartmentServiceIds()
	{
		return [
			2161,
			2243,
			2155,
			2099,
			2163,
			2165,
			2095,
			2153,
			2113,
			2245,
			2167,
			2110,
			2150,
			2146,
			2215,
			2159,
			2219,
			2235, //Zfat
			2211, //Akko
			2247, //Eilat
			2217, //Ashkelon
			2196, //Beersheva
			2198, //Dimona
			2239, //Karmiel
		];
	}

	[Symbol.iterator]()
	{
		let index = 0;
		const departments = this.getDepartments();

		if (this.orderedDepartmentIds.length > 0)
		{
			departments.sort((a, b) => {
				return this.orderedDepartmentIds.indexOf(a.ServiceId) - this.orderedDepartmentIds.indexOf(b.ServiceId);
			});
		}

		return {
			next: () => {
				if (index < departments.length)
				{
					for (let i = index; i < departments.length; i++)
					{
						let department = departments[i];
						if (this.getGoodDepartmentServiceIds().includes(department.ServiceId))
						{
							this.#normalize(department);
							index = i;
							index++;

							return {value: department, done: false};
						}
					}
				}

				return {done: true};
			}

		};
	}

	loadData() {
		return [
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 825,
				"LocationName": "3AXpBdsF6gUgANkF6AXVBekF3AXZBd0FIADTBegF1QXdBS0A1AXoBSAA1wXVBd4F1AU=",
				"Address1": "אליהו קורן 25",
				"Address2": "",
				"City": "ירושלים",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת ירושלים דרום- הר חומה",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 31.7221755,
				"Longitude": 35.2235026,
				"Distance": 57732.09167767383,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "2022-11-21T07:11:20.577",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2161,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_SouthJer",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 870,
				"LocationName": "3AXpBdsF6gUgAN4F1gXoBdcFIADZBegF1QXpBdwF2QXdBSAANAYxBkIGIAAnBkQGQgYvBjMG",
				"Address1": "וואדי ג'וז 49",
				"Address2": "",
				"City": "ירושלים",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת מזרח ירושלים شرق القدس",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 31.7943863,
				"Longitude": 35.2361106,
				"Distance": 53489.412255299787,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2243,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_EastJer",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 822,
				"LocationName": "3AXpBdsF6gUgANkF6AXVBekF3AXZBd0FLQDpBdwF1QXeBeYF2QXVBd8FIADUBd4F3AXbBdQFIAAxAA==",
				"Address1": "שלומציון המלכה 1",
				"Address2": "",
				"City": "ירושלים",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת ירושלים-שלומציון המלכה 1",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 31.7802595,
				"Longitude": 35.2217376,
				"Distance": 53365.774854175914,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2155,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Jerusalem",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 802,
				"LocationName": "3AXpBdsF6gUgAOoF3AUgANAF0QXZBdEFIADeBegF2wXWBSAAKADnBegF2QXZBeoFIADUBd4F3gXpBdwF1AUpAA==",
				"Address1": "מנחם בגין 125",
				"Address2": "",
				"City": "תל אביב",
				"State": "ישראל",
				"Country": "Yemen",
				"Description": "לשכת תל אביב מרכז (קריית הממשלה)",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 32.0729837,
				"Longitude": 34.7891528,
				"Distance": 1151.3467701184543,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2099,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_TelAviv",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 827,
				"LocationName": "3AXpBdsF6gUgAOoFIgDQBSAA0wXoBdUF3QUgACgA2QXkBdUFKQA=",
				"Address1": "סלמה 53",
				"Address2": "קומה 4",
				"City": "תל אביב",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת ת\"א דרום (יפו)",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 32.0550936,
				"Longitude": 34.7671014,
				"Distance": 3068.0781561746026,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2165,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Yaffo",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 799,
				"LocationName": "3AXpBdsF6gUgAOgF3gXqBSAA0gXfBS0A0gXRBeIF6gXZBdkF3QU=",
				"Address1": "סירקין 17",
				"Address2": "",
				"City": "גבעתיים",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת רמת גן גבעתיים",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 32.0783511,
				"Longitude": 34.8153998,
				"Distance": 3302.0289368901335,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2095,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_RamatGan",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 826,
				"LocationName": "3AXpBdsF6gUgANEF4AXZBSAA0QXoBecF",
				"Address1": "דרך זאב ז'בוטינסקי 168",
				"Address2": "מגדל מניבים",
				"City": "בני ברק",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת בני ברק",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 32.0924964,
				"Longitude": 34.8389245,
				"Distance": 5678.9237824076226,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "2022-11-30T05:35:11.063",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2163,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_BneiBrak",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 821,
				"LocationName": "3AXpBdsF6gUgANcF1QXcBdUF3wU=",
				"Address1": "שדרות ירושלים 164",
				"Address2": "",
				"City": "חולון",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת חולון",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 32.0129607,
				"Longitude": 34.7922471,
				"Distance": 7549.0665998964869,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2153,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Holon",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 809,
				"LocationName": "3AXpBdsF6gUgAOQF6gXXBSAA6gXnBdUF1AU=",
				"Address1": "מוטה גור 4",
				"Address2": "מגדלי עופר",
				"City": "פתח תקוה",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת פתח תקוה",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 32.0934298,
				"Longitude": 34.8649632,
				"Distance": 8105.4923944161856,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2113,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_PetachTikva",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 871,
				"LocationName": "3AXpBdsF6gUgANQF6AXmBdwF2QXUBQ==",
				"Address1": "ברקת 11",
				"Address2": "",
				"City": "הרצליה",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת הרצליה",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 32.1647816,
				"Longitude": 34.8127265,
				"Distance": 9849.3299861811574,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2245,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Herzelia",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 869,
				"LocationName": "3AXpBdsF6gUgAOgF0AXpBdUF3wUgANwF5gXZBdUF3wU=",
				"Address1": "ישראל גלילי 3",
				"Address2": "",
				"City": "ראשון לציון",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת ראשון לציון",
				"Directions": "קריית הממשלה",
				"ZipCode": "",
				"Latitude": 31.9690906,
				"Longitude": 34.7817391,
				"Distance": 12332.259173291743,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2241,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Rashlatz",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 828,
				"LocationName": "3AXpBdsF6gUgAOgF0AXpBSAA1AXiBdkF3wU=",
				"Address1": "שלום שבזי 29",
				"Address2": "",
				"City": "ראש העין",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת ראש העין",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 32.0966912,
				"Longitude": 34.9438254,
				"Distance": 15525.051313961876,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2167,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_RoshHaAin",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 807,
				"LocationName": "3AXpBdsF6gUgANsF5AXoBSAA4QXRBdAF",
				"Address1": "ויצמן 140 ",
				"Address2": "",
				"City": "כפר סבא",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת כפר סבא",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 32.1744141,
				"Longitude": 34.911686,
				"Distance": 16191.18826451221,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2110,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_KfarSaba",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 818,
				"LocationName": "3AXpBdsF6gUgAOgF3gXcBdQF",
				"Address1": "הרצל 91",
				"Address2": "",
				"City": "רמלה",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת רמלה",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 31.9262671,
				"Longitude": 34.8770731,
				"Distance": 19364.987250539358,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2148,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Ramle",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 819,
				"LocationName": "3AXpBdsF6gUgAOgF1wXVBdEF1QXqBQ==",
				"Address1": "מוטי קינד 10",
				"Address2": "",
				"City": "רחובות",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת רחובות",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 31.8946742,
				"Longitude": 34.7894096,
				"Distance": 20600.627069892638,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2150,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Rehovot",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 817,
				"LocationName": "3AXpBdsF6gUgAOAF6gXgBdkF1AU=",
				"Address1": "דוד רמז 13",
				"Address2": "",
				"City": "נתניה",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת נתניה",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 32.3279834,
				"Longitude": 34.8533843,
				"Distance": 28312.296226724873,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2146,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Netanya",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 823,
				"LocationName": "3AXpBdsF6gUgAN4F1QXTBdkF4gXZBd8FLQDeBdsF0QXZBd0FLQDoBeIF1QXqBSAAKADcBeoF1QXpBdEF2QUgANQF4gXZBegFIADRBdwF0QXTBSkA",
				"Address1": "תלתן 1",
				"Address2": "",
				"City": "מודיעין",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת מודיעין-מכבים-רעות (לתושבי העיר בלבד)",
				"Directions": "בנין עיריה",
				"ZipCode": "",
				"Latitude": 31.9076585,
				"Longitude": 35.0076201,
				"Distance": 28759.7901924211,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2157,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Modiin",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 979,
				"LocationName": "3AXpBdsF6gUgANgF2QXZBdEF1AU=",
				"Address1": "אלבלדיה",
				"Address2": "",
				"City": "טייבה",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת טייבה",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 32.266375,
				"Longitude": 35.00272,
				"Distance": 29411.214584290508,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2749,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Taybe",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 899,
				"LocationName": "3AXpBdsF6gUgAN4F1QXTBdkF4gXZBd8FIADiBdkF3AXZBeoF",
				"Address1": "חזון דוד",
				"Address2": "",
				"City": "מודיעין עילית",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת מודיעין עילית",
				"Directions": "מרכז חזון דוד, קומה 1",
				"ZipCode": "",
				"Latitude": 31.9259095,
				"Longitude": 35.0404295,
				"Distance": 29938.578516958121,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2349,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_ModiinIlit",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 854,
				"LocationName": "3AXpBdsF6gUgANAF6QXTBdUF0wU=",
				"Address1": "דרך מנחם בגין 1",
				"Address2": "מרכז צימר",
				"City": "אשדוד",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת אשדוד",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 31.7889333,
				"Longitude": 34.6412574,
				"Distance": 34888.334526351719,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2215,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Ashdod",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 816,
				"LocationName": "3AXpBdsF6gUgANcF0wXoBdQF",
				"Address1": "דוד שמעוני 42",
				"Address2": "",
				"City": "חדרה",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת חדרה",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 32.4382516,
				"Longitude": 34.9101099,
				"Distance": 41529.999287256593,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2144,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Hadera",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 859,
				"LocationName": "3AXpBdsF6gUgANEF2QXqBSAA6QXeBekF",
				"Address1": "אבא נעמת 1",
				"Address2": "",
				"City": "בית שמש",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת בית שמש",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 31.7498587,
				"Longitude": 34.988725,
				"Distance": 41598.301550201388,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2225,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_BeitShemesh",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 824,
				"LocationName": "3AXpBdsF6gUgAN4F0QXpBegF6gUgAOYF2QXVBd8F",
				"Address1": "תיכון הראל",
				"Address2": "",
				"City": "מבשרת ציון",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת מבשרת ציון",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 31.7933294,
				"Longitude": 35.1471307,
				"Distance": 47057.661112177913,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2159,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Mevaseret",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 1019,
				"LocationName": "3AXpBdsF6gUgAOcF3AXgBdMF2QXUBSAAIABCBkQGRgYvBkoGJwY=",
				"Address1": " מעבר קלנדיה",
				"Address2": "",
				"City": "ירושלים",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת קלנדיה  قلنديا",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 31.8617771,
				"Longitude": 35.2279515,
				"Distance": 48743.804310150634,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2882,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Kalandia",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 1071,
				"LocationName": "3AXpBdsF6gUgAOkF0wXoBdUF6gU=",
				"Address1": "מנחם בגין 4",
				"Address2": "",
				"City": "שדרות",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת שדרות",
				"Directions": "מרכז אבני החושן",
				"ZipCode": "",
				"Latitude": 31.6750573,
				"Longitude": 34.5785472,
				"Distance": 48829.313937471583,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 3078,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Sderot",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 855,
				"LocationName": "3AXpBdsF6gUgANAF6QXnBdwF1QXfBQ==",
				"Address1": "ברל כצנלסון 9",
				"Address2": "",
				"City": "אשקלון",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת אשקלון",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 31.6619595,
				"Longitude": 34.5872596,
				"Distance": 49861.331434565953,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2217,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Ashkelon",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 1073,
				"LocationName": "3AXpBdsF6gUgAOcF6AXZBeoFIADSBeoF",
				"Address1": "ככר פז 3",
				"Address2": "",
				"City": "קרית גת",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת קרית גת",
				"Directions": "קניון קרית גת",
				"ZipCode": "",
				"Latitude": 31.611148,
				"Longitude": 34.768459,
				"Distance": 52033.987404359141,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 3086,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_KiryatGat",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 1038,
				"LocationName": "3AXpBdsF6gUgANAF6AXZBdAF3AU=",
				"Address1": "יהודה 5",
				"Address2": "",
				"City": "אריאל",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת אריאל",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 31.756822,
				"Longitude": 35.2207063,
				"Distance": 54953.571558858443,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2991,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Ariel",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 1599,
				"LocationName": "3AXpBdsF6gUgAOYF1QXoBSAA0QXQBdQF6AUgADUGSAYxBiAAKAYnBkcGMQY=",
				"Address1": "257 אל מדינה אל מונאוורה ",
				"Address2": "צור באהר",
				"City": "ירושלים",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת צור באהר صور باهر",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 31.73865,
				"Longitude": 35.232517,
				"Distance": 57123.713925672011,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 5550,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Zurbaher",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 893,
				"LocationName": "3AXpBdsF6gUgAN4F4gXcBdQFIADQBdMF1QXeBdkF3QUgAA==",
				"Address1": "דרך קדם 5",
				"Address2": "",
				"City": "מעלה אדומים",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת מעלה אדומים",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 31.7714714,
				"Longitude": 35.298434,
				"Distance": 59764.285530163106,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2297,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_MaaleAdomim",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 2265,
				"LocationName": "3AXpBdsF6gUgANAF1QXdBSAA0AXcBSAA5AXXBd0F",
				"Address1": "אל מדינה",
				"Address2": "",
				"City": "אום אל פחם",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת אום אל פחם",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 32.525567,
				"Longitude": 35.15457,
				"Distance": 60656.499209344271,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 8977,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_UmmElFahem",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 1037,
				"LocationName": "3AXpBdsF6gUgANkF5wXgBeIF3QU=",
				"Address1": "התמר 2",
				"Address2": "",
				"City": "יקנעם",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת יקנעם",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 32.6595831,
				"Longitude": 35.1051293,
				"Distance": 71133.482417968218,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2989,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Yokneam",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 841,
				"LocationName": "3AXpBdsF6gUgAOAF6gXZBdEF1QXqBQ==",
				"Address1": "שדרות ירושלים 10",
				"Address2": "",
				"City": "נתיבות",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת נתיבות",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 31.4248982,
				"Longitude": 34.6006661,
				"Distance": 74643.216943394858,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2194,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Netivot",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 858,
				"LocationName": "3AXpBdsF6gUgAOIF5AXVBdwF1AU=",
				"Address1": "יהושע חנקין 1",
				"Address2": "",
				"City": "עפולה",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת עפולה",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 32.603155,
				"Longitude": 35.297645,
				"Distance": 75709.472535630543,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2223,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Afula",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 849,
				"LocationName": "3AXpBdsF6gUgAOgF1AXYBQ==",
				"Address1": "עיריית רהט",
				"Address2": "בניין העירייה",
				"City": "רהט",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת רהט",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 31.396149,
				"Longitude": 34.758438,
				"Distance": 75888.999684539071,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2205,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Rahat",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 856,
				"LocationName": "3AXpBdsF6gUgANcF2QXkBdQF",
				"Address1": "שדרות פל ים 15 א ",
				"Address2": "",
				"City": "חיפה",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת חיפה",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 32.8160875,
				"Longitude": 35.002703,
				"Distance": 84227.506273674517,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2219,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Haifa",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 978,
				"LocationName": "3AXpBdsF6gUgAOcF6AXZBdUF6gUgACgA5wXgBdkF1QXfBSAA6QXiBegFIADUBeYF5AXVBd8FKQA=",
				"Address1": "דרך חיפה 52",
				"Address2": "",
				"City": "קרית אתא",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת קריות (קניון שער הצפון)",
				"Directions": "קניון הצפון קומה 1",
				"ZipCode": "",
				"Latitude": 32.8092936,
				"Longitude": 35.0750542,
				"Distance": 85454.713241786245,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2744,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Krayot",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 861,
				"LocationName": "IADcBekF2wXqBSAA4AXVBeMFIADUBdIF3AXZBdwFIAAoAOAF5gXoBeoFIADiBdkF3AXZBeoFKQA=",
				"Address1": "מעלה יצחק 29",
				"Address2": "",
				"City": "נוף הגליל",
				"State": "ישראל",
				"Country": "Israel",
				"Description": " לשכת נוף הגליל (נצרת עילית)",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 32.7170967,
				"Longitude": 35.3358718,
				"Distance": 87845.192434609547,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2229,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_NofHagalil",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 842,
				"LocationName": "3AXpBdsF6gUgANEF0AXoBSAA6QXRBeIF",
				"Address1": "התקווה 4",
				"Address2": "קריית הממשלה",
				"City": "באר שבע",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת באר שבע",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 31.2453384,
				"Longitude": 34.799282,
				"Distance": 92598.455902010028,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2196,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Beersheva",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 852,
				"LocationName": "3AXpBdsF6gUgAOIF2wXVBQ==",
				"Address1": "שלום הגליל 1",
				"Address2": "",
				"City": "עכו",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת עכו",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 32.9197962,
				"Longitude": 35.0932209,
				"Distance": 97624.766688895441,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2211,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Akko",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 889,
				"LocationName": "3AXpBdsF6gUgAOEF1wUnAOAF2QXfBQ==",
				"Address1": "עיריית סח'נין",
				"Address2": "",
				"City": "סחנין",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת סח'נין",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 32.8600469,
				"Longitude": 35.3048816,
				"Distance": 99534.310448570817,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2285,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_sachnin",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 853,
				"LocationName": "3AXpBdsF6gUgAOAF1AXoBdkF1AUgAA==",
				"Address1": "אירית 2",
				"Address2": "קניון נהריה",
				"City": "נהריה",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת נהריה",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 32.9901794,
				"Longitude": 35.0953318,
				"Distance": 105147.09416701035,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2213,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Naharia",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 1822,
				"LocationName": "3AXpBdsF6gUgANMF2QXoBSAA0AXcBSAA0AXhBdMF",
				"Address1": "אל ג'בל",
				"Address2": "מועצה מקומית דיר אל אסד",
				"City": "דיר אל אסד",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת דיר אל אסד",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 32.935872,
				"Longitude": 35.2667026,
				"Distance": 105305.99825229103,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 5901,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_DirElAsad",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 868,
				"LocationName": "3AXpBdsF6gUgANsF6AXeBdkF0AXcBQ==",
				"Address1": "החרושת 9",
				"Address2": "",
				"City": "כרמיאל",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת כרמיאל",
				"Directions": "מרכז ניצנים",
				"ZipCode": "",
				"Latitude": 32.9223331,
				"Longitude": 35.3045914,
				"Distance": 105570.06812651834,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2239,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Karmiel",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 860,
				"LocationName": "3AXpBdsF6gUgANgF0QXoBdkF1AU=",
				"Address1": "יהודה הלוי 1",
				"Address2": "מרכז ביג פאשן דנילוף",
				"City": "טבריה",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת טבריה",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 32.7905464,
				"Longitude": 35.5337028,
				"Distance": 105928.37614783089,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2227,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Tveria",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 951,
				"LocationName": "3AXpBdsF6gUgAN4F4gXcBdUF6gUgAOoF6AXpBdkF1wXQBQ==",
				"Address1": "בן גוריון 1",
				"Address2": "",
				"City": "מעלות תרשיחא",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת מעלות תרשיחא",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 33.0125724,
				"Longitude": 35.2842155,
				"Distance": 113697.07283765133,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2654,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Maalot",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 843,
				"LocationName": "3AXpBdsF6gUgANMF2QXeBdUF4AXUBQ==",
				"Address1": "בניין עיריית דימונה",
				"Address2": "",
				"City": "דימונה",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת דימונה",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 31.0645166,
				"Longitude": 35.0325507,
				"Distance": 115142.74709031489,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2198,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Dimona",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 866,
				"LocationName": "3AXpBdsF6gUgAOYF5AXqBQ==",
				"Address1": "וייצמן 4",
				"Address2": "",
				"City": "צפת",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת צפת",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 32.9575443,
				"Longitude": 35.4982255,
				"Distance": 118369.1964897553,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2235,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Zefat",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 1327,
				"LocationName": "3AXpBdsF6gUgAOcF5gXoBdkF3wU=",
				"Address1": "מרכז מסחרי איתן,קצרין ",
				"Address2": "",
				"City": "קצרין",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת קצרין",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 32.990998,
				"Longitude": 35.689865,
				"Distance": 132275.10511012285,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 4706,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_Katzrin",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 867,
				"LocationName": "3AXpBdsF6gUgAOcF6AXZBeoFIADpBd4F1QXgBdQF",
				"Address1": " 37 הרצל",
				"Address2": "",
				"City": "קרית שמונה",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת קרית שמונה",
				"Directions": "עיריית קרית שמונה",
				"ZipCode": "",
				"Latitude": 33.2067897,
				"Longitude": 35.5676243,
				"Distance": 145121.86858249147,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2237,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "ShowDate_KiryatShmona",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			},
			{
				"OrganizationId": 56,
				"OrganizationName": "רשות האוכלוסין וההגירה",
				"LocationId": 872,
				"LocationName": "3AXpBdsF6gUgANAF2QXcBeoF",
				"Address1": "שדרות התמרים 2",
				"Address2": "",
				"City": "אילת",
				"State": "ישראל",
				"Country": "Israel",
				"Description": "לשכת אילת",
				"Directions": "",
				"ZipCode": "",
				"Latitude": 29.5549831,
				"Longitude": 34.9543557,
				"Distance": 280466.46820341982,
				"WaitingTime": 0,
				"ShowStats": false,
				"IsFavorite": false,
				"ServiceCount": 1,
				"LastUseDate": "",
				"HasCalendarService": true,
				"HasFIFOService": true,
				"ServiceId": 2247,
				"ServiceHasFIFO": false,
				"DynamicFormsEnabled": true,
				"PhoneNumber": "",
				"ExtRef": "Eilat",
				"ServiceTypeId": 0,
				"MaxWaitingTime": 0
			}
		];
	}

	getDepartmentById(id)
	{
		const departments = this.getDepartments();
		for (let i in departments) {
			const entry = departments[i];
			if (entry.ServiceId == id) {
				this.#normalize(entry);

				return entry;
			}
		}

		return null;
	}

	getDepartments()
	{
		return this.departments;
	}
}
;// CONCATENATED MODULE: ./src/page-worker/form-filler.js
const NODE_IDS = {
    ID_KEYPAD: 'ID_KEYPAD',
    PHONE_KEYPAD: 'PHONE_KEYPAD',
    mobileNumber: 'mobileNumber',
    smsCode: 'verficationNumber',

    serviceForCommonCases: '\\31 56',
    serviceForGettingSecondDarkon: '\\32 67',
}
class FormFiller {

    constructor({backendService}) {
        this.observer = this.buildIntersectionObserver();
        this.expectedNodesWithCallbacks = new Map();
        /** @type {BackendService} */
        this.backendService = backendService;

        this.notifyShouldEnterSmsCode = this.debounce(() => {
            this.backendService.notify('enterSmsCode');
        }, 800)
    }

    buildIntersectionObserver() {
        const options = {
            rootMargin: '0px',
            threshold: 1.0
        };

        return new IntersectionObserver(this.handleIntersection.bind(this), options);
    }

    handleIntersection(entries, observer) {
        entries.forEach((entry) => {
            if(!entry.isIntersecting) {
                return;
            }
            if(!this.expectedNodesWithCallbacks.has(entry.target)) {
                return;
            }
            const callback = this.expectedNodesWithCallbacks.get(entry.target);
            callback();

            this.expectedNodesWithCallbacks.delete(entry.target);
            this.observer.unobserve(entry.target);
        });
    }

    doWhenElementVisible(node, callback) {
        this.expectedNodesWithCallbacks.set(node, callback);
        this.observer.observe(node);
    }

    fillByMySelf() {
        this.backendService.getUserData().then((person) => {
            this.fill(person);
        });
    }

    fill(person) {
        this.#processFill(person);

        this.registerAutoFiller(person);
    }

    #processFill(person) {
        this.fillIDTeudat(person.idNumber);
        this.fillPhoneShort(person.shortMobilePhone);
        this.fillMobileNumber(person.phoneNumber);
        this.processVerificationNumber();
        this.selectServiceInProvider();
    }

    registerAutoFiller(person) {
        const processFill = this.debounce(() => {
            this.#processFill(person);
        }, 250);

        let normalizedNodeIds = {};
        Object.keys(NODE_IDS).map((name) => {
            normalizedNodeIds[name] = this.#normalizeSelector(NODE_IDS[name])
        });

        const expectedNodeIds = Object.values(normalizedNodeIds);
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes') {
                    const nodeId = mutation.target.id;
                    if (expectedNodeIds.includes(nodeId)) {
                        processFill();
                    }
                }
            });
        });

        observer.observe(document.body, {childList: true, subtree: true, attributes: true,});
    }

    debounce(fn, delay) {
        let timer = null;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn.apply(context, args);
            }, delay);
        }
    }

    isVisible(node) {
        return node && node.offsetParent !== null;
    }

    fillIDTeudat(idNumber) {
        const idTeudat = document.querySelector(`#${NODE_IDS.ID_KEYPAD}`);

        const work = (node) => {
            this.setValueAndDispatchEvent(node, idNumber);
            this.submitFormAfterDelay('form[name="questionnaireForm"] button', 100);
        }
        if (idTeudat) {
            if (this.isVisible(idTeudat)) {
                work(idTeudat);
            } else {
                this.doWhenElementVisible(idTeudat, () => work(idTeudat));
            }
        }
    }

    fillPhoneShort(shortMobilePhone) {
        const phoneShort = document.querySelector(`#${NODE_IDS.PHONE_KEYPAD}`);

        const work = (node) => {
            this.setValueAndDispatchEvent(node, shortMobilePhone);
            this.submitFormAfterDelay('form[name="questionnaireForm"] button', 100);
        }

        if (phoneShort) {
            if (this.isVisible(phoneShort)) {
                work(phoneShort);
            } else {
                this.doWhenElementVisible(phoneShort, () => work(phoneShort));
            }
        }
    }

    fillMobileNumber(phoneNumber) {
        const mobileNumber = document.querySelector(`#${NODE_IDS.mobileNumber}`);
        const work = (node) => {
            this.setValueAndDispatchEvent(node, phoneNumber);
            // this.submitFormAfterDelay('form[name="smsSettingsForm"] input[type="submit"]', 200);
            this.focusElementAfterDelay('#verficationNumber', 400);
        }

        if (mobileNumber) {
            if (this.isVisible(mobileNumber)) {
                work(mobileNumber);
            } else {
                this.doWhenElementVisible(mobileNumber, () => work(mobileNumber));
            }
        }
    }

    processVerificationNumber() {
        const smsCode = document.querySelector(`#${NODE_IDS.smsCode}`);
        const work = (node) => {
            this.notifyShouldEnterSmsCode();
            this.focusElementAfterDelay(`#${NODE_IDS.smsCode}`, 400);
        }

        if (smsCode) {
            if (this.isVisible(smsCode)) {
                work(smsCode);
            } else {
                this.doWhenElementVisible(smsCode, () => work(smsCode));
            }
        }
    }

    #normalizeSelector(selector) {
        const parts = selector.split(' ');

        return parts.map(part => {
            if (part.startsWith('\\')) {
                return String.fromCodePoint(parseInt(part.slice(1), 16));
            } else {
                return part;
            }
        }).join('');
    }

    selectServiceInProvider() {
        const serviceForCommonCases = document.querySelector(`#${NODE_IDS.serviceForCommonCases}`);
        const work = (node) => {
            node.click();
        }

        if (serviceForCommonCases) {
            if (this.isVisible(serviceForCommonCases)) {
                work(serviceForCommonCases);
            } else {
                this.doWhenElementVisible(serviceForCommonCases, () => work(serviceForCommonCases));
            }
        }
    }

    setValueAndDispatchEvent(node, value) {
        node.value = value;
        const event = new Event('input');
        node.dispatchEvent(event);
    }

    submitFormAfterDelay(selector, delay) {
        setTimeout(() => {
            const continueButton = document.querySelector(selector);
            if (this.isVisible(continueButton)) {
                continueButton.click();
            } else {
                console.warn('submitFormAfterDelay continueButton not found', Date.now());
            }
        }, delay);
    }

    focusElementAfterDelay(selector, delay) {
        setTimeout(() => {
            const element = document.querySelector(selector);
            if (element) {
                element.focus();
            }
        }, delay);
    }
}
;// CONCATENATED MODULE: ./src/page-worker/result-table.js

const COUNT_OF_DAYS = 16;
const SEEMS_CLOSE_DATE = COUNT_OF_DAYS*24*60*60*1000;

class ResultTable {
    constructor({gifPath, backendService}) {
		/** @type {BackendService} */
		this.backendService = backendService;
        this.statusValue = null;
        this.errorStatusValue = null;
        this.lastCheckDatetime = null;
        this.resultList = null;
        this.gifPath = gifPath;
        this.loadingImage = null;
    }

    createNode() {
        const container = this.createElement('div', 'teudat-container');
        this.loadingImage = this.createLoadingImage();

        const settingRow = this.createRow([
            document.createTextNode('Изменить отделения для поиска вы можете на странице расширения MyVisit Rega Helper, кликнув на значок (🧩) в правом верхнем углу браузера'),
            document.createElement('br'),
            document.createElement('br'),
        ]);

        const statusRow = this.createRow([
            this.createElement('span', null, 'Статус:&nbsp;'),
            this.statusValue = this.createElement('span', null, 'Ищем...'),
            this.loadingImage,
        ]);

        const lastCheckDatetime = this.createRow([
            this.createElement('span', null, 'Последняя проверка:&nbsp;'),
            this.lastCheckDatetime = this.createElement('span', null, '...'),
        ]);

        const results = this.createRow([
            this.resultList = this.createElement('ul', null)
        ]);

        container.appendChild(settingRow);
        container.appendChild(statusRow);
        container.appendChild(lastCheckDatetime);
        container.appendChild(results);

        return container;
    }

    changeDepartment(departmentName) {
        this.statusValue.innerText = 'Ищем...' + ' ' + departmentName;
        // this.departmentValue.innerText = departmentName;
    }

    changeLastCheckDatetime() {
        const currentDateTime = (new Date()).toLocaleTimeString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });

        this.lastCheckDatetime.innerText = currentDateTime;
    }

    changeStatusAsWorking() {
        this.statusValue.innerText = 'Ищем...';
    }

    changeStatusAsFinished() {
        this.statusValue.innerText = 'Закончили';
    }

    changeStatusAsContinue() {
        this.errorStatusValue = null;
        this.statusValue.innerText = 'Продолжим поиск через несколько минут...';
    }

    changeStatusAsError(type) {
        if (this.errorStatusValue) {
            return;
        }
        if (type === 'blockedPage') {
            this.statusValue.innerText = 'Ошибка. Пожалуйста, перезагрузите страницу через 30-40 минут и попробуйте снова.';
        } else {
            this.statusValue.innerText = 'Ошибка. Пожалуйста, перезагрузите страницу и попробуйте снова.';
        }
        this.errorStatusValue = type;
        this.loadingImage.style.display = 'none';
    }

    clearResults() {
        this.resultList.innerHTML = '';
    }

	isCloseEnough(dateString) {
		return (new Date(dateString)).getTime() - Date.now() < SEEMS_CLOSE_DATE;
	}

    appendResult(department) {
        const link = department.href;
        const name = department.name;
        const date = department.date;
        const serviceId = department.serviceId;

        let hrefLink = this.createElement('span', null, 'no slots');
        if (date) {
            const closeEnough = this.isCloseEnough(date);
			if(closeEnough) {
				console.warn('CLOSE ENOUGH', name, date, Date.now());
				this.backendService.notify('closeDate', {
                    department: {
                        name,
                        serviceId,
                    },
                    date
                });
			}

            const formattedDate = (new Date(date)).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });

            hrefLink = this.createElement('a', null, formattedDate);
            hrefLink.href = link;
            hrefLink.target = '_blank';
            if (closeEnough) {
                hrefLink.style.color = 'forestgreen';
            }
        }

        const departmentNode = this.createElement('li', null, [
            this.createElement('span', null, name + ':&nbsp;'),
            hrefLink
        ]);

        this.resultList.appendChild(departmentNode);
    }

    createRow(children) {
        const row = this.createElement('div', 'teudat-row');
        children.forEach(child => row.appendChild(child));

        return row;
    }

    createLoadingImage() {
        const img = document.createElement('img');
        img.src = this.gifPath;
        img.style.width = '25px';
        img.style.height = '25px';

        return img;
    }

    createElement(type, className, innerHTML) {
        const element = document.createElement(type);
        if (className) {
            element.classList.add(className);
        }
        if(Array.isArray(innerHTML)) {
            innerHTML.forEach(child => element.appendChild(child));
        }
        else if (typeof innerHTML === 'string') {
            element.innerHTML = innerHTML;
        }
        return element;
    }

    renderTo(node) {
        node.appendChild(this.node);
    }
}
;// CONCATENATED MODULE: ./src/page-worker/xhr-substitute.js
class XhrSubstitute {
    constructor() {
        this.mapHandlers = new Map();
    }

    refineUrl(link) {
        const url = new URL(link);

        return url.origin + url.pathname;
    }

    addHandler(url, handler) {
        this.mapHandlers.set(this.refineUrl(url), handler);
    }

    processRequest(event) {
        if (event.target.readyState === 4 && event.target.status === 200) {
            const handler = this.mapHandlers.get(this.refineUrl(event.target.responseURL));
            if (handler) {
                handler(event.target.responseURL, event.target.response);
            }
        }
    }

    substitute() {
        const OriginalXHR = window.XMLHttpRequest;
        const self = this;

        window.XMLHttpRequest = function () {
            return new Proxy(new OriginalXHR(), {
                get(target, prop, receiver) {
                    const value = target[prop];
                    if (value instanceof Function) {
                        return function (...args) {
                            return value.apply(this === receiver ? target : this, args);
                        };
                    }
                    return value;
                },
                set(target, property, value) {
                    if (property === 'onreadystatechange' || property === 'onload') {
                        target[property] = function (event) {
                            self.processRequest(event);

                            value.apply(target, arguments);
                        }
                        return true;
                    }

                    target[property] = value;
                    return true;
                }
            });
        }
    }
}
;// CONCATENATED MODULE: ./src/page-worker/location-search.js


const TIMEOUT = 3*60*1000;

class LocationSearch {
	constructor({departments, resultTable, xhrSubstitute, backendService}) {
		/** @type {BackendService} */
		this.backendService = backendService;
		/** @type {ResultTable} */
		this.resultTable = resultTable;
		/** @type {Departments} */
		this.departments = departments;
		/** @type {XhrSubstitute} */
		this.xhrSubstitute = xhrSubstitute;
		this.fallback = null;
		this.resultTableInserted = false;
		this.tokenConfig = {};
		this.originalLocationSearchUrl = null;

		this.xhrSubstitute.addHandler("https://central.myvisit.com/CentralAPI/LocationSearch", (url, response) => {
			this.handleLocationSearchResponse(JSON.parse(response));
			this.originalLocationSearchUrl = url;
		});
		this.xhrSubstitute.addHandler("https://piba-api.myvisit.com/CentralAPI/LocationSearch", (url, response) => {
			this.handleLocationSearchResponse(JSON.parse(response));
			this.originalLocationSearchUrl = url;
		});
	}

	loadRequestConfig()
	{
		const syncConfig = document.documentElement.dataset.syncConfig;
		if (syncConfig === undefined) {
			this.tokenConfig = {};
		} else {
			this.tokenConfig = JSON.parse(syncConfig);
		}
	}

	getRequestHeaders()
	{
		return {
			"accept": "application/json, text/plain, */*",
			"accept-language": "en",
			"application-api-key": this.tokenConfig["application-api-key"],
			"application-name": this.tokenConfig["application-name"],
			"preparedvisittoken": this.tokenConfig["preparedvisittoken"],
			"user-agent": this.tokenConfig["user-agent"],
			"cache-control": "no-cache",
			"pragma": "no-cache",
		};
	}

	queryLocation() {
		return new Promise((resolve, reject) => {
			console.log('START REQUEST', Date.now());
			const requestHeaders = this.getRequestHeaders();

			if (requestHeaders["preparedvisittoken"] === undefined) {
				console.warn("Can't find preparedvisittoken");
				resolve({});

				return;
			}

			fetch(this.originalLocationSearchUrl, {
				"headers": requestHeaders,
				"referrer": "https://myvisit.com/",
				"referrerPolicy": "no-referrer-when-downgrade",
				"body": null,
				"method": "GET",
				"mode": "cors",
				"credentials": "include"
			}).then(response => {
				if(response.ok) {
					return response.json().then(data => {
						const status = response.status;
						resolve(data);
					});
				}
				//todo work with "NEED TO RELOAD", "NEED TO AUTH". Probably need to reload page when status 403
				this.backendService.notify('reloadPage');
				// response.status
				resolve({});

				console.warn('BAD RESPONSE', response);

			}).catch((error) => {
				resolve({});

				console.warn('BAD RESPONSE', error);
			});
		});
	}

	handleLocationSearchResponse(response) {
		if (!response || !response.Success || !response.Results) {

			this.resultTable.changeStatusAsError();

			return;
		}

		if (!this.hasResultDateInLocationName(response.Results[0])) {
			console.warn("Can't find date in location name");

			if (this.fallback) {
				console.warn("Fall back to original location search");

				this.fallback(response.Results);
			}

			return;
		}

		const findLocationBlock = document.querySelector(".locationSearchInput.ng-isolate-scope")?.parentNode.parentNode;
		if (!findLocationBlock) {
			console.warn("Can't find location block");
			return;
		}

		if (!this.resultTableInserted) {
			findLocationBlock.prepend(this.resultTable.createNode());
			this.resultTableInserted = true;
		} else {
			this.resultTable.clearResults();
		}

		this.resultTable.changeLastCheckDatetime();
		this.resultTable.changeStatusAsWorking();

		const departments = this.departments;
		const goodDepartmentServiceIds = departments.getGoodDepartmentServiceIds();

		response.Results.forEach(departmentInfo => {
			if(!departmentInfo.ServiceId || !goodDepartmentServiceIds.includes(departmentInfo.ServiceId)) {
				return;
			}

			this.addDepartmentToResultTable(departmentInfo);
		});

		console.log('WAITING FOR NEXT REQUEST', Date.now(), Date.now() + TIMEOUT);
		setTimeout(async () => {
			this.loadRequestConfig();
			const data = await this.queryLocation();
			this.handleLocationSearchResponse(data);
		}, TIMEOUT);
	}

	hasResultDateInLocationName(department) {
		return this.matchDateFromLocationName(department.LocationName) !== null;
	}

	matchDateFromLocationName(locationName) {
		const regex = /(\d{2})\/(\d{2})\/(\d{4})/;

		return locationName.match(regex);
	}

	addDepartmentToResultTable(department)
	{
		const probablyDateString = department.LocationName;
		const match = this.matchDateFromLocationName(probablyDateString);
		const date = match[0] ? `${match[3]}-${match[2]}-${match[1]}` : null;
		const label = department.ExtRef.replace(/ShowDate_/g, '')

		if (!date)
		{
			this.resultTable.appendResult({
				href: `https://piba.myvisit.com/#!/home/service/${department.ServiceId}`,
				name: label,
			})
		}
		else
		{
			this.resultTable.appendResult({
				href: `https://piba.myvisit.com/#!/home/service/${department.ServiceId}`,
				name: label,
				date: date,
				serviceId: department.ServiceId,
			});
		}
	}

	fallbackWhenDateNotInLabel(fallback) {
		this.fallback = fallback;
	}
}
;// CONCATENATED MODULE: ./src/page-worker/mouse-simulator.js
const INTERVAL = 400;
const RESTART_INTERVAL = 15000;

class MouseEventSimulator {
    constructor() {
        this.lastMousePosition = {x: 0, y: 0};
    }

    simulateMovement() {
        // Calculate a random offset for the mouse position
        const offsetX = Math.random() * 10 - 5;
        const offsetY = Math.random() * 10 - 5;

        // Update the mouse position by adding the offset
        this.lastMousePosition.x += offsetX;
        this.lastMousePosition.y += offsetY;

        // Use the updated mouse position to dispatch a mousemove event
        const event = new MouseEvent('mousemove', {
            clientX: this.lastMousePosition.x,
            clientY: this.lastMousePosition.y
        });
        window.dispatchEvent(event);
    }

    simulateScroll() {
        // Calculate a random factor to vary the amount of scroll
        const scrollFactor = Math.random() * 10;

        // Dispatch a wheel event with the calculated scroll amount
        const event = new WheelEvent('wheel', {
            deltaY: scrollFactor
        });
        window.dispatchEvent(event);
    }

    randomize() {
        setTimeout(() => {
            this.start();

            // Set a timeout to stop the mouse event simulation after a random interval
            setTimeout(() => {
                this.stop();
                this.randomize();
            }, RESTART_INTERVAL*Math.random());

        }, RESTART_INTERVAL*Math.random());
    }

    start() {
        // Set an interval to continuously simulate mouse movement and scroll events
        this.intervalId = setInterval(() => {
            this.simulateMovement();
            this.simulateScroll();
        }, INTERVAL);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}
;// CONCATENATED MODULE: ./src/page-worker/fetch-transport.js
class FetchTransport {

    static async query(url, body, method = 'POST', customHeaders = {}, additionalOptions = {}) {
        const headers = {
            ...customHeaders,
        };

        return new Promise((resolve, reject) => {
            const reqId = Math.random().toString(36).substring(2, 15)

            window.postMessage({
                reqId: reqId,
                type: 'FETCH',
                method: method,
                headers: headers,
                body: method !== 'GET' ? JSON.stringify(body) : null,
                url: url,
                ...additionalOptions,
            }, window.location.origin)

            window.addEventListener('message', function (event) {
                if (event.data.reqId === reqId && event.data.type === 'FETCH_RESPONSE') {
                    console.log('FetchTransport RESPONSE', event.data);
                    resolve(event.data.response);
                }
            });
        });
    }
}
;// CONCATENATED MODULE: ./src/page-worker/backend-service.js


class BackendService {
    constructor(token, useTrickyFetch = true) {
        this.lastSentTimes = {};
        this.token = token;
        this.useTrickyFetch = useTrickyFetch;
        this.userData = null;
    }

    async getUserData() {
        if (this.userData !== null) {
            return this.userData;
        }

        return this.get('getMySelf').then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response.response;
            }

            return {
                user: null,
                status: response.status,
            };
        }).then(data => {
            this.userData = data?.user;

            return this.userData;
        });
    }

    notify(reason, data = {}) {
        const reasonWithoutLimit = ['closeDate'];
        const currentTime = Date.now();

        if (reasonWithoutLimit.includes(reason) || !this.lastSentTimes[reason] || currentTime - this.lastSentTimes[reason] >= 5 * 60 * 1000) {
            this.lastSentTimes[reason] = currentTime;
            this.query(`notify?reason=${reason}`, {
                reason: reason,
                data: data,
            });
        }
    }

    async saveDepartmentIds(ids) {
        return this.query('saveDepartmentIds', {
            ids: ids,
        });
    }

    async get(action) {
        return this.query(action, {}, 'GET');
    }

    async query(action, body, method = 'POST', customHeaders = {}) {
        const url = `https://myvisit.pumpkinlatte.club/api/${action}`;
        // const url = `http://127.0.0.1:8000/api/${action}`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
            ...customHeaders,
        };

        if (!this.useTrickyFetch) {
            return fetch(url, {
                method: method,
                headers: headers,
                body: method !== 'GET' ? JSON.stringify(body) : null,
            }).then(async response => {
                if (response.ok) {
                    const jsonResponse = await response.json()
                    return {
                        status: response.status,
                        response: jsonResponse,
                    }
                } else {
                    return {
                        status: response.status,
                        response: null,
                    }
                }
            });
        }

        return FetchTransport.query(url, body, method, headers);
    }
}
;// CONCATENATED MODULE: ./src/page-worker/queue.js
class Queue
{
    constructor()
    {
        this._items = [];
    }

    enqueue(item)
    {
        this._items.push(item);
    }

    dequeue()
    {
        return this._items.shift();
    }

    get size()
    {
        return this._items.length;
    }
}

class AutoQueue extends Queue
{
    constructor()
    {
        super();
        this._pendingPromise = false;
    }

    enqueue(action)
    {
        return new Promise((resolve, reject) => {
            super.enqueue({action, resolve, reject});
            this.dequeue();
        });
    }

    async dequeue()
    {
        if (this._pendingPromise) return false;

        let item = super.dequeue();

        if (!item) return false;

        try
        {
            this._pendingPromise = true;

            let payload = await item.action(this);

            this._pendingPromise = false;
            item.resolve(payload);
        } catch (e)
        {
            this._pendingPromise = false;
            item.reject(e);
        } finally
        {
            this.dequeue();
        }

        return true;
    }
}

;// CONCATENATED MODULE: ./src/page-worker/finder-slots.js




const MAX_DEPARTMENT_STEPS = 5;
const MAX_RESPONSE_RESULT = 2;
const finder_slots_TIMEOUT = 5*1000;
const TIMEOUT_TO_REPEAT = 3*60*1000;
class FinderSlots
{
	constructor({departments, resultTable, backendService, prepareVisit, configDepartments})
	{
		/** @type {PrepareVisit} */
		this.prepareVisit = prepareVisit;
		this.preventContinue = false;
		/** @type {BackendService} */
		this.backendService = backendService;
		/** @type {ResultTable} */
		this.resultTable = resultTable;
		this.resultTableInserted = false;
		/** @type {Departments} */
		this.departments = departments;
		this.configDepartments = configDepartments;
		this.tokenConfig = {};
	}

	async loadRequestConfig()
	{
		const syncConfig = document.documentElement.dataset.syncConfig;
		if (syncConfig === undefined) {
			this.tokenConfig = {};
		} else {
			this.tokenConfig = JSON.parse(syncConfig);
		}
	}

	#sleep() {
		return new Promise(resolve => setTimeout(resolve, finder_slots_TIMEOUT));
	}

	async start()
	{
		const findLocationBlock = document.querySelector(".locationSearchInput.ng-isolate-scope")?.parentNode.parentNode;
		if (!findLocationBlock) {
			console.warn("Can't find location block");
			return;
		}

		if (!this.resultTableInserted) {
			findLocationBlock.prepend(this.resultTable.createNode());
			this.resultTableInserted = true;
		} else {
			this.resultTable.clearResults();
		}

		this.resultTable.changeLastCheckDatetime();
		this.resultTable.changeStatusAsWorking();

		const departments = this.departments;
		const autoQueue = new AutoQueue();

		const _ = ({departmentInfo} = {}) => {
			return async () => {
				await this.loadRequestConfig();
				if (this.preventContinue)
				{
					return {department: departmentInfo, data: {Success: false, Message: 'STOPPED'}};
				}
				this.resultTable.changeDepartment(departmentInfo.Label);
				console.log('page-worker-work-with', departmentInfo);

				return await this.requestSlots(departmentInfo);
			};
		};

		let counter = 0;
		for (let department of departments)
		{
			counter++;
			if (!this.configDepartments.length)
			{
				if (counter > MAX_DEPARTMENT_STEPS)
				{
					break;
				}
			}
			else if (!this.configDepartments.includes(department.ServiceId))
			{
				continue;
			}

			let departmentInfo = department;
			autoQueue.enqueue(_({departmentInfo})).then(({department, data}) => {
				console.log('QUEUE', {department, data});
				if (data.Success)
				{
					console.warn(arguments, department, data);
					console.log(department.name, JSON.stringify(data.Results), Date.now());

					if (data.TotalResults > 0)
					{
						this.highlightAddress(department, data.Results);
					}
					else
					{
						this.highlightAddress(department, []);
					}
				}
				else
				{
					this.resultTable.changeStatusAsError(data.Type);
				}
			});
			autoQueue.enqueue(this.#sleep);
		}

		autoQueue.enqueue(() => new Promise(resolve => { resolve(); })).then(() => {
			this.resultTable.changeStatusAsContinue();
			console.log('WAITING FOR NEXT REQUEST', Date.now(), Date.now() + finder_slots_TIMEOUT);

			this.sendMessage({
				action: 'page-worker-finish',
			});

			setTimeout(() => {
				this.preventContinue = false;
				this.start();
			}, TIMEOUT_TO_REPEAT);
		});
	}

	async sendMessage(message)
	{
		console.log('sendMessage', message);

		// const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
		// return await chrome.tabs.sendMessage(tab.id, message);
		return true;
	}

	getRequestHeaders()
	{
		return {
			"accept": "application/json, text/plain, */*",
			"accept-language": "en",
			"application-api-key": this.tokenConfig["application-api-key"],
			"application-name": this.tokenConfig["application-name"],
			"cache-control": "no-cache",
			"pragma": "no-cache",
			"preparedvisittoken": this.tokenConfig["preparedvisittoken"],
		};
	}

	requestSlots(department)
	{
		return new Promise((resolve, reject) => {
			console.log('START REQUEST', Date.now());
			const requestHeaders = this.getRequestHeaders();

			if (requestHeaders["preparedvisittoken"] === undefined) {
				console.warn("Can't find preparedvisittoken");
				resolve({department: department, data: {Success: false, Message: 'Can\'t find preparedvisittoken', Type: 'preparedvisittoken'}});

				return;
			}

			const currentDateString = this.getCurrentDateString();
			FetchTransport.query(
				`https://piba-api.myvisit.com/CentralAPI/SearchAvailableDates?maxResults=${MAX_RESPONSE_RESULT}&serviceId=${department.ServiceId}&startDate=${currentDateString}`,
				null,
				'GET',
				requestHeaders,
				{
					"referrer": "https://piba.myvisit.com/",
					"referrerPolicy": "no-referrer-when-downgrade",
					// "mode": "cors",
					"credentials": "include",
				}
			).then(async response => {
				const status = response.status;
				if (status >= 200 && status < 300)
				{
					resolve({department, data: response.response});
					console.log('RESPONSE', {department, data: response.response}, status);
					return;
				}
				if (status === 503)
				{
					const newVisitToken = await this.prepareVisit.getPreparedVisitToken();
					if (newVisitToken)
					{
						this.tokenConfig["preparedvisittoken"] = newVisitToken;
						let syncConfig = document.documentElement.dataset.syncConfig;
						if (syncConfig)
						{
							syncConfig = JSON.parse(syncConfig);
							syncConfig["preparedvisittoken"] = newVisitToken;
							document.documentElement.dataset.syncConfig = JSON.stringify(syncConfig);
						}
					}
				}
				if (status === 403 || status === 401)
				{
					this.preventContinue = true;
					this.backendService.notify('reloadPage');
				}
				resolve({department: department, data: {Success: false, Message: 'BAD RESPONSE', Type: 'reloadPage'}});

				console.warn('BAD RESPONSE 1', response);
			}).catch((error) => {
				this.preventContinue = true;
				this.backendService.notify('blockedPage');
				resolve({department: department, data: {Success: false, Message: error.message, Type: 'blockedPage'}});

				console.log('BAD RESPONSE 2', error);
			});
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

	highlightAddress(department, data)
	{
		let highlightData = {};
		if (!data || !data.length)
		{
			this.resultTable.appendResult({
				href: `https://piba.myvisit.com/#!/home/provider/56?d=${department.ServiceId}`,
				name: department.Label,
			})

			highlightData.color = "currentcolor";
		}
		else
		{
			this.resultTable.appendResult({
				href: `https://piba.myvisit.com/#!/home/provider/56?d=${department.ServiceId}`,
				name: department.Label,
				date: data[0].calendarDate.substring(0, 10),
				serviceId: department.ServiceId,
			})

			highlightData.color = "darkseagreen";
			highlightData.text = data[0].calendarDate.substring(0, 10);
		}

		// this.departments.highlightAddress(department, highlightData);
	}
}
;// CONCATENATED MODULE: ./src/page-worker/auto-select-department.js
class AutoSelectDepartment {
    constructor(id, {departments, xhrSubstitute, backendService}) {
        this.desiredDepartmentId = id;
        /** @type {Departments} */
        this.departments = departments;
        /** @type {XhrSubstitute} */
        this.xhrSubstitute = xhrSubstitute;
        /** @type {BackendService} */
        this.backendService = backendService;

        this.xhrSubstitute.addHandler('https://central.myvisit.com/CentralAPI/AppointmentSet', (url, response) => {
            this.handleAppointmentSetResponse(url, JSON.parse(response));
        });
        this.xhrSubstitute.addHandler('https://piba-api.myvisit.com/CentralAPI/AppointmentSet', (url, response) => {
            this.handleAppointmentSetResponse(url, JSON.parse(response));
        });
    }

    helpPeopleToSelectDesiredDepartment() {
        this.departments.clickOnDepartment(this.desiredDepartmentId);
    }

    handleAppointmentSetResponse(queryUrl, response) {
        if (!response.Success) {
            return;
        }
        if (response.Results?.ServiceId == this.desiredDepartmentId) {
            const departmentInfo = this.departments.getDepartmentById(this.desiredDepartmentId);
            this.backendService.notify('appointmentGot', {
                department: {
                    serviceId: departmentInfo.ServiceId,
                    name: departmentInfo.Label,
                },
                date: response.Results.ReferenceDate,
            })
        }
    }
}
;// CONCATENATED MODULE: ./src/page-worker/prepare-visit.js
class PrepareVisit
{
    constructor({backendService})
    {
        /** @type {BackendService} */
        this.backendService = backendService;
        this.tokenConfig = {};
        this.person = {};
    }

    async loadRequestConfig()
    {
        const syncConfig = document.documentElement.dataset.syncConfig;
        this.tokenConfig = syncConfig === undefined ? {} : JSON.parse(syncConfig);
    }

    getRequestHeaders()
    {
        return {
            accept: "application/json, text/plain, */*",
            "accept-language": "en",
            "content-Type": "application/json",
            "application-api-key": this.tokenConfig["application-api-key"],
            "application-name": this.tokenConfig["application-name"],
            "cache-control": "no-cache",
            pragma: "no-cache",
        };
    }

    async getPreparedVisitToken()
    {
        await this.loadRequestConfig();
        await this.loadPerson();

        let question = await this.makeNewVisit();

        let count = 1;
        while (!this.isQuestionDone(question) && !this.hasError(question))
        {
            question = await this.answerQuestion(
                question
            );

            count++;
            if (count > 3)
            {
                console.warn("Can't get preparedVisitToken");
                return undefined;
            }
        }

        if (this.hasError(question))
        {
            console.warn("Can't get preparedVisitToken");
            return undefined;
        }
        const currentTime = new Date();
        const formattedTime = currentTime.getHours() + ":" + currentTime.getMinutes() + ":" + currentTime.getSeconds();

        console.log('got new preparedVisitToken', question.PreparedVisitToken, formattedTime);

        return question.PreparedVisitToken;
    }

    async loadPerson()
    {
        this.person = await this.backendService.getUserData()
    }

    getPersonId()
    {
        return this.person.idNumber;
    }

    getPersonShortPhone()
    {
        return this.person.shortMobilePhone;
    }

    getAnswerTextByQuestionId(questionId)
    {
        const answers = {
            113: this.getPersonId(),
            114: this.getPersonShortPhone(),
        };

        return answers[questionId] || console.warn("Unknown questionId", questionId);
    }

    async answerQuestion(questionData)
    {
        const preparedVisitToken = questionData.PreparedVisitToken;
        const response = await fetch(
            `https://piba-api.myvisit.com/CentralAPI/PreparedVisit/${preparedVisitToken}/Answer`,
            {
                headers: this.getRequestHeaders(),
                referrer: "https://piba.myvisit.com/",
                referrerPolicy: "no-referrer-when-downgrade",
                body: JSON.stringify(this.buildPayloadForAnswer(questionData)),
                method: "POST",
                mode: "cors",
                credentials: "include",
            }
        );

        return response.ok ? response.json().then((res) => res.Data) : undefined;
    }

    buildPayloadForAnswer(questionData)
    {
        return {
            PreparedVisitToken: questionData.PreparedVisitToken,
            QuestionnaireItemId: questionData.QuestionnaireItem.QuestionnaireItemId,
            QuestionId: questionData.QuestionnaireItem.QuestionId,
            AnswerIds: null,
            AnswerText: this.getAnswerTextByQuestionId(questionData.QuestionnaireItem.QuestionId),
        };
    }

    hasError(questionData)
    {
        return Boolean(questionData.Validation?.Messages?.[0]);
    }

    isQuestionDone(questionData)
    {
        return !Boolean(questionData.QuestionnaireItem);
    }

    async makeNewVisit()
    {
        const response = await fetch(
            "https://piba-api.myvisit.com/CentralAPI/Organization/56/PrepareVisit",
            {
                headers: this.getRequestHeaders(),
                referrer: "https://piba.myvisit.com/",
                referrerPolicy: "no-referrer-when-downgrade",
                body: null,
                method: "POST",
                mode: "cors",
                credentials: "include",
            }
        );

        return response.ok ? response.json().then((res) => res.Data) : undefined;
    }
}
;// CONCATENATED MODULE: ./src/page-worker/index.js











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
		{departments, resultTable, xhrSubstitute, backendService}
	);

	locationSearch.fallbackWhenDateNotInLabel((locationResponse) => {
		const desiredDepartmentId = getSyncValue('desiredDepartmentId');
		if (desiredDepartmentId) {
			const autoSelectDepartment = new AutoSelectDepartment(desiredDepartmentId, {departments, xhrSubstitute, backendService});
			setTimeout(() => {
				autoSelectDepartment.helpPeopleToSelectDesiredDepartment();
			}, 1000);
		} else {
			departments.setOriginalOrderByLocationResponse(locationResponse);
			const finderSlots = new FinderSlots({departments, resultTable, backendService, prepareVisit, configDepartments});
			finderSlots.start();
		}
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
/******/ })()
;