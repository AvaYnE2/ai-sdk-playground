export interface Weather {
	location: string;
	current: {
		temperature: string;
		condition: string;
		humidity: number;
		windSpeed: number;
	};
	forecast: {
		day: string;
		high: number;
		low: number;
		condition: string;
	}[];
}

export interface ExchangeRate {
	baseCurrency: string;
	targetCurrency: string;
	rate: number;
	time_last_update_unix: number;
}

export interface NeoData {
	element_count: number;
	near_earth_objects: {
		[date: string]: {
			id: string;
			name: string;
			estimated_diameter: { kilometers: { estimated_diameter_max: number } };
			close_approach_data: { miss_distance: { kilometers: string } }[];
		}[];
	};
}

export interface NeoObject {
	id: string;
	name: string;
	diameter: number;
	missDistance: number;
	date: string;
}
