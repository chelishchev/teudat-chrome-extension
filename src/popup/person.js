export class Person
{
	constructor(phoneNumber, idNumber, name, color)
	{
		this.color = color;
		this.phoneNumber = phoneNumber.replace(/[^\d]/g, '');
		this.idNumber = idNumber.replace(/[^\d]/g, '');
		this.name = name;
	}

	getShortMobilePhone()
	{
		return '0' + this.phoneNumber.slice(3);
	}

	getMobilePhone()
	{
		return this.phoneNumber;
	}

	getIdNumber()
	{
		return this.idNumber;
	}

	getName()
	{
		return this.name;
	}

	getColor()
	{
		return this.color;
	}

	exportToMessage()
	{
		return {
			phoneNumber: this.phoneNumber,
			idNumber: this.idNumber,
			shortMobilePhone: this.getShortMobilePhone(),
		}
	}
}