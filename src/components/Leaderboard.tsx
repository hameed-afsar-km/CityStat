import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy } from 'lucide-react';
import { calculateCityHealthScore } from '../utils/cityScore';
import { getWeatherData } from '../services/weatherService';
import { getAqiData } from '../services/aqiService';
import { getTrafficData } from '../services/trafficService';

const STATES = [
  { name: 'Maharashtra', region: 'West India' },
  { name: 'Karnataka', region: 'South India' },
  { name: 'Tamil Nadu', region: 'South India' },
  { name: 'Gujarat', region: 'West India' },
  { name: 'Rajasthan', region: 'North India' },
  { name: 'Sikkim', region: 'North East India' },
];

export default function Leaderboard() {
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadScores() {
      setLoading(true);
      try {
        const results = await Promise.all(
          STATES.map(async (state) => {
            const [weather, aqi, traffic] = await Promise.all([
              getWeatherData(state.name),
              getAqiData(state.name),
              getTrafficData(state.name)
            ]);
            
            const score = calculateCityHealthScore(
              aqi.aqi,
              traffic.congestion,
              weather.temp,
              weather.humidity
            );
            
            return { ...state, score };
          })
        );
        
        results.sort((a, b) => b.score - a.score);
        setScores(results.slice(0, 5));
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
      className="absolute bottom-6 left-6 z-40 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl w-80 pointer-events-auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg shadow-orange-500/20">
          <Trophy className="text-white h-5 w-5" />
        </div>
        <h3 className="text-white font-bold text-lg tracking-tight">Best States Today</h3>
      </div>
      
      <div className="space-y-4">
        {scores.map((state, index) => (
          <div 
            key={state.name} 
            className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <span className={`font-bold text-lg w-6 text-center ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-600' : 'text-gray-500'}`}>
                {index + 1}
              </span>
              <div>
                <div className="text-white font-medium">{state.name}</div>
                <div className="text-xs text-gray-400">{state.region}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 font-bold text-sm border border-blue-500/20">
                {state.score}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
