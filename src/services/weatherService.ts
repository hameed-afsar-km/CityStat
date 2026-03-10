// Mock weather service
export async function getWeatherData(cityName: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Generate realistic mock data based on city name hash
  const hash = cityName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  return {
    temp: 20 + (hash % 15), // 20-35 C
    humidity: 40 + (hash % 40), // 40-80 %
    condition: hash % 3 === 0 ? 'Sunny' : hash % 3 === 1 ? 'Cloudy' : 'Rainy',
    history: Array.from({ length: 10 }, (_, i) => 20 + ((hash + i) % 15)) // 10 years trend
  };
}
