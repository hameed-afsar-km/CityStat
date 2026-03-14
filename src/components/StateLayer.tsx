import { useMemo, useState } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { getProjectedPoints } from '../utils/geoUtils';

interface StateLayerProps {
  geoData: any;
  selectedState: string | null;
  onStateClick: (stateName: string) => void;
}

const EXTRUDE_SETTINGS = { depth: 1, bevelEnabled: false };

export default function StateLayer({ geoData, selectedState, onStateClick }: StateLayerProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [hoverPos, setHoverPos] = useState<[number, number, number] | null>(null);

  const states = useMemo(() => {
    if (!geoData || !geoData.features) return [];
    
    return geoData.features.map((feature: any) => {
      const name = feature.properties.st_nm || feature.properties.NAME_1;
      const type = feature.geometry.type;
      const coordinates = feature.geometry.coordinates;
      
      let shapes: THREE.Shape[] = [];
      
      if (type === 'Polygon') {
        const projected = getProjectedPoints(coordinates);
        const shape = new THREE.Shape();
        projected[0].forEach((point, i) => {
          if (i === 0) shape.moveTo(point[0], point[1]);
          else shape.lineTo(point[0], point[1]);
        });
        if (projected.length > 1) {
          for (let i = 1; i < projected.length; i++) {
            const hole = new THREE.Path();
            projected[i].forEach((point, j) => {
              if (j === 0) hole.moveTo(point[0], point[1]);
              else hole.lineTo(point[0], point[1]);
            });
            shape.holes.push(hole);
          }
        }
        shapes.push(shape);
      } else if (type === 'MultiPolygon') {
        coordinates.forEach((polygon: any) => {
          const projected = getProjectedPoints(polygon);
          const shape = new THREE.Shape();
          projected[0].forEach((point: any, i: number) => {
            if (i === 0) shape.moveTo(point[0], point[1]);
            else shape.lineTo(point[0], point[1]);
          });
          if (projected.length > 1) {
            for (let i = 1; i < projected.length; i++) {
              const hole = new THREE.Path();
              projected[i].forEach((point: any, j: number) => {
                if (j === 0) hole.moveTo(point[0], point[1]);
                else hole.lineTo(point[0], point[1]);
              });
              shape.holes.push(hole);
            }
          }
          shapes.push(shape);
        });
      }
      
      return { name, shapes };
    });
  }, [geoData]);

  return (
    <group position={[0, 0, 0]}>
      {states.map((state: any) => {
        const isHovered = hoveredState === state.name;
        const isSelected = selectedState === state.name;
        // Selected state is flat (depth 1), unselected hovered state is extruded (depth 4)
        const depth = isHovered && !isSelected ? 4 : 1;
        
        let uniqueColor = '#3b82f6';
        if (state.name) {
          let hash = 0;
          for (let i = 0; i < state.name.length; i++) {
            hash = state.name.charCodeAt(i) + ((hash << 5) - hash);
          }
          const hue = Math.abs(hash % 360);
          uniqueColor = `hsl(${hue}, 80%, 50%)`;
        }
        
        const color = isSelected ? '#ffffff' : isHovered ? uniqueColor : '#222222';
        
        return (
          <group key={state.name} name={state.name}>
            {state.shapes.map((shape: THREE.Shape, idx: number) => (
              <mesh 
                key={`${state.name}-${idx}`}
                onPointerOver={(e) => { e.stopPropagation(); setHoveredState(state.name); setHoverPos([e.point.x, e.point.y, e.point.z]); }}
                onPointerMove={(e) => { e.stopPropagation(); setHoverPos([e.point.x, e.point.y, e.point.z]); }}
                onPointerOut={(e) => { e.stopPropagation(); setHoveredState(null); setHoverPos(null); }}
                onClick={(e) => { e.stopPropagation(); onStateClick(state.name); }}
                position={[0, 0, depth / 2]}
                scale={[1, 1, depth]}
              >
                <extrudeGeometry args={[shape, EXTRUDE_SETTINGS]} />
                <meshStandardMaterial color={color} roughness={0.7} metalness={0.3} side={THREE.DoubleSide} />
              </mesh>
            ))}
            
            {isHovered && hoverPos && (
              <Html position={hoverPos} center style={{ pointerEvents: 'none' }}>
                <div className="bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-lg border border-white/20 shadow-xl whitespace-nowrap">
                  <span className="font-bold text-sm">{state.name}</span>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}
