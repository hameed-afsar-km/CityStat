import { useState, useEffect } from 'react';
import Map3D from '../components/Map3D';
import SearchBar from '../components/SearchBar';
import CityDashboard from '../components/CityDashboard';
import Leaderboard from '../components/Leaderboard';

export default function Home() {
  const [geoData, setGeoData] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<{name: string, state: string} | null>(null);

  useEffect(() => {
    // Fetch India GeoJSON
    fetch('https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error("Error loading GeoJSON", err));
  }, []);

  const handleStateClick = (stateName: string) => {
    setSelectedState(stateName);
    setSelectedCity(null);
  };

  const handleCityClick = (cityName: string) => {
    setSelectedCity({ name: cityName, state: selectedState || '' });
  };

  const handleSearchSelect = (cityName: string, stateName: string) => {
    setSelectedState(stateName);
    setSelectedCity({ name: cityName, state: stateName });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-sans">
      <Map3D 
        geoData={geoData} 
        selectedState={selectedState} 
        onStateClick={handleStateClick}
        onCityClick={handleCityClick}
      />
      
      <SearchBar onSelectCity={handleSearchSelect} />
      
      <Leaderboard />
      
      {selectedCity && (
        <CityDashboard 
          cityName={selectedCity.name} 
          stateName={selectedCity.state} 
          onClose={() => setSelectedCity(null)} 
        />
      )}
      
      {/* Overlay info */}
      <div className="absolute bottom-6 right-6 z-40 text-right pointer-events-none">
        <h1 className="text-4xl font-black text-white tracking-tighter mix-blend-difference">CityPulse</h1>
        <p className="text-blue-400 font-medium tracking-widest text-sm uppercase mt-1">Real-Time Intelligence</p>
      </div>
    </div>
  );
}
