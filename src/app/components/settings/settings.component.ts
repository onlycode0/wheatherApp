import { Component, inject, OnInit } from '@angular/core';
import { pressureType, Settings, temperatureType, windType } from '../../models/settings.model';
import { SettingsService } from '../../services/settings.service';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
	private readonly settingsService = inject(SettingsService);

	public settings!: Settings;
	
	// Параметры для dropdown
	public temperatureUnits: temperatureType[] = ["metric", "imperial"];
	public windUnits: windType[] = ["km/h", "mil/h", "m/s", "kn"];
	public pressureUnits: pressureType[] = ["mbar", "atm", "mmHg", "inHg", "hPa"];

	// Храним индекс активного дропдауна (-1 — ничего не открыто)
	public activeDropdown: number = -1;

	public ngOnInit(): void {
		this.settingsService.getSettings$()
			.subscribe((settings) => {
				this.settings = settings;
			});
	}

	public updateSetting(key: keyof Settings, value: string, index: number): void {
		this.settingsService.updateSetting(key, value);
		this.toggleDropdown(index);
	}

	public toggleDropdown(index: number): void {
		this.activeDropdown = this.activeDropdown === index ? -1 : index;
	}
}