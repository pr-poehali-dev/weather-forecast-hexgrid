import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

interface HexCell {
  id: string;
  x: number;
  y: number;
  temp: number;
  humidity: number;
  pressure: number;
}

const WeatherMap = () => {
  const [cells, setCells] = useState<HexCell[]>([]);
  const [selectedCell, setSelectedCell] = useState<HexCell | null>(null);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  useEffect(() => {
    const hexCells: HexCell[] = [];
    const hexRadius = 40;
    const hexHeight = hexRadius * 2;
    const hexWidth = Math.sqrt(3) * hexRadius;
    const rows = 8;
    const cols = 12;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * hexWidth + (row % 2) * (hexWidth / 2);
        const y = row * hexHeight * 0.75;
        const temp = Math.round(Math.random() * 30 - 10);
        const humidity = Math.round(Math.random() * 100);
        const pressure = Math.round(980 + Math.random() * 60);
        
        hexCells.push({
          id: `hex-${row}-${col}`,
          x,
          y,
          temp,
          humidity,
          pressure,
        });
      }
    }
    setCells(hexCells);
  }, []);

  const getTempColor = (temp: number) => {
    if (temp < -5) return '#3B82F6';
    if (temp < 5) return '#60A5FA';
    if (temp < 15) return '#34D399';
    if (temp < 25) return '#FBBF24';
    return '#EF4444';
  };

  const hexPoints = (x: number, y: number, radius: number) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const px = x + radius * Math.cos(angle);
      const py = y + radius * Math.sin(angle);
      points.push(`${px},${py}`);
    }
    return points.join(' ');
  };

  return (
    <div className="relative w-full h-full overflow-auto bg-background">
      <svg 
        width="1200" 
        height="700" 
        className="w-full h-full"
        style={{ minWidth: '1200px', minHeight: '700px' }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {cells.map((cell) => (
          <polygon
            key={cell.id}
            points={hexPoints(cell.x + 60, cell.y + 60, 38)}
            fill={getTempColor(cell.temp)}
            stroke={hoveredCell === cell.id ? '#0EA5E9' : 'rgba(255,255,255,0.1)'}
            strokeWidth={hoveredCell === cell.id ? '3' : '1'}
            opacity={hoveredCell === cell.id ? 1 : 0.85}
            className="cursor-pointer transition-all duration-200"
            style={{
              filter: hoveredCell === cell.id ? 'url(#glow)' : 'none',
            }}
            onMouseEnter={() => setHoveredCell(cell.id)}
            onMouseLeave={() => setHoveredCell(null)}
            onClick={() => setSelectedCell(cell)}
          />
        ))}
        
        {cells.map((cell) => (
          <text
            key={`text-${cell.id}`}
            x={cell.x + 60}
            y={cell.y + 65}
            textAnchor="middle"
            fill="white"
            fontSize="12"
            fontWeight="500"
            pointerEvents="none"
            className="select-none"
          >
            {cell.temp}°
          </text>
        ))}
      </svg>
      
      {selectedCell && (
        <Card className="absolute top-4 right-4 p-4 w-64 bg-card/95 backdrop-blur-sm border-border animate-fade-in">
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
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID ячейки:</span>
              <span className="font-mono text-xs">{selectedCell.id}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default WeatherMap;
