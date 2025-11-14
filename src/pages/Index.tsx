import { useState } from 'react';
import WeatherMap from '@/components/WeatherMap';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

type Section = 'map' | 'about' | 'settings';

const Index = () => {
  const [currentSection, setCurrentSection] = useState<Section>('map');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Hexagon" size={24} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">HexWeather</h1>
              <p className="text-xs text-muted-foreground">Прогноз на H3-сетке</p>
            </div>
          </div>
          
          <nav className="flex gap-2">
            <Button
              variant={currentSection === 'map' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentSection('map')}
              className="gap-2"
            >
              <Icon name="Map" size={16} />
              Карта
            </Button>
            <Button
              variant={currentSection === 'about' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentSection('about')}
              className="gap-2"
            >
              <Icon name="Info" size={16} />
              О проекте
            </Button>
            <Button
              variant={currentSection === 'settings' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentSection('settings')}
              className="gap-2"
            >
              <Icon name="Settings" size={16} />
              Настройки
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-hidden">
          {currentSection === 'map' && <WeatherMap />}
          {currentSection === 'about' && (
            <div className="flex items-center justify-center h-full p-8">
              <div className="max-w-2xl text-center space-y-4 animate-fade-in">
                <Icon name="Cloud" size={64} className="mx-auto text-primary" />
                <h2 className="text-3xl font-bold">О проекте HexWeather</h2>
                <p className="text-muted-foreground">
                  Используйте боковую панель для получения подробной информации о проекте,
                  технологиях и возможностях системы визуализации погодных данных.
                </p>
              </div>
            </div>
          )}
          {currentSection === 'settings' && (
            <div className="flex items-center justify-center h-full p-8">
              <div className="max-w-2xl text-center space-y-4 animate-fade-in">
                <Icon name="Sliders" size={64} className="mx-auto text-primary" />
                <h2 className="text-3xl font-bold">Настройки отображения</h2>
                <p className="text-muted-foreground">
                  Используйте боковую панель для настройки параметров отображения данных,
                  единиц измерения и разрешения гексагональной сетки H3.
                </p>
              </div>
            </div>
          )}
        </div>
        
        <aside className="border-l border-border animate-slide-in">
          <Sidebar currentSection={currentSection} />
        </aside>
      </main>

      <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>© 2024 HexWeather</span>
            <span className="w-1 h-1 bg-muted-foreground rounded-full" />
            <span>Powered by H3 Grid Technology</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="CloudSun" size={16} />
            <span>Обновлено: {new Date().toLocaleTimeString('ru-RU')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
