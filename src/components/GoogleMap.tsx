"use client";
import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation } from "lucide-react";

interface GoogleMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  label?: string;
  className?: string;
  showNearby?: boolean;
}

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

export function GoogleMap({ lat, lng, zoom = 14, label, className = "", showNearby = false }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [nearby, setNearby] = useState<any[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // If Google Maps is available, initialize
    if (window.google?.maps) {
      initMap();
      return;
    }

    // Check if the script is already loading
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener("load", initMap);
      return;
    }

    // Load Google Maps script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "YOUR_GOOGLE_MAPS_KEY"}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.head.appendChild(script);

    function initMap() {
      if (!mapRef.current || !window.google?.maps) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
          { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
          { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
          { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
          { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
          { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
          { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
          { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
        ],
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });

      // Custom marker
      new window.google.maps.Marker({
        position: { lat, lng },
        map,
        title: label || "Location",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: "#8b5cf6",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
          scale: 10,
        },
      });

      setMapLoaded(true);

      // Search for nearby tourist attractions
      if (showNearby && window.google.maps.places) {
        const service = new window.google.maps.places.PlacesService(map);
        service.nearbySearch(
          {
            location: { lat, lng },
            radius: 5000,
            type: "tourist_attraction",
          },
          (results: any[], status: any) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
              setNearby(results.slice(0, 5));
              // Add markers for nearby places
              results.slice(0, 5).forEach((place: any) => {
                new window.google.maps.Marker({
                  position: place.geometry.location,
                  map,
                  title: place.name,
                  icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    fillColor: "#f59e0b",
                    fillOpacity: 0.9,
                    strokeColor: "#ffffff",
                    strokeWeight: 2,
                    scale: 7,
                  },
                });
              });
            }
          }
        );
      }
    }
  }, [lat, lng, zoom, label, showNearby]);

  return (
    <div className={`rounded-2xl overflow-hidden ${className}`}>
      <div ref={mapRef} className="w-full h-full min-h-[200px]" />

      {/* Fallback if Google Maps doesn't load */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-indigo-50 flex items-center justify-center rounded-2xl">
          <div className="text-center">
            <MapPin size={32} className="text-violet-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm font-medium">{label}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-violet-600 text-xs font-semibold hover:underline mt-2"
            >
              <Navigation size={12} /> Open in Google Maps ↗
            </a>
          </div>
        </div>
      )}

      {/* Nearby places list */}
      {showNearby && nearby.length > 0 && (
        <div className="bg-white border-t border-gray-100 p-4">
          <h4 className="text-sm font-bold text-gray-700 mb-3">Nearby Attractions</h4>
          <div className="space-y-2.5">
            {nearby.map((place: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <MapPin size={14} className="text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{place.name}</p>
                  {place.rating && (
                    <p className="text-xs text-gray-400">⭐ {place.rating} · {place.vicinity?.slice(0, 40)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
