"use server";

import type { ExchangeRate, NeoData, Weather } from "@/app/models";
import { CurrencyDisplay } from "@/components/currency-display";
import { Neo_3dVisualization } from "@/components/neo-3d-visualization";
import { WeatherComponentComponent } from "@/components/weather-component";
import { openai } from "@ai-sdk/openai";
import { streamUI } from "ai/rsc";
import { z } from "zod";

const LoadingComponent = () => (
	<div className="animate-pulse p-4">getting weather...</div>
);

const getWeather = async (location: string) => {
	console.log("Getting weather for", location);
	const response = await fetch(
		`https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHERAPI_KEY}&q=${location}&days=3`,
	);
	const data = await response.json();

	const weatherData: Weather = {
		location: data.location.name as string,
		current: {
			temperature: `${data.current.temp_c}°C`,
			condition: data.current.condition.text,
			humidity: data.current.humidity,
			windSpeed: data.current.wind_kph,
		},
		forecast: data.forecast.forecastday.map((day: any) => ({
			day: new Date(day.date).toLocaleDateString("en-EN", { weekday: "long" }),
			high: day.day.maxtemp_c,
			low: day.day.mintemp_c,
			condition: day.day.condition.text,
		})),
	};

	return weatherData;
};

async function getExchangeRate(baseCurrency: string, targetCurrency: string) {
	const response = await fetch(
		`https://open.er-api.com/v6/latest/${baseCurrency}`,
	);
	const data = await response.json();

	const exchangeRate = data.rates[targetCurrency];

	const result: ExchangeRate = {
		baseCurrency: baseCurrency,
		targetCurrency: targetCurrency,
		rate: exchangeRate,
		time_last_update_unix: data.time_last_update_unix,
	};

	return result;
}

async function getAsteroidData(startDate: string, endDate: string) {
	const apiKey = "DEMO_KEY";
	const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;

	const response = await fetch(url);
	const data = (await response.json()) as NeoData;

	data.near_earth_objects[startDate] = [
		{
			id: "3542519",
			name: "Earth",
			estimated_diameter: { kilometers: { estimated_diameter_max: 12742 } },
			close_approach_data: [{ miss_distance: { kilometers: "0" } }],
		},
		...data.near_earth_objects[startDate],
	];
	return data;
}

export async function streamComponent(userInput: string) {
	const result = await streamUI({
		model: openai("gpt-4o-mini"),
		prompt: userInput,
		text: ({ content }) => <div>{content}</div>,
		tools: {
			getWeather: {
				description: "Get the weather for a location",
				parameters: z
					.object({
						location: z.string().describe("The location"),
					})
					.required(),
				generate: async function* ({ location }) {
					yield <LoadingComponent />;
					const weather = await getWeather(location);
					return <WeatherComponentComponent weather={weather} />;
				},
			},
			getExchangeRate: {
				description: "Get the exchange rate for a currency",
				parameters: z
					.object({
						baseCurrency: z.string().describe("The base currency code"),
						targetCurrency: z
							.string()
							.optional()
							.describe("The target currency code"),
					})
					.required(),
				generate: async function* ({ baseCurrency, targetCurrency }) {
					yield <LoadingComponent />;
					const exchangeRate = await getExchangeRate(
						baseCurrency,
						targetCurrency,
					);

					return <CurrencyDisplay conversionRate={exchangeRate} />;
				},
			},
			getAsteroidData: {
				description: "Get the data of the asteroids near earth",
				parameters: z.object({
					startDate: z.string().describe("From when to get the data"),
					endDate: z.string().describe("Until when to get the data"),
				}),
				generate: async function* ({ startDate, endDate }) {
					yield <LoadingComponent />;

					const response = await getAsteroidData(startDate, endDate);

					return <Neo_3dVisualization data={response} />;
				},
			},
		},
	});

	return result.value;
}
