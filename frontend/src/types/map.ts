export interface MapData {
  sessionId: string;
  lat: number;
  lng: number;
  zoom: number;
}

export interface MapMoveData {
  lat: number;
  lng: number;
  zoom: number;
}

export interface HUDProps {
  role: UserRole;
  hud: { lat: number; lng: number; zoom: number };
  connStatus: string;
  trackerPresent: boolean;
  isLocked: boolean;
  onLock: (val: boolean) => void;
}

export interface MapUIProps {
  onMapReady: (map: any) => void;
}

export type UserRole = "tracker" | "tracked";
