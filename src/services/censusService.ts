// Mock census service
export async function getCensusData(cityName: string) {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const hash = cityName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const basePop = 500000 + (hash * 10000);
  
  return {
    population: basePop,
    publicTransport: 30 + (hash % 60), // 30-90% coverage
    history: Array.from({ length: 10 }, (_, i) => Math.round(basePop * Math.pow(1.02, i))) // 2% growth per year
  };
}
