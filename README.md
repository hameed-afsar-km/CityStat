# 🗺️ CityStat | 3D Geo-Intelligence Dashboard 🏙️

![CityStat Banner](https://img.shields.io/badge/CityStat-Geo_Intelligence-00C1D4?style=for-the-badge&logo=google-maps&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.dot.js&logoColor=white)
![GeoJSON](https://img.shields.io/badge/GeoJSON-FFD600?style=for-the-badge&logo=json&logoColor=black)

**CityStat** (CityPulse) is a high-performance 3D spatial visualization tool that extrudes geographic boundaries into interactive data-scrapers. It allows urban planners and developers to visualize state and city-level metrics in a tactile, cinematic environment.

---

## 💎 Features

- **🧱 Dynamic Map Extrusion**: Real-time extrusion of GeoJSON polygons into 3D meshes with custom depth.
- **📍 Smart City Markers**: Interactive pins that surface population, literacy, and area data.
- **🔍 State Drill-Down**: Bounds-fitting camera logic that focuses precisely on the selected region.
- **📈 Intelligence Dashboard**: Side-panel housing real-time metrics and growth charts.
- **🏢 Leaderboard**: Competitive ranking of cities based on urban infrastructure metrics.

---

## 📂 Project Structure

```text
CityStat/
├── src/
│   ├── components/
│   │   ├── Map3D.tsx        # Fiber Canvas & Orbit Controls
│   │   ├── StateLayer.tsx   # Polygon-to-Mesh extrusion logic
│   │   └── CityMarkers.tsx  # Dynamic pin placement
│   ├── pages/
│   │   └── Home.tsx         # Main entry with GeoJSON fetching
│   ├── utils/
│   │   └── geoUtils.ts      # Coordinate projection helpers
│   └── assets/              # Static SVG and Map data
└── tailwind.config.js
```

---

## 🚦 Installation

1. Clone and install:
   ```bash
   npm install
   ```

2. Launch the dashboard:
   ```bash
   npm run dev
   ```

---

## 🛠️ Technical Deep-Dive

- **SVG Path to Shape**: Uses the `getProjectedPoints` utility to transform raw latitude/longitude into Cartesian coordinates for the Three.js `ExtrudeGeometry`.
- **Bounds Animation**: Utilizes the `@react-three/drei` `Bounds` component to compute centering and zoom-fit logic for complex polygons.
- **Mix-Blend Typography**: Employs CSS mix-blend-mode for titles to maintain contrast across dark mesh backgrounds.

---

## 📄 License
MIT © 2026 CityStat Intelligence
