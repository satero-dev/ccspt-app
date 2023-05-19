import { Floorplan, Property, Building, System } from "./../types";
import { User } from "firebase/auth";
import { } from "../types";

export interface State {
  user: User | null;
  building: Building | null;
  floorplans: Floorplan[];
  properties: Property[];
  systems: System[];
}

export const initialState: State = {
  user: null,
  building: null,
  floorplans: [],
  properties: [],
  systems: [],
};
