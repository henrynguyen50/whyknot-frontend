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
  const heatLayerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) {
      // United States bounds only 
      const usSouthWest = L.latLng(24.396308, -124.848974); // lat, lng
      const usNorthEast = L.latLng(49.384358, -66.885444);
      const usBounds = L.latLngBounds(usSouthWest, usNorthEast);

      mapRef.current = L.map('map', {
        center,
        zoom: 13,
        minZoom: 3,
        maxZoom: 19,
        maxBounds: usBounds,
        // Prevent the user from panning far outside the bounds
        maxBoundsViscosity: 0.9,
      });

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
          0.0: '#ffffffff',
          0.5: '#8d3434ff',
          0.75: '#e11b1bff',
          1.0: '#ff0000'
        }
      }).addTo(mapRef.current);
    }
  }, [center, category]);

  return <div id="map" className="w-full h-full" />;
}