import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.heat';
import { generateHeatmapData } from '../utils/mockData';

interface MapContainerProps {
  center: [number, number];
  category: string;
  onAreaClick: (location: { lat: number; lng: number }) => void;
}

export function MapContainer({ center, category, onAreaClick }: MapContainerProps) {
  const mapRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<L.HeatLayer | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView(center, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        detectRetina: true,
      }).addTo(mapRef.current);

      // Click handler for map
      mapRef.current.on('click', (e) => {
        onAreaClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update center
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, 13);
    }
  }, [center]);

  // Update heatmap based on category
  useEffect(() => {
    if (mapRef.current) {
      if (heatLayerRef.current) {
        mapRef.current.removeLayer(heatLayerRef.current);
      }

      const heatmapData = generateHeatmapData(center, category);

      heatLayerRef.current = (L as any).heatLayer(heatmapData, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        max: 1.0,
        gradient: {
          0.0: '#0000ff',
          0.5: '#00ff00',
          0.75: '#ffff00',
          1.0: '#ff0000'
        }
      }).addTo(mapRef.current);
    }
  }, [center, category]);

  return <div id="map" className="w-full h-full" />;
}