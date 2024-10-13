"use client";

import { Environment, OrbitControls, Text } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as d3 from "d3";
import { useRef } from "react";
import type * as THREE from "three";

interface NeoObject {
	id: string;
	name: string;
	diameter: number;
	missDistance: number;
	date: string;
}

const NEO = ({
	position,
	size,
	color,
}: {
	position: [number, number, number];
	size: number;
	color: string;
}) => {
	return (
		<mesh position={position}>
			<sphereGeometry args={[size, 32, 32]} />
			<meshStandardMaterial color={color} />
		</mesh>
	);
};

const NEOLabel = ({
	position,
	text,
}: {
	position: [number, number, number];
	text: string;
}) => {
	const { camera } = useThree();
	const textRef = useRef<THREE.Mesh>(null);

	useFrame(() => {
		if (textRef.current) {
			textRef.current.quaternion.copy(camera.quaternion);
		}
	});

	return (
		<Text
			ref={textRef}
			position={position}
			fontSize={0.5}
			color="white"
			anchorX="center"
			anchorY="middle"
		>
			{text}
		</Text>
	);
};

const Scene = ({ data }: { data: NeoObject[] }) => {
	const scaleSize = d3
		.scaleLog()
		.domain([0.01, d3.max(data, (d) => d.diameter) || 1])
		.range([0.1, 2]);
	const scaleDistance = d3
		.scaleLog()
		.domain([1, d3.max(data, (d) => d.missDistance) || 1])
		.range([5, 50]);
	const colorScale = d3
		.scaleSequential(d3.interpolateViridis)
		.domain([0, d3.max(data, (d) => d.missDistance) || 1]);

	return (
		<>
			<ambientLight intensity={0.5} />
			<pointLight position={[10, 10, 10]} />
			{data.map((neo, index) => {
				const angle = (index / data.length) * Math.PI * 2;
				const distance = scaleDistance(neo.missDistance || 1);
				const x = Math.cos(angle) * distance;
				const z = Math.sin(angle) * distance;
				const position: [number, number, number] = [x, 0, z];
				return (
					<group key={neo.id}>
						<NEO
							position={position}
							size={scaleSize(neo.diameter || 0.01)}
							color={colorScale(neo.missDistance)}
						/>
						<NEOLabel position={[x, 2, z]} text={neo.name} />
					</group>
				);
			})}
		</>
	);
};

const Neo3dScene = ({ data }: { data: NeoObject[] }) => {
	return (
		<Canvas camera={{ position: [0, 20, 50], fov: 75 }}>
			<Scene data={data} />
			<OrbitControls />
			<Environment preset="city" />
		</Canvas>
	);
};

export default Neo3dScene;
