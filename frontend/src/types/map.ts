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

export type UserRole = "tracker" | "tracked";
