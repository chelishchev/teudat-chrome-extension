const colors = ['#4169E1', '#87CEEB', '#FFA500', '#B8860B', '#F0E68C', '#EEE8AA'];

export class ColorByIndex
{
	constructor(index)
	{
	}

	getColor(index)
	{
		return colors[index % colors.length];
	}
}