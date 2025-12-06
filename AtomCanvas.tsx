import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import { BohrModel } from './BohrModel';
import { ElementData } from '../../types';

interface AtomCanvasProps {
  element: ElementData;
  mode: 'bohr' | 'orbital' | 'filling';
}

export const AtomCanvas: React.FC<AtomCanvasProps> = ({ element, mode }) => {
  return (
    <div className="w-full h-full min-h-[300px] relative bg-black/40 rounded-xl overflow-hidden border border-white/10">
      <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} color="blue" intensity={0.5} />
          
          {mode === 'bohr' && <BohrModel element={element} />}
          
          {/* Fallback visualizers for other modes for this demo */}
          {mode === 'orbital' && (
            <group>
               <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
               <BohrModel element={element} speed={0.1} /> 
               <mesh>
                 <sphereGeometry args={[4, 32, 32]} />
                 <meshStandardMaterial color="#8800ff" wireframe opacity={0.1} transparent />
               </mesh>
            </group>
          )}
           {mode === 'filling' && (
            <group>
               <BohrModel element={element} speed={5} /> 
            </group>
          )}

          <OrbitControls enablePan={false} maxDistance={20} minDistance={2} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-2 left-2 text-xs text-white/50 pointer-events-none">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
};
