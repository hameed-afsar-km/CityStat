import { useMemo, useState } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { getCityPosition } from '../utils/geoUtils';

import { CITIES_DATA } from '../data/citiesData';

const LOCATIONS = CITIES_DATA;

interface CityMarkersProps {
  selectedState: string;
  selectedDistrict?: string | null;
  onCityClick: (cityName: string) => void;
}

export default function CityMarkers({ selectedState, selectedDistrict, onCityClick }: CityMarkersProps) {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  const stateLocations = useMemo(() => {
    let locs = LOCATIONS.filter(l => l.state === selectedState);
    if (selectedDistrict) {
      const districtLocs = locs.filter(l => l.district === selectedDistrict);
      // Fallback to all state locations if district has no matches
      locs = districtLocs.length > 0 ? districtLocs : locs;
    }
    return locs;
  }, [selectedState, selectedDistrict]);

  const getBaseRadius = (type: string) => {
    if (type === 'City') return 1.2;
    if (type === 'Town') return 0.8;
    return 0.5; // Village
  };

  const circleShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 1, 0, Math.PI * 2, false);
    return shape;
  }, []);

  return (
    <group position={[0, 0, 1]}>
      {stateLocations.map((loc) => {
        const [x, y] = getCityPosition(loc.lat, loc.lng);
        const isHovered = hoveredLocation === loc.name;
        
        // Extrude heavily on hover. Default depth is minimal (flat)
        const depth = isHovered ? 8 : 0.5;
        
        const typeColors: any = { City: '#00f0ff', Town: '#a855f7', Village: '#22c55e' };
        const baseColor = typeColors[loc.type] || '#00f0ff';
        const color = isHovered ? '#ffffff' : baseColor;
        const scale = getBaseRadius(loc.type);
        
        return (
          <group key={loc.name} position={[x, y, 0]} scale={[scale, scale, 1]}>
            <mesh 
              onPointerOver={(e) => { e.stopPropagation(); setHoveredLocation(loc.name); }}
              onPointerOut={(e) => { e.stopPropagation(); setHoveredLocation(null); }}
              onClick={(e) => { e.stopPropagation(); onCityClick(loc.name); }}
              position={[0, 0, depth / 2]}
            >
              <extrudeGeometry args={[circleShape, { depth, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelOffset: 0, bevelSegments: 3 }]} />
              <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} />
            </mesh>
            
            {/* Base Glow */}
            <mesh position={[0, 0, 0.1]}>
              <circleGeometry args={[isHovered ? 2.5 : 1.8, 32]} />
              <meshBasicMaterial color={baseColor} transparent opacity={isHovered ? 0.6 : 0.4} />
            </mesh>

            {isHovered && (
              <Html position={[0, 0, depth + 1]} center zIndexRange={[100, 0]}>
                <div className="bg-black/85 backdrop-blur-md text-white px-4 py-3 rounded-xl border border-white/20 shadow-2xl pointer-events-none whitespace-nowrap min-w-[120px]">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="font-black text-lg tracking-tight">{loc.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${baseColor}40`, color: baseColor }}>
                      {loc.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="text-xs text-gray-300 font-medium">
                      Population: <span className="text-white">{(loc.pop / 1000).toLocaleString()}k</span>
                    </div>
                    <div className="text-xs text-gray-300 font-medium">
                      Live Stats: <span className="text-blue-400">{loc.metric}</span>
                    </div>
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

export { LOCATIONS as CITIES };
