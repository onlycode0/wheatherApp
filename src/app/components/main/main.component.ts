import { Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
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
	private readonly weatherService = inject(WeatherService);

	public settings!: Settings;
	public citiesWeather: Weather[] = [];
	public currentCity: Weather | null = null;
	public weeklyForecast: any[] = [];
	public date = new Date();
	public trackedCities: string[] = [];

	public async ngOnInit(): Promise<void> {
		this.settings = this.settingsService.getCurrentSettings();
		this.trackedCities = this.settingsService.getCurrentSettings().trackedCities;
		this.trackedCities.forEach((city, index) => {
			this.getWeather(city, index).then(() => {
				this.getForecast(city);
			});
		});
	}

	public async getWeather(city: string, index: number): Promise<void> {
		this.weatherService.getWeather(city)
			.subscribe((data) => {
				const weatherData: IWeather = {
					name: data.name,
					temp: data.main.temp,
					wind: UnitConverter.convertWindSpeed(data.wind.speed, this.settings.windUnit),
					pressure: UnitConverter.convertPressure(data.main.pressure, this.settings.pressureUnit),
					description: data.weather[0].description,
					icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`,
					forecast: []
				};
	
				// Вставляем в массив строго по индексу
				this.citiesWeather[index] = weatherData;

				if (index === 0) {
					this.currentCity = this.citiesWeather[index];
					this.getWeeklyForecast();
				}
			});
	}

	public getForecast(city: string): void {
		this.weatherService.getHourlyForecast(city).subscribe((data) => {
			console.log('Hourly Forecast', data);
			const cityData = this.citiesWeather.find(item => item.name === city);
			cityData!.forecast = data.list.map((item: any) => {
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

	public getWeeklyForecast() {
		console.log('asdasdasda', this.currentCity?.name);
		
		this.weatherService.getWeeklyForecast(this.currentCity?.name ?? '').subscribe(
			(forecast) => {
				this.weeklyForecast = forecast;
				console.log('Weekly Forecast:', forecast);
			},
			(error) => {
				console.error('Error fetching weekly forecast:', error);
			}
		);
	}

	// Swipe try
	@ViewChild('weatherCard', { static: false }) weatherCard!: ElementRef;

	public currentCardIndex: number = 0; // Текущая карточка
	public startX: number = 0;           // Начальная координата по X
	public isSwiping: boolean = false;   // Флаг свайпа

	// Начало свайпа
	public onMouseDown(event: MouseEvent | TouchEvent, index: number): void {
	  this.startX = this.getEventX(event); // Сохраняем начальную точку
	  this.isSwiping = true;
	}
  
	// Обработка перемещения (свайпа)
	@HostListener('mousemove', ['$event'])
  	@HostListener('touchmove', ['$event'])
	public onMouseMove(event: MouseEvent | TouchEvent): void {
	  	if (!this.isSwiping) return;
  
	  	const currentX = this.getEventX(event); // Текущая точка
	  	const diffX = currentX - this.startX;  // Разница координат
		// console.log(event.currentTarget);
		// 	const card = (event.currentTarget as HTMLElement).querySelector('.weather-card') as HTMLElement;
		// 	card.style.transform = `translateX(${diffX}px)`;
  
	  	// Проверяем направление свайпа
		if (Math.abs(diffX) > 150) {
			if (diffX > 0) {
				this.swipeRight(); 
			} else {
				this.swipeLeft();
			}
		
			this.isSwiping = false;
		}
	}
  
	// Завершение свайпа
	@HostListener('mouseup', ['$event'])
	@HostListener('touchend', ['$event'])
	public onMouseUp(): void {
	  	this.isSwiping = false; // Завершаем свайп
	}
  
	// Свайп вправо
	private swipeRight(): void {
	  if (this.currentCardIndex > 0) {
			this.currentCardIndex--;
			this.currentCity = this.citiesWeather[this.currentCardIndex];
			this.getWeeklyForecast();
	  }
	}
  
	// Свайп влево
	private swipeLeft(): void {
		if (this.currentCardIndex < this.citiesWeather.length - 1) {
			this.currentCardIndex++;
			this.currentCity = this.citiesWeather[this.currentCardIndex];
			this.getWeeklyForecast();
		}
	}
  
	// Получить координату X события
	private getEventX(event: MouseEvent | TouchEvent): number {
		return event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
	}
}


// public currentCardIndex = 0;
  	// private startX = 0;
	

	//   public onMouseDown(event: MouseEvent | TouchEvent, cardIndex: number): void {
	// 	event.preventDefault();
	// 	console.log(event);
	  
	// 	// Сохраняем начальное положение X в зависимости от типа события
	// 	this.startX = this.getClientX(event);
	// 	const card = event.currentTarget as HTMLElement;
	  
	// 	card.style.transition = 'none';
	  
	// 	// Обработчик перемещения
	// 	const onMove = (moveEvent: MouseEvent | TouchEvent) => {
	// 	  const diffX = this.getClientX(moveEvent) - this.startX;
	// 	  card.style.transform = `translateX(${diffX}px)`; // Перемещение карточки по оси X
	// 	};
	  
	// 	// Обработчик завершения перетаскивания
	// 	const onEnd = (endEvent: MouseEvent | TouchEvent) => {
	// 	  const diffX = this.getClientX(endEvent) - this.startX;
	  
	// 	  // Если перемещение больше 150 пикселей, меняем карточку
	// 	  if (diffX > 150 && this.currentCardIndex > 0) {
	// 		this.currentCardIndex--; // Свайп вправо
	// 	  } else if (diffX < -150 && this.currentCardIndex < this.citiesWeather.length - 1) {
	// 		this.currentCardIndex++; // Свайп влево
	// 	  }
	  
	// 	  // Восстанавливаем трансформацию карточки
	// 	  card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
	// 	  card.style.transform = 'translateX(0)';
	  
	// 	  // Убираем обработчики событий после завершения перетаскивания
	// 	  document.removeEventListener('mousemove', onMove);
	// 	  document.removeEventListener('mouseup', onEnd);
	// 	  document.removeEventListener('touchmove', onMove);
	// 	  document.removeEventListener('touchend', onEnd);
	// 	};
	  
	// 	// Добавляем обработчики событий для перетаскивания
	// 	document.addEventListener('mousemove', onMove);
	// 	document.addEventListener('mouseup', onEnd);
	// 	document.addEventListener('touchmove', onMove);
	// 	document.addEventListener('touchend', onEnd);
	//   }
	
	// private getClientX(event: MouseEvent | TouchEvent): number {
	// 	// Для мыши просто используем clientX
	// 	if (event instanceof MouseEvent) {
	// 		return event.clientX;
	// 	}
	// 	// Для касания проверяем, есть ли touches и возвращаем clientX для первого касания
	// 	else if (event instanceof TouchEvent && event.touches.length > 0) {
	// 		return event.touches[0].clientX;
	// 	}
	// 	return 0; // Если событие не подходит, возвращаем 0
	// }