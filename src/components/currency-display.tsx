import type { ExchangeRate } from "@/app/models";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

type Props = {
	conversionRate: ExchangeRate;
};

export function CurrencyDisplay({ conversionRate }: Props) {
	return (
		<Card className="w-[300px]">
			<CardHeader>
				<CardTitle className="text-2xl font-bold">
					Currency Conversion
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-sm text-muted-foreground mb-4">
					Base Currency: {conversionRate.baseCurrency}
				</p>
				<ul className="space-y-2">
					<li
						key={conversionRate.targetCurrency}
						className="flex justify-between items-center"
					>
						<span className="font-medium">{conversionRate.targetCurrency}</span>
						<span
							className={cn(
								"text-xl font-bold",
								conversionRate.rate > 1 ? "text-green-500" : "text-red-500",
							)}
						>
							{conversionRate.rate.toFixed(2)}
						</span>
					</li>
				</ul>
			</CardContent>
			<CardFooter className="text-xs opacity-75 flex items-center justify-end gap-1">
				<Clock className="h-3 w-3" />
				Last Updated:{" "}
				{new Date(conversionRate.time_last_update_unix * 1000).toLocaleString()}
			</CardFooter>
		</Card>
	);
}
