import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Sphere, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { ElementData } from '../../types';

interface BohrModelProps {
  element: ElementData;
  speed?: number;
}

const Electron: React.FC<{ radius: number; speed: number; offset: number; color: string }> = ({ radius, speed, offset, color }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * speed + offset;
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.z = Math.sin(t) * radius;
    }
  });

  return (
    <Trail width={0.5} length={4} color={new THREE.Color(color)} attenuation={(t) => t * t}>
      <Sphere ref={ref} args={[0.15, 16, 16]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </Sphere>
    </Trail>
  );
};

export const BohrModel: React.FC<BohrModelProps> = ({ element, speed = 1 }) => {
  const groupRef = useRef<THREE.Group>(null);
  const shells = element.shells;

  // Generate orbit paths
  const orbits = useMemo(() => {
    return shells.map((count, index) => {
      const radius = 2 + index * 1.5;
      return { radius, count, id: index };
    });
  }, [shells]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
      groupRef.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Nucleus */}
      <Sphere args={[0.8, 32, 32]}>
        <meshStandardMaterial color="#ff3333" emissive="#550000" roughness={0.2} />
      </Sphere>
      
      {/* Orbits and Electrons */}
      {orbits.map((orbit) => (
        <group key={orbit.id} rotation={[Math.random() * 0.5, 0, Math.random() * 0.5]}>
          {/* Orbit Line */}
          <Line
            points={new THREE.EllipseCurve(0, 0, orbit.radius, orbit.radius, 0, 2 * Math.PI, false, 0).getPoints(64)}
            color="rgba(255,255,255,0.1)"
            lineWidth={1}
          />
          
          {/* Electrons in this shell */}
          {Array.from({ length: orbit.count }).map((_, i) => (
            <Electron 
              key={`${orbit.id}-${i}`}
              radius={orbit.radius}
              speed={(1 / (orbit.id + 1)) * speed * 2} // Outer shells move slower
              offset={(i / orbit.count) * Math.PI * 2}
              color="#00f3ff"
            />
          ))}
        </group>
      ))}
    </group>
  );
};
