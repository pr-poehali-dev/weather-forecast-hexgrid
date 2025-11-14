import { useEffect, useRef, useState } from 'react';
import { latLngToCell, cellToBoundary } from 'h3-js';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface WeatherData {
  h3Index: string;
  temp: number;
  humidity: number;
  pressure: number;
  lat: number;
  lng: number;
}

const WeatherMap = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [selectedCell, setSelectedCell] = useState<WeatherData | null>(null);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [zoom, setZoom] = useState(7);
  const [center, setCenter] = useState({ lat: 55.7558, lng: 37.6173 });

  const getTempColor = (temp: number) => {
    if (temp < -5) return '#3B82F6';
    if (temp < 5) return '#60A5FA';
    if (temp < 15) return '#34D399';
    if (temp < 25) return '#FBBF24';
    return '#EF4444';
  };

  const latLngToPixel = (lat: number, lng: number, mapCenter: { lat: number; lng: number }, zoom: number, width: number, height: number) => {
    const scale = 256 * Math.pow(2, zoom);
    const worldX = (lng + 180) / 360 * scale;
    const worldY = (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * scale;

    const centerWorldX = (mapCenter.lng + 180) / 360 * scale;
    const centerWorldY = (1 - Math.log(Math.tan(mapCenter.lat * Math.PI / 180) + 1 / Math.cos(mapCenter.lat * Math.PI / 180)) / Math.PI) / 2 * scale;

    const x = width / 2 + (worldX - centerWorldX);
    const y = height / 2 + (worldY - centerWorldY);

    return { x, y };
  };

  const pixelToLatLng = (x: number, y: number, mapCenter: { lat: number; lng: number }, zoom: number, width: number, height: number) => {
    const scale = 256 * Math.pow(2, zoom);
    
    const centerWorldX = (mapCenter.lng + 180) / 360 * scale;
    const centerWorldY = (1 - Math.log(Math.tan(mapCenter.lat * Math.PI / 180) + 1 / Math.cos(mapCenter.lat * Math.PI / 180)) / Math.PI) / 2 * scale;

    const worldX = centerWorldX + (x - width / 2);
    const worldY = centerWorldY + (y - height / 2);

    const lng = worldX / scale * 360 - 180;
    const latRad = Math.atan(Math.sinh(Math.PI * (1 - 2 * worldY / scale)));
    const lat = latRad * 180 / Math.PI;

    return { lat, lng };
  };

  useEffect(() => {
    const resolution = 6;
    const data: WeatherData[] = [];
    
    const latRange = 2;
    const lngRange = 3;
    const step = 0.12;

    for (let lat = center.lat - latRange; lat < center.lat + latRange; lat += step) {
      for (let lng = center.lng - lngRange; lng < center.lng + lngRange; lng += step) {
        const h3Index = latLngToCell(lat, lng, resolution);
        
        if (!data.find(d => d.h3Index === h3Index)) {
          const temp = Math.round(Math.random() * 30 - 10);
          const humidity = Math.round(Math.random() * 100);
          const pressure = Math.round(980 + Math.random() * 60);
          
          data.push({
            h3Index,
            temp,
            humidity,
            pressure,
            lat,
            lng,
          });
        }
      }
    }

    setWeatherData(data);
  }, [center, zoom]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    
    ctx.fillStyle = '#1A1F2C';
    ctx.fillRect(0, 0, width, height);

    weatherData.forEach((data) => {
      try {
        const boundary = cellToBoundary(data.h3Index);
        const pixels = boundary.map(([lat, lng]) => 
          latLngToPixel(lat, lng, center, zoom, width, height)
        );

        ctx.beginPath();
        pixels.forEach((pixel, i) => {
          if (i === 0) {
            ctx.moveTo(pixel.x, pixel.y);
          } else {
            ctx.lineTo(pixel.x, pixel.y);
          }
        });
        ctx.closePath();

        const color = getTempColor(data.temp);
        ctx.fillStyle = hoveredCell === data.h3Index ? color : color + 'CC';
        ctx.fill();
        
        ctx.strokeStyle = hoveredCell === data.h3Index ? '#0EA5E9' : 'rgba(255,255,255,0.2)';
        ctx.lineWidth = hoveredCell === data.h3Index ? 2 : 1;
        ctx.stroke();

        const centerPixel = latLngToPixel(data.lat, data.lng, center, zoom, width, height);
        ctx.fillStyle = 'white';
        ctx.font = '12px Roboto';
        ctx.textAlign = 'center';
        ctx.fillText(`${data.temp}°`, centerPixel.x, centerPixel.y + 4);
      } catch (e) {
        console.error('Error rendering hex:', e);
      }
    });
  }, [weatherData, hoveredCell, center, zoom]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const { lat, lng } = pixelToLatLng(x, y, center, zoom, canvas.width, canvas.height);
    const h3Index = latLngToCell(lat, lng, 6);
    
    const cell = weatherData.find(d => d.h3Index === h3Index);
    if (cell) {
      setSelectedCell(cell);
    }
  };

  const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const { lat, lng } = pixelToLatLng(x, y, center, zoom, canvas.width, canvas.height);
    const h3Index = latLngToCell(lat, lng, 6);
    
    const cell = weatherData.find(d => d.h3Index === h3Index);
    setHoveredCell(cell ? cell.h3Index : null);
  };

  return (
    <div className="relative w-full h-full bg-background flex flex-col">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={() => setZoom(z => Math.min(z + 1, 12))}
          className="w-10 h-10 bg-card hover:bg-card/80 rounded-lg flex items-center justify-center border border-border transition-colors"
        >
          <Icon name="Plus" size={20} />
        </button>
        <button
          onClick={() => setZoom(z => Math.max(z - 1, 4))}
          className="w-10 h-10 bg-card hover:bg-card/80 rounded-lg flex items-center justify-center border border-border transition-colors"
        >
          <Icon name="Minus" size={20} />
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={1400}
        height={800}
        className="w-full h-full cursor-pointer"
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMove}
        onMouseLeave={() => setHoveredCell(null)}
      />

      {selectedCell && (
        <Card className="absolute top-4 right-4 p-4 w-72 bg-card/95 backdrop-blur-sm border-border animate-fade-in z-10">
          <h3 className="text-lg font-semibold mb-3 text-primary">Детали ячейки H3</h3>
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
            <div className="flex justify-between text-xs pt-2 border-t border-border">
              <span className="text-muted-foreground">Координаты:</span>
              <span className="font-mono">{selectedCell.lat.toFixed(4)}, {selectedCell.lng.toFixed(4)}</span>
            </div>
            <div className="text-xs">
              <span className="text-muted-foreground">H3 Index:</span>
              <div className="font-mono text-[10px] mt-1 break-all bg-muted p-2 rounded">
                {selectedCell.h3Index}
              </div>
            </div>
          </div>
          <button
            onClick={() => setSelectedCell(null)}
            className="mt-3 w-full py-2 text-xs bg-primary hover:bg-primary/80 rounded transition-colors font-medium"
          >
            Закрыть
          </button>
        </Card>
      )}

      <div className="absolute bottom-4 left-4 z-10">
        <Card className="p-3 bg-card/90 backdrop-blur-sm border-border text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="Info" size={14} />
            <span>Zoom: {zoom} | Центр: {center.lat.toFixed(2)}, {center.lng.toFixed(2)}</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WeatherMap;
