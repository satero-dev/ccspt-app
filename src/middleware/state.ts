import { Floorplan, Property, Building, System, Asset } from "./../types";
import { User } from "firebase/auth";
import { } from "../types";

export interface State {
  user: User | null;
  role: String;
  asset: Asset | null;
  building: Building | null;
  floorplans: Floorplan[];
  properties: Property[];
  systems: System[];
  scan: String;
}

export const initialState: State = {
  user: null,
  role: "",
  asset: null,
  building: null,
  floorplans: [],
  properties: [],
  systems: [],
  scan: "",
};
