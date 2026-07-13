import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
interface Activity {
  id: string;
  title: string;
  category: string;
  start_time?: string | null;
  end_time?: string | null;
  location_name?: string | null;
  address?: string | null;
  latitude: number | null;
  longitude: number | null;
}

const mapIcon = new Icon({
  iconUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="%236366F1" stroke="white" stroke-width="2"%3E%3Cpath d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"%3E%3C/path%3E%3Ccircle cx="12" cy="10" r="3"%3E%3C/circle%3E%3C/svg%3E',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

interface TripMapProps {
  activities: Activity[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export default function TripMap({
  activities,
  center = [0, 0],
  zoom = 2,
  height = '500px',
}: TripMapProps) {
  const activitiesWithCoordinates = activities.filter(
    (a) => a.latitude !== null && a.longitude !== null
  );

  if (activitiesWithCoordinates.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-800 rounded-xl border border-slate-700">
        <div className="text-center">
          <p className="text-slate-400 mb-2">No coordinates available</p>
          <p className="text-sm text-slate-500">Activities need location data</p>
        </div>
      </div>
    );
  }

  const formatDate = (timeString: string | null) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Calculate bounds from activities
  const getBounds = () => {
    if (activitiesWithCoordinates.length === 0) return null;
    
    const latitudes = activitiesWithCoordinates.map((a) => a.latitude!).filter(Boolean);
    const longitudes = activitiesWithCoordinates.map((a) => a.longitude!).filter(Boolean);

    if (latitudes.length === 0 || longitudes.length === 0) return null;

    const southWest = [Math.min(...latitudes), Math.min(...longitudes)];
    const northEast = [Math.max(...latitudes), Math.max(...longitudes)];

    return [southWest, northEast] as const;
  };

  const bounds = getBounds();

  return (
    <div className="relative rounded-xl overflow-hidden" style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {activitiesWithCoordinates.map((activity) => (
          <Marker
            key={activity.id}
            position={[activity.latitude!, activity.longitude!]}
            icon={mapIcon}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h4 className="font-semibold text-slate-900 mb-1">{activity.title}</h4>
                <div className="text-sm text-slate-700 mb-2">
                  {activity.category && <p>Category: {activity.category}</p>}
                  {(activity.start_time || activity.end_time) && (
                    <p>
                      Time: {formatDate(activity.start_time)} - {formatDate(activity.end_time)}
                    </p>
                  )}
                  {activity.location_name && <p>Location: {activity.location_name}</p>}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {bounds && (
          <div
            style={{ display: 'none' }}
          />
        )}
      </MapContainer>
    </div>
  );
}
