import type { Weather } from "@/app/models";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Cloud, Droplets, Sun, Wind } from "lucide-react";

interface Props {
	weather: Weather;
}

export function WeatherComponentComponent({ weather }: Props) {
	const getWeatherIcon = (condition: string) => {
		switch (condition.toLowerCase()) {
			case "sunny":
				return <Sun className="h-6 w-6 text-yellow-400" />;
			case "cloudy":
				return <Cloud className="h-6 w-6 text-gray-400" />;
			case "rainy":
				return <Droplets className="h-6 w-6 text-blue-400" />;
			default:
				return <Cloud className="h-6 w-6 text-gray-400" />;
		}
	};

	return (
		<Card className="w-full max-w-3xl mx-auto">
			<CardHeader>
				<CardTitle className="text-2xl font-bold">Weather Forecast</CardTitle>
				<CardDescription>Your local 3-day weather outlook</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="bg-primary/10 p-6 rounded-lg">
						<h2 className="text-xl font-semibold mb-2">Current Weather</h2>
						<p className="text-lg font-medium text-muted-foreground mb-4">
							{weather.location}
						</p>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-4xl font-bold">
									{weather.current.temperature}
								</p>
								<p className="text-lg">{weather.current.condition}</p>
							</div>
							{getWeatherIcon(weather.current.condition)}
						</div>
						<div className="mt-4 flex justify-between text-sm">
							<div className="flex items-center">
								<Droplets className="h-4 w-4 mr-1" />
								<span>{weather.current.humidity}% Humidity</span>
							</div>
							<div className="flex items-center">
								<Wind className="h-4 w-4 mr-1" />
								<span>{weather.current.windSpeed} kph Wind</span>
							</div>
						</div>
					</div>
					<div>
						<h2 className="text-xl font-semibold mb-4">3-Day Forecast</h2>
						<div className="space-y-4">
							{weather.forecast.map((day) => (
								<div
									key={day.day}
									className="flex items-center justify-between bg-secondary/10 p-3 rounded-lg"
								>
									<div>
										<p className="font-medium">{day.day}</p>
										<p className="text-sm text-muted-foreground">
											{day.low}°C - {day.high}°C
										</p>
									</div>
									{getWeatherIcon(day.condition)}
								</div>
							))}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
