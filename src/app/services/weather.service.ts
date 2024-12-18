import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SettingsService } from './settings.service';

@Injectable({
	providedIn: 'root',
})
export class WeatherService {
	private readonly settingsService = inject(SettingsService);
	private readonly httpClient = inject(HttpClient);
	
	private apiKey = 'b854ddabfa588f1cdf410dbea11f05af';
	private baseUrl = 'https://api.openweathermap.org/data/2.5/';

	public getWeather(city: string): Observable<any> {
		const settings = this.settingsService.getCurrentSettings();

		return this.httpClient.get(`${this.baseUrl}weather`, {
			params: {
				q: city,
				units: settings.temperatureUnit,
				appid: this.apiKey,
			},
		});
	}

	public getHourlyForecast(city: string): Observable<any> {
		const settings = this.settingsService.getCurrentSettings();

		return this.httpClient.get(`${this.baseUrl}forecast`, {
			params: {
				q: city,
				units: settings.temperatureUnit,
				cnt: 5,
				appid: this.apiKey,
			},
		});
	}
}
