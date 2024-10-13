"use server";

import type { Weather } from "@/app/models";
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
		},
	});

	return result.value;
}
