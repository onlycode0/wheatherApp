import { Component, inject, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { SettingsService } from '../../services/settings.service';
import { UnitConverter } from '../../utils/unit-converter.util';
import { Settings } from '../../models/settings.model';
import { IWeather, Weather } from '../../models/weather.model';
import { Forecast } from '../../models/forecast.model';

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
	private readonly settingsService = inject(SettingsService);

	public settings!: Settings;
	public weatherData!: Weather;
	public hourlyForecast: Forecast[] = [];
	public date = new Date();
	public cities = [1, 2, 3];


	constructor(private weatherService: WeatherService) {}

	public ngOnInit(): void {
		this.settings = this.settingsService.getCurrentSettings();
		this.getWeather("Saransk");
		this.getForecast("Saransk");
	}

	public getWeather(city: string): void {
		this.weatherService.getWeather(city)
			.subscribe((data) => {
				console.log('Weather data', data);
				const weatherData: IWeather = {
					name: data.name,
					temp: data.main.temp,
					wind: UnitConverter.convertWindSpeed(data.wind.speed, this.settings.windUnit),
					pressure: UnitConverter.convertPressure(data.main.pressure, this.settings.pressureUnit),
					description: data.weather[0].description,
					icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`
				}

				this.weatherData = weatherData;
			});
	}

	public getForecast(city: string): void {
		this.weatherService.getHourlyForecast(city).subscribe((data) => {
			console.log('Hourly Forecast', data);
			this.hourlyForecast = data.list.map((item: any) => {
				return new Forecast({
					date: item.dt_txt,
					icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png` ,
					temp: item.main.temp,
					feelsLike: item.main.feels_like,
					wind: item.wind.speed
				});
			});
		});
	}
}