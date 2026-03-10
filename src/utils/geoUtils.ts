import * as d3 from 'd3-geo';

// We use d3-geo to project lat/lng to 3D space
export const projection = d3.geoMercator()
  .center([82.8, 23.5]) // Center of India
  .scale(1200) // Adjust scale to fit the 3D scene
  .translate([0, 0]);

export function getProjectedPoints(coordinates: number[][][]) {
  return coordinates.map(ring => 
    ring.map(coord => {
      const projected = projection([coord[0], coord[1]]);
      // In Three.js, Y is up, so we map projected Y to Z or Y depending on orientation
      // Let's map projected [x, y] to [x, -y] because d3-geo y goes down
      return projected ? [projected[0], -projected[1]] : [0, 0];
    })
  );
}

export function getCityPosition(lat: number, lng: number) {
  const projected = projection([lng, lat]);
  return projected ? [projected[0], -projected[1]] : [0, 0];
}
