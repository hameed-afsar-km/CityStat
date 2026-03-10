import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Wind, Thermometer, Car, Users, Train } from 'lucide-react';
import { getWeatherData } from '../services/weatherService';
import { getAqiData } from '../services/aqiService';
import { getTrafficData } from '../services/trafficService';
import { getCensusData } from '../services/censusService';
import { getCityInsights } from '../services/aiAdvisorService';
import Charts from './Charts';

interface CityDashboardProps {
  cityName: string;
  stateName: string;
  onClose: () => void;
}

export default function CityDashboard({ cityName, stateName, onClose }: CityDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [insights, setInsights] = useState<string>('');
  const [timeIndex, setTimeIndex] = useState(9); // 0 to 9 (2015 to 2024)

  const years = Array.from({ length: 10 }, (_, i) => 2015 + i);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [weather, aqi, traffic, census] = await Promise.all([
          getWeatherData(cityName),
          getAqiData(cityName),
          getTrafficData(cityName),
          getCensusData(cityName)
        ]);
        
        setData({ weather, aqi, traffic, census });
        
        const aiInsights = await getCityInsights(
          cityName,
          aqi.aqi,
          weather.temp,
          traffic.congestion,
          weather.humidity
        );
        setInsights(aiInsights);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [cityName]);

  if (!cityName) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-black/80 backdrop-blur-2xl border-l border-white/10 text-white overflow-y-auto z-50 shadow-2xl"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{cityName}</h2>
              <p className="text-blue-400 font-medium">{stateName}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 animate-pulse">Gathering real-time intelligence...</p>
            </div>
          ) : data ? (
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <MetricCard 
                  icon={<Thermometer className="text-red-400" />} 
                  label="Temperature" 
                  value={`${data.weather.history[timeIndex]}°C`} 
                  sub={`${data.weather.condition}`}
                />
                <MetricCard 
                  icon={<Wind className="text-green-400" />} 
                  label="AQI" 
                  value={data.aqi.history[timeIndex]} 
                  sub={data.aqi.history[timeIndex] < 100 ? 'Good' : 'Unhealthy'}
                />
                <MetricCard 
                  icon={<Car className="text-yellow-400" />} 
                  label="Traffic" 
                  value={`${data.traffic.history[timeIndex]}%`} 
                  sub="Congestion"
                />
                <MetricCard 
                  icon={<Users className="text-blue-400" />} 
                  label="Population" 
                  value={`${(data.census.history[timeIndex] / 1000000).toFixed(1)}M`} 
                  sub="Est."
                />
              </div>

              {/* Time Slider */}
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>2015</span>
                  <span className="text-white font-bold">{years[timeIndex]}</span>
                  <span>2024</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="9" 
                  value={timeIndex} 
                  onChange={(e) => setTimeIndex(parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              {/* Charts */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Historical Trends</h3>
                <Charts 
                  weatherHistory={data.weather.history}
                  aqiHistory={data.aqi.history}
                  trafficHistory={data.traffic.history}
                  years={years}
                />
              </div>

              {/* AI Advisor */}
              <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 p-6 rounded-2xl border border-blue-500/30">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <h3 className="text-xl font-bold text-blue-100">AI City Advisor</h3>
                </div>
                <div className="prose prose-invert prose-sm max-w-none">
                  {insights.split('\n').map((line, i) => (
                    <p key={i} className="mb-2 text-gray-300">{line}</p>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function MetricCard({ icon, label, value, sub }: any) {
  return (
    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-xs text-gray-500 mb-1">{sub}</span>
      </div>
    </div>
  );
}
