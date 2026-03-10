import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, ArrowUp, ArrowDown, Activity } from 'lucide-react';
import { CITIES } from './CityMarkers';
import { calculateCityHealthScore } from '../utils/cityScore';
import { getWeatherData } from '../services/weatherService';
import { getAqiData } from '../services/aqiService';
import { getTrafficData } from '../services/trafficService';

export default function Leaderboard() {
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadScores() {
      setLoading(true);
      try {
        const results = await Promise.all(
          CITIES.slice(0, 5).map(async (city) => {
            const [weather, aqi, traffic] = await Promise.all([
              getWeatherData(city.name),
              getAqiData(city.name),
              getTrafficData(city.name)
            ]);
            
            const score = calculateCityHealthScore(
              aqi.aqi,
              traffic.congestion,
              weather.temp,
              weather.humidity
            );
            
            return { ...city, score };
          })
        );
        
        results.sort((a, b) => b.score - a.score);
        setScores(results);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    
    loadScores();
  }, []);

  if (loading) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-6 left-6 z-40 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl w-80"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg shadow-orange-500/20">
          <Trophy className="text-white h-5 w-5" />
        </div>
        <h3 className="text-white font-bold text-lg tracking-tight">Best Cities Today</h3>
      </div>
      
      <div className="space-y-4">
        {scores.map((city, index) => (
          <div 
            key={city.name} 
            className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <span className={`font-bold text-lg w-6 text-center ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-600' : 'text-gray-500'}`}>
                {index + 1}
              </span>
              <div>
                <div className="text-white font-medium">{city.name}</div>
                <div className="text-xs text-gray-400">{city.state}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 font-bold text-sm border border-blue-500/20">
                {city.score}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
