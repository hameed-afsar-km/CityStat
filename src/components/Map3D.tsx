import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Bounds, useBounds } from '@react-three/drei';
import StateLayer from './StateLayer';
import DistrictLayer from './DistrictLayer';
import CityMarkers from './CityMarkers';
import { useEffect } from 'react';

interface Map3DProps {
  geoData: any;
  selectedState: string | null;
  selectedDistrict: string | null;
  onStateClick: (stateName: string) => void;
  onDistrictClick: (districtName: string) => void;
  onCityClick: (cityName: string) => void;
}

function ZoomToTarget({
  selectedState,
  selectedDistrict,
  geoData,
}: {
  selectedState: string | null;
  selectedDistrict: string | null;
  geoData: any;
}) {
  const bounds = useBounds();
  const { scene } = useThree();

  useEffect(() => {
    if (!geoData) return;
    setTimeout(() => {
      if (selectedDistrict) {
        const obj = scene.getObjectByName(`district-${selectedDistrict}`);
        if (obj) { bounds.refresh(obj).clip().fit(); return; }
      }
      if (selectedState) {
        const stateGroup = scene.getObjectByName(selectedState);
        if (stateGroup) { bounds.refresh(stateGroup).clip().fit(); return; }
      }
      bounds.refresh().clip().fit();
    }, 120);
  }, [selectedState, selectedDistrict, geoData, bounds, scene]);

  return null;
}

export default function Map3D({
  geoData,
  selectedState,
  selectedDistrict,
  onStateClick,
  onDistrictClick,
  onCityClick,
}: Map3DProps) {
  return (
    <div className="w-full h-full absolute inset-0 bg-black">
      <Canvas camera={{ position: [0, 0, 150], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <Environment preset="city" />

        <Bounds fit clip margin={1.2}>
          <ZoomToTarget selectedState={selectedState} selectedDistrict={selectedDistrict} geoData={geoData} />

          {/* Always render state layer */}
          {geoData && (
            <StateLayer
              geoData={geoData}
              selectedState={selectedState}
              onStateClick={onStateClick}
            />
          )}

          {/* When a state is selected but no district yet, show districts */}
          {selectedState && !selectedDistrict && (
            <DistrictLayer
              selectedState={selectedState}
              selectedDistrict={selectedDistrict}
              onDistrictClick={onDistrictClick}
            />
          )}

          {/* Once a district is selected, show city markers for that district's state */}
          {selectedState && selectedDistrict && (
            <CityMarkers
              selectedState={selectedState}
              selectedDistrict={selectedDistrict}
              onCityClick={onCityClick}
            />
          )}
        </Bounds>

        <OrbitControls
          enableRotate={true}
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
