export interface IForecast {
	date: string;
	icon: string;
	temp: number;
	feelsLike: number;
	wind: number;
}

export class Forecast implements IForecast {
	date: string;
	icon: string;
	temp: number;
	feelsLike: number;
	wind: number;

	constructor(data: IForecast) {
		this.date = data.date;
		this.icon = data.icon;
		this.temp = data.temp;
		this.feelsLike = data.feelsLike;
		this.wind = data.wind;
	}
}
