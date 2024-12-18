import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ISettings, Settings } from "../models/settings.model";

@Injectable({
	providedIn: "root",
})
export class SettingsService {
	private settingsSubject: BehaviorSubject<Settings>;

	constructor() {
		const savedSettings = localStorage.getItem("weatherSettings");
		const initialSettings: Settings = savedSettings
		? JSON.parse(savedSettings)
		: new Settings({
			temperatureUnit: "metric",
			windUnit: "m/s",
			pressureUnit: "hPa",
			});

		this.settingsSubject = new BehaviorSubject<Settings>(initialSettings);
	}

	/**
	 * Получить текущие настройки как Observable
	 */
	public getSettings$() {
		return this.settingsSubject.asObservable();
	}

	/**
	 * Получить текущее значение настроек
	 */
	public getCurrentSettings(): Settings {
		return this.settingsSubject.getValue();
	}

	/**
	 * Обновить определенную настройку
	 * @param key - ключ настройки
	 * @param value - новое значение настройки
	 */
	public updateSetting(key: keyof ISettings, value: string): void {
		const currentSettings = this.settingsSubject.getValue();
		const updatedSettings = {
			...currentSettings,
			[key]: value,
		};

		this.settingsSubject.next(updatedSettings);
		localStorage.setItem("weatherSettings", JSON.stringify(updatedSettings));
	}
}
