import { useMemo, useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { getProjectedPoints } from '../utils/geoUtils';

interface DistrictLayerProps {
  selectedState: string;
  selectedDistrict: string | null;
  onDistrictClick: (districtName: string) => void;
}

const EXTRUDE_SETTINGS = { depth: 1, bevelEnabled: false };

// Generate a unique hue from a string (deterministic)
function hashColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 75%, 55%)`;
}

export default function DistrictLayer({ selectedState, selectedDistrict, onDistrictClick }: DistrictLayerProps) {
  const [districtGeo, setDistrictGeo] = useState<any>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [hoverPos, setHoverPos] = useState<[number, number, number] | null>(null);

  useEffect(() => {
    fetch('/india_district.geojson')
      .then(r => r.json())
      .then(data => setDistrictGeo(data));
  }, []);

  const districts = useMemo(() => {
    if (!districtGeo?.features) return [];

    const stateFeatures = districtGeo.features.filter((f: any) => {
      const n1 = f.properties.NAME_1 || '';
      return n1.toLowerCase().trim() === selectedState.toLowerCase().trim();
    });

    return stateFeatures.map((feature: any) => {
      const name = feature.properties.NAME_2 || 'Unknown';
      const type = feature.geometry.type;
      const coordinates = feature.geometry.coordinates;

      let shapes: THREE.Shape[] = [];

      const buildShape = (polygon: any) => {
        const projected = getProjectedPoints(polygon);
        const shape = new THREE.Shape();
        projected[0].forEach((point: any, i: number) => {
          if (i === 0) shape.moveTo(point[0], point[1]);
          else shape.lineTo(point[0], point[1]);
        });
        for (let i = 1; i < projected.length; i++) {
          const hole = new THREE.Path();
          projected[i].forEach((point: any, j: number) => {
            if (j === 0) hole.moveTo(point[0], point[1]);
            else hole.lineTo(point[0], point[1]);
          });
          shape.holes.push(hole);
        }
        return shape;
      };

      if (type === 'Polygon') {
        shapes.push(buildShape(coordinates));
      } else if (type === 'MultiPolygon') {
        coordinates.forEach((polygon: any) => shapes.push(buildShape(polygon)));
      }

      return { name, shapes };
    });
  }, [districtGeo, selectedState]);

  if (!districts.length) return null;

  return (
    <group position={[0, 0, 0]}>
      {districts.map((district: any) => {
        const isHovered = hoveredDistrict === district.name;
        const isSelected = selectedDistrict === district.name;
        const depth = isHovered && !isSelected ? 4 : 1.2;
        const uniqueColor = hashColor(district.name);
        const color = isSelected ? '#ffffff' : isHovered ? uniqueColor : '#1a1a2e';

        return (
          <group key={district.name} name={`district-${district.name}`}>
            {district.shapes.map((shape: THREE.Shape, idx: number) => (
              <mesh
                key={`${district.name}-${idx}`}
                onPointerOver={(e) => { e.stopPropagation(); setHoveredDistrict(district.name); setHoverPos([e.point.x, e.point.y, e.point.z]); }}
                onPointerMove={(e) => { e.stopPropagation(); setHoverPos([e.point.x, e.point.y, e.point.z]); }}
                onPointerOut={(e) => { e.stopPropagation(); setHoveredDistrict(null); setHoverPos(null); }}
                onClick={(e) => { e.stopPropagation(); onDistrictClick(district.name); }}
                position={[0, 0, depth / 2]}
                scale={[1, 1, depth]}
              >
                <extrudeGeometry args={[shape, EXTRUDE_SETTINGS]} />
                <meshStandardMaterial
                  color={color}
                  roughness={0.6}
                  metalness={0.3}
                  side={THREE.DoubleSide}
                  emissive={isHovered ? uniqueColor : '#000000'}
                  emissiveIntensity={isHovered ? 0.25 : 0}
                />
              </mesh>
            ))}

            {isHovered && hoverPos && (
              <Html position={hoverPos} center style={{ pointerEvents: 'none' }}>
                <div style={{
                  background: 'rgba(0,0,0,0.85)',
                  backdropFilter: 'blur(12px)',
                  color: '#fff',
                  padding: '6px 14px',
                  borderRadius: '10px',
                  border: `1px solid ${uniqueColor}60`,
                  boxShadow: `0 0 20px ${uniqueColor}40`,
                  whiteSpace: 'nowrap',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  fontWeight: '700',
                  letterSpacing: '0.03em'
                }}>
                  <span style={{ color: uniqueColor }}>⬡</span> {district.name} District
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}
