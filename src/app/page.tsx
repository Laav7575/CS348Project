'use client';
import Image from "next/image";
import NavBar from "../components/NavBar";
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Model from './scenemodel/scene';
import ModelWrapper from './scenemodel/ModelWrapper';

export default function Home() {
  return (
    <>
    <div className="bg-gray-900 h-screen w-screen">
      <NavBar />
      <div className="flex justify-center items-left pl-48 h-8/10">
        <div className="flex flex-col justify-center items-left">
          <div className="text-5xl/16 text-slate-100 w-100">
            <span className="text-amber-300 pr-3">Discover</span>your dream car.
          </div>
          <div>
            <a className="inline-flex items-center gap-2 bg-white text-black px-10 py-3 mt-6 w-fit rounded-md hover:bg-amber-300" href="/explore">Explore →</a>

          </div>
        </div>
     <div>
        <div style={{ display: 'flex', margin: 0, padding: 0 }}>
        <div style={{ flex: 1, margin: 0, padding: 0 }}>
        <div style={{ width: '800px', height: '600px', overflow: 'hidden' }}>
    
        <Canvas 
          style={{ display: 'block', width: '100%', height: '100%' }}
          camera={{ position: [0, 0.6, 3], fov: 60 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[5, 10, 7]} intensity={2} />
          <pointLight position={[0, 5, 10]} intensity={1.5} />
          <hemisphereLight  groundColor="gray" intensity={0.6} />
          <Model path={'./scene.gltf'} scale={1.5} position={[-0.4, 0, 0]}/>
          <OrbitControls />
        </Canvas>
        </div>
        </div>
        </div>
      </div>
    </div>
    </div>
    </>
  );
}
