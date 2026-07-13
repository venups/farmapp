import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card } from '../common/Card';
import type { Activity } from '@/types';
import 'leaflet/dist/leaflet.css';

interface TripMapProps {
  activities: Activity[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export function TripMap({ activities, center = [20, 0], zoom = 2, height = '400px' }: TripMapProps) {
  const geoActivities = activities.filter((a) => a.latitude != null && a.longitude != null);

  if (geoActivities.length === 0) {
    return (
      <Card style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Add activities with location data to see them on the map</p>
      </Card>
    );
  }

  return (
    <Card style={{ overflow: 'hidden', padding: 0 }}>
      <MapContainer center={center} zoom={zoom} style={{ height, width: '100%', borderRadius: 'var(--radius-lg)' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoActivities.map((activity) => (
          <Marker key={activity.id} position={[activity.latitude!, activity.longitude!]}>
            <Popup>
              <div>
                <strong>{activity.title}</strong>
                <p style={{ fontSize: 12, color: '#666' }}>{activity.location_name || 'No location name'}</p>
                {activity.start_time && <p style={{ fontSize: 12 }}>⏰ {activity.start_time}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Card>
  );
}
