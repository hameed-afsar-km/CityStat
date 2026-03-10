import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Bounds } from '@react-three/drei';
import StateLayer from './StateLayer';
import CityMarkers from './CityMarkers';
import { useEffect } from 'react';
import { useBounds } from '@react-three/drei';
import * as THREE from 'three';

interface Map3DProps {
  geoData: any;
  selectedState: string | null;
  onStateClick: (stateName: string) => void;
  onCityClick: (cityName: string) => void;
}

function ZoomToState({ selectedState, geoData }: { selectedState: string | null, geoData: any }) {
  const bounds = useBounds();
  const { scene } = useThree();
  
  useEffect(() => {
    if (!geoData) return;

    setTimeout(() => {
      if (selectedState) {
        // Find the group with the selected state's name
        const stateGroup = scene.getObjectByName(selectedState);
        if (stateGroup) {
          bounds.refresh(stateGroup).clip().fit();
        } else {
          bounds.refresh().clip().fit();
        }
      } else {
        // Reset view to fit all
        bounds.refresh().clip().fit();
      }
    }, 100);
  }, [selectedState, geoData, bounds, scene]);

  return null;
}

export default function Map3D({ geoData, selectedState, onStateClick, onCityClick }: Map3DProps) {
  return (
    <div className="w-full h-full absolute inset-0 bg-black">
      <Canvas camera={{ position: [0, 0, 150], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <Environment preset="city" />
        
        <Bounds fit clip margin={1.2}>
          <ZoomToState selectedState={selectedState} geoData={geoData} />
          {geoData && (
            <StateLayer 
              geoData={geoData} 
              selectedState={selectedState} 
              onStateClick={onStateClick} 
            />
          )}
          
          {selectedState && (
            <CityMarkers 
              selectedState={selectedState} 
              onCityClick={onCityClick} 
            />
          )}
        </Bounds>
        
        <OrbitControls 
          enableRotate={false} 
          enablePan={true} 
          enableZoom={true} 
          minDistance={10} 
          maxDistance={2000} 
          makeDefault
        />
      </Canvas>
    </div>
  );
}
