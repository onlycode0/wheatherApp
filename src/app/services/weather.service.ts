import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';
import { SettingsService } from './settings.service';

@Injectable({
	providedIn: 'root',
})
export class WeatherService {
	private readonly settingsService = inject(SettingsService);
	private readonly httpClient = inject(HttpClient);
	
	private apiKey = 'b854ddabfa588f1cdf410dbea11f05af';
	private baseUrl = 'https://api.openweathermap.org/data/2.5/';
	private geoApiUrl = 'https://api.openweathermap.org/geo/1.0/direct';

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

	public getWeatherByCoordinates(lat: number, lon: number): Observable<any> {
		const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
		return this.httpClient.get(url);
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

	public searchCity(cityName: string, limit: number = 5): Observable<any> {
		const url = `${this.geoApiUrl}?q=${cityName}&limit=${limit}&appid=${this.apiKey}`;
		return this.httpClient.get(url);
	}

	public getWeeklyForecast(city: string): Observable<any> {
		const settings = this.settingsService.getCurrentSettings();
	
		// Получаем координаты города
		return this.searchCity(city).pipe(
			switchMap((cityData) => {
				if (!cityData || cityData.length === 0) {
					throw new Error('City not found');
				}
				const lat = cityData[0].lat;
				const lon = cityData[0].lon;
	
				// Запрос к Open-Meteo для получения прогноза на 7 дней
				return this.httpClient.get(`https://api.open-meteo.com/v1/forecast`, {
					params: {
						latitude: lat,
						longitude: lon,
						daily: 'temperature_2m_min,temperature_2m_max,precipitation_sum,weathercode',
						unit_system: settings.temperatureUnit === 'metric' ? 'metric' : 'imperial', // В зависимости от единиц
					},
				});
			}),
			map((response: any) => {
				// Обработка полученного прогноза
				console.log(response);
				
				return this.processDailyForecast(response.daily);
			})
		);
	}

	private processDailyForecast(response: any): any[] {
		return response.time.map((date: string, index: number) => {
			// Преобразуем код погоды в описание
			const weatherDescription = this.getWeatherDescription(response.weathercode[index]);
			
			// Формируем данные для отображения
			return {
				date: date, // Дата в формате "YYYY-MM-DD"
				tempMin: response.temperature_2m_min[index],
				tempMax: response.temperature_2m_max[index],
				precipitation: response.precipitation_sum[index],
				weather: weatherDescription,
			};
		});
	}

	private getWeatherDescription(code: number): string {
		const weatherCodes = {
			0: 'Clear sky',
			1: 'Mainly clear',
			2: 'Partly cloudy',
			3: 'Cloudy',
			45: 'Fog',
			48: 'Depositing rime fog',
			51: 'Light drizzle',
			53: 'Moderate drizzle',
			55: 'Heavy drizzle',
			56: 'Freezing drizzle',
			57: 'Heavy freezing drizzle',
			61: 'Light rain',
			63: 'Moderate rain',
			65: 'Heavy rain',
			71: 'Light snow',
			73: 'Moderate snow',
			75: 'Heavy snow',
			77: 'Snow grains',
			80: 'Light rain showers',
			81: 'Moderate rain showers',
			82: 'Heavy rain showers',
			85: 'Light snow showers',
			86: 'Heavy snow showers',
		};
	
		//@ts-ignore
		return weatherCodes[code] || 'Unknown weather';
	}
}
