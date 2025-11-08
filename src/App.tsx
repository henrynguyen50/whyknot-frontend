import { useState } from 'react';
import { MapContainer } from './components/MapContainer';
import { LocationSearch } from './components/LocationSearch';
import { CategoryDropdown } from './components/CategoryDropdown';
import { AreaInsights } from './components/AreaInsights';

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState<[number, number]>([40.7128, -74.0060]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [clickedArea, setClickedArea] = useState<{ lat: number; lng: number } | null>(null);

  return (
    <div className="h-screen w-screen relative">
      {/* Map */}
      <MapContainer
        center={selectedLocation}
        category={selectedCategory}
        onAreaClick={setClickedArea}
      />

      {/* Location Search - Top Left */}
      <div className="absolute top-6 left-6 z-[1000]">
        <LocationSearch
          onLocationSelect={setSelectedLocation}
        />
      </div>

      {/* Category Dropdown - Top Right */}
      <div className="absolute top-6 right-6 z-[1000]">
        <CategoryDropdown
          value={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>

      {/* Area Insights Panel - Slides in when area is clicked */}
      {clickedArea && (
        <AreaInsights
          location={clickedArea}
          category={selectedCategory}
          onClose={() => setClickedArea(null)}
        />
      )}
    </div>
  );
}
