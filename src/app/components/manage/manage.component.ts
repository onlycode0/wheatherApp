import { Component, inject } from '@angular/core';
import { BehaviorSubject, debounceTime, forkJoin, map, switchMap } from 'rxjs';
import { WeatherService } from '../../services/weather.service';
import { SettingsService } from '../../services/settings.service';

@Component({
	selector: 'app-manage',
	templateUrl: './manage.component.html',
	styleUrl: './manage.component.scss'
})
export class ManageComponent {
	private readonly settingsService = inject(SettingsService);
	private readonly weatherService = inject(WeatherService);
	public searchTerm$ = new BehaviorSubject<string>('');
	public cities: ICity[] = [];

	constructor() {
		this.setupSearch();
	}
	
	public onSearch(event: Event): void {
		const input = (event.target as HTMLInputElement).value;
		this.searchTerm$.next(input);
	}

	private setupSearch() {
		this.searchTerm$.pipe(
			debounceTime(500),
			switchMap((searchTerm) => {
				if (!searchTerm.trim()) {
					this.cities = [];
					return [];
				}
	
				return this.weatherService.searchCity(searchTerm).pipe(
					switchMap((cities: any[]) => {
						// Выполнение последовательных запросов для получения погоды
						const weatherRequests = cities.map((city) =>
							this.weatherService.getWeatherByCoordinates(city.lat, city.lon).pipe(
							map((weather) => ({
								...city,
								weather: {
									temp: weather.main.temp,
									icon: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
									feelsLike: weather.main.feels_like,
									description: weather.weather[0].description
								}
							}))
							)
						);

						return forkJoin(weatherRequests);
					})
				);
			})
		)
		.subscribe((citiesWithWeather) => {
			console.log(citiesWithWeather);
			this.cities = citiesWithWeather;
		});
	}

	public trackCity(name: string) {
		const currentCities = this.settingsService.getCurrentSettings().trackedCities;
		console.log('bb');
		
		this.settingsService.updateSetting('trackedCities', [...currentCities, name]);
	}
}

export interface ICity {
	name: string;
	weather: IWeather;
}

export interface IWeather {
	temp: number;
	icon: string;
	feelsLike: number;
	description: string;
}