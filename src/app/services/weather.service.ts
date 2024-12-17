import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class WeatherService {
    private apiKey = 'b854ddabfa588f1cdf410dbea11f05af';
    private baseUrl = 'https://api.openweathermap.org/data/2.5/';

    constructor(private http: HttpClient) {}

    getWeather(city: string): Observable<any> {
        const url = `${this.baseUrl}weather?q=${city}&units=metric&appid=${this.apiKey}`;
        return this.http.get(url);
    }

    getHourlyForecast(city: string): Observable<any> {
        const url = `${this.baseUrl}forecast?q=${city}&units=metric&appid=${this.apiKey}`;
        return this.http.get(url);
    }
}
