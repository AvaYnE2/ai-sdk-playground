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
