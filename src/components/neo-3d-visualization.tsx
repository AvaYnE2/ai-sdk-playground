import type { NeoData } from "@/app/models";
import Neo3dVisualizationClient from "@/components/neo3d-visualization-client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useMemo } from "react";

interface NeoObject {
	id: string;
	name: string;
	diameter: number;
	missDistance: number;
	date: string;
}

interface Props {
	data: NeoData;
}

export function Neo_3dVisualization({ data }: Props) {
	const processedData: NeoObject[] = useMemo(() => {
		return Object.entries(data.near_earth_objects).flatMap(([date, objects]) =>
			objects.map((obj) => ({
				id: obj.id,
				name: obj.name,
				diameter:
					obj.estimated_diameter?.kilometers?.estimated_diameter_max || 0,
				missDistance: Number.parseFloat(
					obj.close_approach_data[0]?.miss_distance?.kilometers || "0",
				),
				date,
			})),
		);
	}, [data]);

	return (
		<Card className="w-[400px] h-1/4">
			<CardHeader>
				<CardTitle>3D Near Earth Objects Visualization</CardTitle>
				<CardDescription>
					{/*Total objects: {data.element_count} | Showing: {processedData.length}*/}
					Timespan from {Object.keys(data.near_earth_objects)[0]} to{" "}
					{Object.keys(data.near_earth_objects).reverse()[0]}
				</CardDescription>
			</CardHeader>
			<CardContent className="h-[calc(100%-5rem)]">
				<Neo3dVisualizationClient data={processedData} />
			</CardContent>
		</Card>
	);
}
