export interface HUDProps {
  role: UserRole;
  hud: { lat: number; lng: number; zoom: number };
  connStatus: string;
  trackerPresent: boolean;
  isLocked: boolean;
  onLock: (val: boolean) => void;
}

export interface MapUIProps {
  onMapReady: (map: unknown) => void;
}

export type MapState = {
  seq: number;
  ts: number;
  center: { lat: number; lng: number };
  zoom: number;
};

export type UserRole = "tracker" | "tracked";
