import { useState, useEffect } from 'react';
import Map3D from '../components/Map3D';
import SearchBar from '../components/SearchBar';
import CityDashboard from '../components/CityDashboard';
import Leaderboard from '../components/Leaderboard';

export default function Home() {
  const [geoData, setGeoData] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<{ name: string, state: string } | null>(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error("Error loading GeoJSON", err));
  }, []);

  const handleStateClick = (stateName: string) => {
    setSelectedState(stateName);
    setSelectedDistrict(null);
    setSelectedCity(null);
  };

  const handleDistrictClick = (districtName: string) => {
    setSelectedDistrict(districtName);
    setSelectedCity(null);
  };

  const handleCityClick = (cityName: string) => {
    setSelectedCity({ name: cityName, state: selectedState || '' });
  };

  const handleSearchSelect = (cityName: string, stateName: string) => {
    setSelectedState(stateName);
    setSelectedDistrict(null);
    setSelectedCity({ name: cityName, state: stateName });
  };

  const handleBack = () => {
    if (selectedCity) {
      setSelectedCity(null);
    } else if (selectedDistrict) {
      setSelectedDistrict(null);
    } else if (selectedState) {
      setSelectedState(null);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-sans">
      <Map3D
        geoData={geoData}
        selectedState={selectedState}
        selectedDistrict={selectedDistrict}
        onStateClick={handleStateClick}
        onDistrictClick={handleDistrictClick}
        onCityClick={handleCityClick}
      />

      <SearchBar onSelectCity={handleSearchSelect} />

      <Leaderboard />

      {/* Breadcrumb & Back nav */}
      {selectedState && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-2 shadow-xl pointer-events-auto">
          <button
            onClick={() => { setSelectedState(null); setSelectedDistrict(null); setSelectedCity(null); }}
            className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
          >
            India
          </button>
          <span className="text-gray-600">›</span>
          <button
            onClick={() => { setSelectedDistrict(null); setSelectedCity(null); }}
            className={`text-sm font-medium transition-colors ${!selectedDistrict ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
          >
            {selectedState}
          </button>
          {selectedDistrict && (
            <>
              <span className="text-gray-600">›</span>
              <button
                onClick={() => setSelectedCity(null)}
                className={`text-sm font-medium transition-colors ${!selectedCity ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
              >
                {selectedDistrict}
              </button>
            </>
          )}
          {selectedCity && (
            <>
              <span className="text-gray-600">›</span>
              <span className="text-blue-400 text-sm font-medium">{selectedCity.name}</span>
            </>
          )}
          <button
            onClick={handleBack}
            className="ml-2 p-1 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 hover:text-white transition-colors text-xs"
          >
            ← Back
          </button>
        </div>
      )}

      {/* Instruction hint */}
      {!selectedState && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-2.5 pointer-events-none">
          <p className="text-gray-300 text-sm font-medium">
            <span className="text-blue-400">Hover</span> a state to preview · <span className="text-blue-400">Click</span> to drill into districts
          </p>
        </div>
      )}

      {selectedDistrict && !selectedCity && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30" />
      )}

      {selectedCity && (
        <CityDashboard
          cityName={selectedCity.name}
          stateName={selectedCity.state}
          onClose={() => setSelectedCity(null)}
        />
      )}

      {/* Overlay info */}
      <div className="absolute bottom-6 right-6 z-40 text-right pointer-events-none">
        <h1 className="text-4xl font-black text-white tracking-tighter mix-blend-difference">CityStat</h1>
        <p className="text-blue-400 font-medium tracking-widest text-sm uppercase mt-1">Real-Time Intelligence</p>
      </div>
    </div>
  );
}
