import { AiAssistantChat } from "@/components/ai-assistant-chat";
import Neo3dVisualizationClient from "@/components/neo3d-visualization-client";
import React from "react";

export default function Page() {
	return (
		<div>
			<AiAssistantChat />
			<Neo3dVisualizationClient data={[]} />
		</div>
	);
}
