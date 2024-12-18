export interface ISettings {
	temperatureUnit: temperatureType;
	windUnit: windType;
	pressureUnit: pressureType;
	trackedCities: string[];
}

export class Settings implements ISettings {
	temperatureUnit: temperatureType;
	windUnit: windType;
	pressureUnit: pressureType;
	trackedCities: string[];

	constructor(settings: ISettings) {
		this.temperatureUnit = settings.temperatureUnit;
		this.windUnit = settings.windUnit;
		this.pressureUnit = settings.pressureUnit;
		this.trackedCities = settings.trackedCities;
	}
}

export type temperatureType = 'metric' | 'imperial';
export type windType = 'km/h' |'mil/h' | 'm/s' | 'kn';
export type pressureType = 'mbar' | 'atm' | 'mmHg' | 'inHg' | 'hPa';