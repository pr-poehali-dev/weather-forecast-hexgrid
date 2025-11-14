import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { latLngToCell, cellToBoundary } from 'h3-js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';

interface WeatherData {
  h3Index: string;
  temp: number;
  humidity: number;
  pressure: number;
}

interface SelectedCell extends WeatherData {
  lat: number;
  lng: number;
}

const H3Layer = () => {
  const map = useMap();
  const [hexagons, setHexagons] = useState<L.Polygon[]>([]);
  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);

  const getTempColor = (temp: number) => {
    if (temp < -5) return '#3B82F6';
    if (temp < 5) return '#60A5FA';
    if (temp < 15) return '#34D399';
    if (temp < 25) return '#FBBF24';
    return '#EF4444';
  };

  useEffect(() => {
    const bounds = map.getBounds();
    const center = bounds.getCenter();
    const weatherData: WeatherData[] = [];
    
    const resolution = 6;
    
    const latStep = 0.15;
    const lngStep = 0.15;
    for (let lat = center.lat - 1; lat < center.lat + 1; lat += latStep) {
      for (let lng = center.lng - 1.5; lng < center.lng + 1.5; lng += lngStep) {
        const h3Index = latLngToCell(lat, lng, resolution);
        const temp = Math.round(Math.random() * 30 - 10);
        const humidity = Math.round(Math.random() * 100);
        const pressure = Math.round(980 + Math.random() * 60);
        
        weatherData.push({ h3Index, temp, humidity, pressure });
      }
    }

    const hexLayers: L.Polygon[] = [];
    
    weatherData.forEach((data) => {
      try {
        const boundary = cellToBoundary(data.h3Index);
        const latLngs: [number, number][] = boundary.map(coord => [coord[0], coord[1]]);
        
        const polygon = L.polygon(latLngs, {
          color: getTempColor(data.temp),
          fillColor: getTempColor(data.temp),
          fillOpacity: 0.6,
          weight: 1,
          opacity: 0.8,
        });

        polygon.on('mouseover', function(this: L.Polygon) {
          this.setStyle({
            fillOpacity: 0.9,
            weight: 3,
          });
        });

        polygon.on('mouseout', function(this: L.Polygon) {
          this.setStyle({
            fillOpacity: 0.6,
            weight: 1,
          });
        });

        polygon.on('click', () => {
          const center = polygon.getBounds().getCenter();
          setSelectedCell({
            ...data,
            lat: center.lat,
            lng: center.lng,
          });
        });

        polygon.addTo(map);
        hexLayers.push(polygon);
      } catch (e) {
        console.error('Error rendering hexagon:', e);
      }
    });

    setHexagons(hexLayers);

    return () => {
      hexLayers.forEach(hex => hex.remove());
    };
  }, [map]);

  return (
    <>
      {selectedCell && (
        <div className="absolute top-4 right-4 z-[1000]">
          <Card className="p-4 w-72 bg-card/95 backdrop-blur-sm border-border animate-fade-in">
            <h3 className="text-lg font-semibold mb-3 text-primary">Детали ячейки</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Температура:</span>
                <span className="font-medium">{selectedCell.temp}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Влажность:</span>
                <span className="font-medium">{selectedCell.humidity}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Давление:</span>
                <span className="font-medium">{selectedCell.pressure} гПа</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Координаты:</span>
                <span className="font-mono">{selectedCell.lat.toFixed(4)}, {selectedCell.lng.toFixed(4)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">H3 Index:</span>
                <span className="font-mono text-[10px]">{selectedCell.h3Index.slice(0, 12)}...</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedCell(null)}
              className="mt-3 w-full py-1 text-xs bg-muted hover:bg-muted/80 rounded transition-colors"
            >
              Закрыть
            </button>
          </Card>
        </div>
      )}
    </>
  );
};

const WeatherMap = () => {
  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[55.7558, 37.6173]}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <H3Layer />
      </MapContainer>
    </div>
  );
};

export default WeatherMap;
