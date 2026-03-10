export function calculateCityHealthScore(
  aqi: number,
  traffic: number,
  temp: number,
  humidity: number
): number {
  // Normalize AQI (0-500) -> 0-100 (lower is better)
  const aqiScore = Math.max(0, 100 - (aqi / 5));
  
  // Normalize Traffic (0-100) -> 0-100 (lower is better)
  const trafficScore = Math.max(0, 100 - traffic);
  
  // Normalize Temp (ideal 22C, range 0-50) -> 0-100
  const tempDiff = Math.abs(22 - temp);
  const tempScore = Math.max(0, 100 - (tempDiff * 3));
  
  // Normalize Humidity (ideal 45%, range 0-100) -> 0-100
  const humDiff = Math.abs(45 - humidity);
  const humScore = Math.max(0, 100 - (humDiff * 1.5));
  
  // Weights
  const score = (
    (aqiScore * 0.4) +
    (trafficScore * 0.3) +
    (tempScore * 0.2) +
    (humScore * 0.1)
  );
  
  return Math.round(score);
}
