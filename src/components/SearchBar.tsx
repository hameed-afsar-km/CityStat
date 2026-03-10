import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { CITIES } from './CityMarkers';

interface SearchBarProps {
  onSelectCity: (cityName: string, stateName: string) => void;
}

export default function SearchBar({ onSelectCity }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof CITIES>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(() => {
      const filtered = CITIES.filter(c => 
        c.name.toLowerCase().includes(query.toLowerCase()) || 
        c.state.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsOpen(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-4 py-4 bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-2xl"
          placeholder="Search cities or states..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
        />
        
        {isOpen && results.length > 0 && (
          <div className="absolute mt-2 w-full bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
            {results.map((city) => (
              <button
                key={city.name}
                className="w-full text-left px-6 py-4 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0 flex justify-between items-center"
                onClick={() => {
                  onSelectCity(city.name, city.state);
                  setQuery('');
                  setIsOpen(false);
                }}
              >
                <span className="text-white font-medium">{city.name}</span>
                <span className="text-gray-400 text-sm">{city.state}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
