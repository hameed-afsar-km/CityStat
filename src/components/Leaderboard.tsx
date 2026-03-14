import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';
import { calculateCityHealthScore } from '../utils/cityScore';
import { getWeatherData } from '../services/weatherService';
import { getAqiData } from '../services/aqiService';
import { getTrafficData } from '../services/trafficService';
import { CITIES_DATA } from '../data/citiesData';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

export default function Leaderboard() {
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCityDetail, setSelectedCityDetail] = useState<any>(null);

  useEffect(() => {
    async function loadScores() {
      setLoading(true);
      try {
        // Pick 8 random cities to score to save fake API calls
        const shuffled = [...CITIES_DATA].sort(() => 0.5 - Math.random());
        const selectedCities = shuffled.slice(0, 8);
        
        const results = await Promise.all(
          selectedCities.map(async (city) => {
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
            
            return {
              ...city,
              score,
              details: { weather, aqi, traffic }
            };
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
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-6 left-6 z-40 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl w-80 pointer-events-auto"
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
              onClick={() => setSelectedCityDetail(city)}
              className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group cursor-pointer"
            >
              <div className="flex items-center gap-4 truncate">
                <span className={`font-bold text-lg w-6 text-center ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-600' : 'text-gray-500'}`}>
                  {index + 1}
                </span>
                <div className="truncate">
                  <div className="text-white font-medium truncate">{city.name}</div>
                  <div className="text-xs text-gray-400 truncate">{city.state}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 pl-2">
                <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 font-bold text-sm border border-blue-500/20">
                  {city.score}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedCityDetail && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 shadow-2xl w-96 max-w-[90vw] pointer-events-auto"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white font-black text-2xl tracking-tighter">{selectedCityDetail.name}</h3>
                <p className="text-blue-400 text-sm font-medium tracking-wide uppercase">{selectedCityDetail.state} - Score: {selectedCityDetail.score}</p>
              </div>
              <button 
                onClick={() => setSelectedCityDetail(null)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6">
              <Radar 
                data={{
                  labels: ['Air Quality (Inv)', 'Traffic Flow (Inv)', 'Temperature Rank', 'Humidity Rank', 'Green Index (Est)'],
                  datasets: [{
                    label: 'City Performance Metrics',
                    data: [
                      100 - (selectedCityDetail.details.aqi.aqi / 3), // mock normalizer
                      100 - selectedCityDetail.details.traffic.congestion,
                      selectedCityDetail.details.weather.temp > 25 ? 80 : 60,
                      selectedCityDetail.details.weather.humidity > 50 ? 70 : 90,
                      selectedCityDetail.score
                    ],
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(59, 130, 246, 1)'
                  }]
                }}
                options={{
                  scales: {
                    r: {
                      angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                      grid: { color: 'rgba(255, 255, 255, 0.1)' },
                      pointLabels: { color: 'rgba(255, 255, 255, 0.7)', font: { size: 10 } },
                      ticks: { display: false }
                    }
                  },
                  plugins: {
                    legend: { display: false }
                  }
                }}
              />
            </div>
            
            <p className="mt-4 text-xs text-center text-gray-400 leading-relaxed font-medium px-4">
              This chart shows why {selectedCityDetail.name} reached a health score of <span className="text-white font-bold">{selectedCityDetail.score}</span>, analyzing live factors including air quality limitations and traffic congestion indices.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
