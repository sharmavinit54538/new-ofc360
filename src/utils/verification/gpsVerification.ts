export interface OfficeBranch {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  address: string;
}

export const OFFICE_BRANCHES: OfficeBranch[] = [
  {
    id: "hq",
    name: "Headquarters (HQ)",
    latitude: 28.6139,
    longitude: 77.2090,
    radiusMeters: 250,
    address: "Equinox Tower, Level 8, Connaught Place, New Delhi",
  },
  {
    id: "tech-hub",
    name: "Tech Innovation Hub",
    latitude: 12.9716,
    longitude: 77.5946,
    radiusMeters: 200,
    address: "Cyber City, Outer Ring Road, Bengaluru",
  },
  {
    id: "regional-west",
    name: "Regional Office - West",
    latitude: 19.0760,
    longitude: 72.8777,
    radiusMeters: 180,
    address: "Bandra Kurla Complex (BKC), Mumbai",
  },
];

/**
 * Calculates great-circle distance between two points using the Haversine formula in meters.
 */
export function calculateHaversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const toRad = (angle: number) => (angle * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export interface GpsLocationResult {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

/**
 * Requests the current GPS coordinates using the browser Geolocation API.
 */
export function getCurrentGpsPosition(): Promise<GpsLocationResult> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy),
          altitude: position.coords.altitude,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        let msg = "Failed to obtain GPS coordinates.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = "Location permission was denied. Please allow location access in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            msg = "Location information is currently unavailable from your device.";
            break;
          case error.TIMEOUT:
            msg = "GPS request timed out. Please try again.";
            break;
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  });
}
