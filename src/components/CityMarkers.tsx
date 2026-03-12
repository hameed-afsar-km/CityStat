import { useMemo, useState } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { getCityPosition } from '../utils/geoUtils';

const LOCATIONS = [
  // Maharashtra
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, pop: 20411000, type: 'City', metric: 'AQI: 120 | Temp: 32°C' },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, pop: 6629000, type: 'City', metric: 'AQI: 95 | Temp: 28°C' },
  { name: 'Lonavala', state: 'Maharashtra', lat: 18.7481, lng: 73.4071, pop: 57698, type: 'Town', metric: 'AQI: 40 | Temp: 24°C' },
  { name: 'Khandala', state: 'Maharashtra', lat: 18.7554, lng: 73.3753, pop: 12400, type: 'Village', metric: 'AQI: 35 | Temp: 22°C' },
  // Delhi NCT
  { name: 'New Delhi', state: 'NCT of Delhi', lat: 28.6139, lng: 77.2090, pop: 30291000, type: 'City', metric: 'AQI: 310 | Temp: 38°C' },
  { name: 'Najafgarh', state: 'NCT of Delhi', lat: 28.6090, lng: 76.9798, pop: 1365000, type: 'Town', metric: 'AQI: 280 | Temp: 36°C' },
  // Karnataka
  { name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946, pop: 12327000, type: 'City', metric: 'AQI: 90 | Temp: 26°C' },
  { name: 'Mysuru', state: 'Karnataka', lat: 12.2958, lng: 76.6394, pop: 1199000, type: 'City', metric: 'AQI: 65 | Temp: 28°C' },
  { name: 'Hampi', state: 'Karnataka', lat: 15.3350, lng: 76.4600, pop: 2800, type: 'Village', metric: 'AQI: 45 | Temp: 34°C' },
  // Tamil Nadu
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, pop: 10971000, type: 'City', metric: 'AQI: 110 | Temp: 35°C' },
  { name: 'Ooty', state: 'Tamil Nadu', lat: 11.4100, lng: 76.6950, pop: 88400, type: 'Town', metric: 'AQI: 30 | Temp: 19°C' },
  // West Bengal
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, pop: 14850000, type: 'City', metric: 'AQI: 160 | Temp: 33°C' },
  { name: 'Darjeeling', state: 'West Bengal', lat: 27.0360, lng: 88.2627, pop: 132000, type: 'Town', metric: 'AQI: 40 | Temp: 14°C' },
  // Telangana
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, pop: 10004000, type: 'City', metric: 'AQI: 85 | Temp: 31°C' },
  // Gujarat
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, pop: 8253000, type: 'City', metric: 'AQI: 155 | Temp: 40°C' },
  { name: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311, pop: 6936000, type: 'City', metric: 'AQI: 130 | Temp: 36°C' },
  { name: 'Dhordo', state: 'Gujarat', lat: 23.8222, lng: 69.5601, pop: 850, type: 'Village', metric: 'AQI: 80 | Temp: 42°C' },
  // Rajasthan
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, pop: 3910000, type: 'City', metric: 'AQI: 140 | Temp: 39°C' },
  { name: 'Kuldhara', state: 'Rajasthan', lat: 26.8741, lng: 70.7852, pop: 0, type: 'Village', metric: 'AQI: 60 | Temp: 45°C' },
  // Sikkim
  { name: 'Gangtok', state: 'Sikkim', lat: 27.3389, lng: 88.6065, pop: 100000, type: 'City', metric: 'AQI: 35 | Temp: 16°C' },
  { name: 'Lachen', state: 'Sikkim', lat: 27.7167, lng: 88.5500, pop: 1000, type: 'Village', metric: 'AQI: 15 | Temp: 8°C' },
];

interface CityMarkersProps {
  selectedState: string;
  onCityClick: (cityName: string) => void;
}

export default function CityMarkers({ selectedState, onCityClick }: CityMarkersProps) {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  const stateLocations = useMemo(() => {
    return LOCATIONS.filter(l => l.state === selectedState);
  }, [selectedState]);

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
