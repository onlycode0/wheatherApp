import { Component } from '@angular/core';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  city: string = 'Malang';
  date = new Date();
  weatherData: any;
  hourlyForecast: any[] = [];
  weatherIcon: string = '';

  constructor(private weatherService: WeatherService) {}

  public ngOnInit(): void {
    this.getWeather();
    this.getForecast();
  }

  public getWeather(): void {
      this.weatherService.getWeather(this.city).subscribe((data) => {
          this.weatherData = data;
          console.log(data);
          this.weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      });
  }

  public getForecast(): void {
      this.weatherService.getHourlyForecast(this.city).subscribe((data) => {
          this.hourlyForecast = data.list.slice(0, 5); // Получаем первые 5 прогнозов
      });
  }

  public getForecastIcon(icon: string): string {
      return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }
}
