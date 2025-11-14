import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface SidebarProps {
  currentSection: 'map' | 'about' | 'settings';
}

const Sidebar = ({ currentSection }: SidebarProps) => {
  const tempGradient = [
    { temp: '-10°C', color: '#3B82F6' },
    { temp: '0°C', color: '#60A5FA' },
    { temp: '10°C', color: '#34D399' },
    { temp: '20°C', color: '#FBBF24' },
    { temp: '30°C', color: '#EF4444' },
  ];

  if (currentSection === 'about') {
    return (
      <Card className="w-80 h-full bg-card border-border p-6 overflow-auto">
        <h2 className="text-2xl font-bold mb-4 text-primary">О проекте</h2>
        <div className="space-y-4 text-sm text-foreground">
          <p>
            <strong>HexWeather</strong> — современная система визуализации погодных данных
            на основе гексагональной сетки H3.
          </p>
          <p>
            Технология H3 разработана компанией Uber для эффективного геопространственного
            индексирования и позволяет точно отображать погодные условия в любой точке мира.
          </p>
          <div className="pt-4">
            <h3 className="font-semibold mb-2 text-accent">Возможности:</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Icon name="Check" size={16} className="mt-0.5 text-primary" />
                <span>Точная визуализация температуры</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={16} className="mt-0.5 text-primary" />
                <span>Интерактивная карта с детализацией</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={16} className="mt-0.5 text-primary" />
                <span>Данные о влажности и давлении</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={16} className="mt-0.5 text-primary" />
                <span>Гексагональная сетка H3</span>
              </li>
            </ul>
          </div>
          <div className="pt-4">
            <h3 className="font-semibold mb-2 text-accent">Технологии:</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-muted rounded-full text-xs">React</span>
              <span className="px-3 py-1 bg-muted rounded-full text-xs">TypeScript</span>
              <span className="px-3 py-1 bg-muted rounded-full text-xs">H3 Grid</span>
              <span className="px-3 py-1 bg-muted rounded-full text-xs">SVG</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (currentSection === 'settings') {
    return (
      <Card className="w-80 h-full bg-card border-border p-6 overflow-auto">
        <h2 className="text-2xl font-bold mb-4 text-primary">Настройки</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3 text-accent">Отображение данных</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Показывать температуру</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Показывать границы ячеек</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Показывать ID ячеек</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-accent">Единицы измерения</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="temp" defaultChecked />
                <span className="text-sm">Цельсий (°C)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="temp" />
                <span className="text-sm">Фаренгейт (°F)</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-accent">Разрешение сетки H3</h3>
            <select className="w-full p-2 bg-muted rounded border border-border text-sm">
              <option>Уровень 4 (крупная)</option>
              <option selected>Уровень 5 (средняя)</option>
              <option>Уровень 6 (детальная)</option>
              <option>Уровень 7 (очень детальная)</option>
            </select>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-accent">Обновление данных</h3>
            <select className="w-full p-2 bg-muted rounded border border-border text-sm">
              <option>Каждую минуту</option>
              <option selected>Каждые 5 минут</option>
              <option>Каждые 15 минут</option>
              <option>Вручную</option>
            </select>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-80 h-full bg-card border-border p-6 overflow-auto">
      <h2 className="text-2xl font-bold mb-4 text-primary">Легенда</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-3 text-accent">Температура</h3>
          <div className="space-y-2">
            {tempGradient.map((item) => (
              <div key={item.temp} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-md border border-border"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">{item.temp}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="font-semibold mb-3 text-accent">Статистика</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Всего ячеек:</span>
              <span className="font-medium">96</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Макс. температура:</span>
              <span className="font-medium text-red-400">+28°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Мин. температура:</span>
              <span className="font-medium text-blue-400">-8°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Среднее:</span>
              <span className="font-medium">+12°C</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="font-semibold mb-2 text-accent">Управление</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Наведите на ячейку для подсветки</p>
            <p>• Нажмите для деталей</p>
            <p>• Прокрутите для масштабирования</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Sidebar;
