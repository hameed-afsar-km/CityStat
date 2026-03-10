// Mock traffic service
export async function getTrafficData(cityName: string) {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const hash = cityName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  return {
    congestion: 20 + (hash % 70), // 20-90%
    history: Array.from({ length: 10 }, (_, i) => 20 + ((hash + i * 5) % 70)) // 10 years trend
  };
}
