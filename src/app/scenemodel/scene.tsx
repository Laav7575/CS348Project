'use client';

import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

type ModelProps = {
  path: string;
  position?: [number, number, number];
  scale?: number | [number, number, number];
};

const Model: React.FC<ModelProps> = ({ path, position = [0, 0, 0], scale = 1 }) => {
  const group = useRef<Group>(null);
  const { scene } = useGLTF(path);

  useFrame(() => {
    if (group.current) group.current.rotation.y += 0.005;
  });

  return <primitive ref={group} object={scene} position={position} scale={scale} />;
};

export default Model;
