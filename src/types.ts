export interface GisParameters {
  container: HTMLDivElement;
  accessToken: string;
  zoom: number;
  center: [number, number];
  pitch: number;
  bearing: number;
  buildings: Building[];
}

export interface Model {
  name: string;
  id: string;
}

export interface Building {
  /*autoID: string;*/
  name: string;
  uid: string;
  userID: string;
  lat: number;
  lng: number;
  tipo: string;
  models: Model[];  //Un edificio puede tener varios modelos asociados
}

export interface LngLat {
  lng: number;
  lat: number;
}

export interface Tool {
  name: string;
  active: boolean;
  icon: any;
  role?: string
  action: (...args: any) => void;
}

export interface Floorplan {
  name: string;
  id: string;
}

export interface Property {
  name: string;
  value: string;
}

export interface System {
  name: string;
  value: string;
}

//Asset puede ser cualquier tipo de activo
export interface Asset {
  uid: string;
  name: string;
  lat: number;
  lng: number;
  tipo: string;
  level: string;
}

