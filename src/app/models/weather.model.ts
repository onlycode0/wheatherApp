import { Forecast } from "./forecast.model";

export interface IWeather {
	name: string;
	temp: number;
	wind: number;
	pressure: number;
	description: string;
	icon: string;
	forecast: Forecast[];
}

export class Weather implements IWeather {
	name: string;
	temp: number;
	wind: number;
	pressure: number;
	description: string;
	icon: string;
	forecast: Forecast[];

	constructor(data: IWeather) {
		this.name = data.name;
		this.temp = data.temp;
		this.wind = data.wind;
		this.pressure = data.pressure;
		this.description = data.description;
		this.icon = data.icon;
		this.forecast = data.forecast;
	}
}
