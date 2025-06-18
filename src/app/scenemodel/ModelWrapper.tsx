"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Group } from 'three';

type ModelProps = {
  path: string;
  scale?: number | [number, number, number];
};

const Model: React.FC<ModelProps> = ({ path, scale = 1 }) => {
  const group = useRef<Group>(null);
  const { scene } = useGLTF(path);

  useFrame(() => {
    if (group.current) group.current.rotation.y += 0.005;
  });

  return <primitive ref={group} object={scene} scale={scale} />;
};

type WrapperProps = {
  width?: string;
  height?: string;
  style?: React.CSSProperties;
  path?: string;
  modelScale?: number | [number, number, number];
};

export default function ModelWrapper({
  width = '600px',
  height = '400px',
  style,
  path = '/scene.gltf',
  modelScale = 3,
}: WrapperProps) {
  return (
    <div
      style={{
        width,
        height,
        //margin: 'auto',
        overflow: 'hidden',
        ...style,
      }}
    >
      <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
        <ambientLight intensity={10} />
        <directionalLight position={[5, 10, 7]} intensity={2} />
        <pointLight position={[0, 5, 10]} intensity={1.5} />
        <hemisphereLight  groundColor="gray" intensity={0.6} />
        <Model path={path} scale={modelScale} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
