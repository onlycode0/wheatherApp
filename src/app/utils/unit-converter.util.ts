import { pressureType, windType } from "../models/settings.model";

export class UnitConverter {
	static convertWindSpeed(value: number, unit: windType): number {
		switch (unit) {
			case 'km/h': return value * 3.6;   // м/с → км/ч
			case 'mil/h': return value * 2.237; // м/с → миль/ч
			case 'kn': return value * 1.94384; // м/с → узлы
			default: return value;             // м/с
		}
	}

	static convertPressure(value: number, unit: pressureType): number {
		switch (unit) {
			case 'atm': return value / 1013.25;
			case 'mmHg': return value * 0.750062;
			case 'inHg': return value * 0.02953;
			default: return value; // hPa
		}
	}
}