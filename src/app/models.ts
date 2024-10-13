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
