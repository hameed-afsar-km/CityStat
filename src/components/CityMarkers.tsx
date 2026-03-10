import { useMemo, useState } from 'react';
import { Html } from '@react-three/drei';
import { getCityPosition } from '../utils/geoUtils';

const CITIES = [
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, pop: 20411000 },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, pop: 6629000 },
  { name: 'Delhi', state: 'NCT of Delhi', lat: 28.7041, lng: 77.1025, pop: 30291000 },
  { name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946, pop: 12327000 },
  { name: 'Mysuru', state: 'Karnataka', lat: 12.2958, lng: 76.6394, pop: 1199000 },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, pop: 10971000 },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, pop: 14850000 },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, pop: 10004000 },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, pop: 8253000 },
  { name: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311, pop: 6936000 },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, pop: 3910000 },
  { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, pop: 3765000 },
  { name: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319, pop: 3121000 },
  { name: 'Shillong', state: 'Meghalaya', lat: 25.5788, lng: 91.8933, pop: 460000 },
  { name: 'Gangtok', state: 'Sikkim', lat: 27.3389, lng: 88.6065, pop: 100000 },
];

interface CityMarkersProps {
  selectedState: string;
  onCityClick: (cityName: string) => void;
}

export default function CityMarkers({ selectedState, onCityClick }: CityMarkersProps) {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  const stateCities = useMemo(() => {
    return CITIES.filter(c => c.state === selectedState);
  }, [selectedState]);

  return (
    <group position={[0, 0, 5]}>
      {stateCities.map((city) => {
        const [x, y] = getCityPosition(city.lat, city.lng);
        const isHovered = hoveredCity === city.name;
        
        return (
          <group key={city.name} position={[x, y, 0]}>
            <mesh 
              onPointerOver={(e) => { e.stopPropagation(); setHoveredCity(city.name); }}
              onPointerOut={(e) => { e.stopPropagation(); setHoveredCity(null); }}
              onClick={(e) => { e.stopPropagation(); onCityClick(city.name); }}
            >
              <sphereGeometry args={[isHovered ? 1.5 : 1, 16, 16]} />
              <meshBasicMaterial color={isHovered ? '#ffffff' : '#00f0ff'} />
            </mesh>
            
            {/* Glowing effect */}
            <mesh position={[0, 0, -0.1]}>
              <circleGeometry args={[isHovered ? 2.5 : 1.8, 32]} />
              <meshBasicMaterial color="#00f0ff" transparent opacity={0.4} />
            </mesh>

            {isHovered && (
              <Html position={[0, 2, 0]} center>
                <div className="bg-black/80 backdrop-blur-md text-white px-3 py-2 rounded-lg border border-white/20 shadow-xl pointer-events-none whitespace-nowrap">
                  <div className="font-bold text-sm">{city.name}</div>
                  <div className="text-xs text-gray-300">Pop: {(city.pop / 1000000).toFixed(1)}M</div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

export { CITIES };
