"use client";

import type { NeoObject } from "@/app/models";
import dynamic from "next/dynamic";
import type React from "react";

const Neo3DScene = dynamic(() => import("@/components/neo3d-scene"), {
	ssr: false,
});

interface Props {
	data: NeoObject[];
}

const Neo3dVisualizationClient: React.FC<Props> = ({ data }) => {
	return (
		<div>
			<Neo3DScene data={data} />
		</div>
	);
};

export default Neo3dVisualizationClient;
