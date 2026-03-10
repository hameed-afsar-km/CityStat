// Mock AQI service
export async function getAqiData(cityName: string) {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const hash = cityName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  return {
    aqi: 50 + (hash % 250), // 50-300
    history: Array.from({ length: 10 }, (_, i) => 50 + ((hash + i * 10) % 250)) // 10 years trend
  };
}
