export const ActionList = [
  "LOGIN",
  "LOGOUT",
  "UPDATE_USER",
  "START_MAP",
  "REMOVE_MAP",
  "ADD_BUILDING",
  "OPEN_BUILDING",
  "START_BUILDING",
  "DELETE_BUILDING",
  "CLOSE_BUILDING",
  "UPDATE_BUILDING",
  "UPLOAD_MODEL",
  "DELETE_MODEL",
  "EXPLODE_MODEL",
  "TOGGLE_CLIPPER",
  "TOGGLE_DIMENSIONS",
  "TOGGLE_FLOORPLAN",
  "UPDATE_FLOORPLANS",
  "UPDATE_PROPERTIES",
  "UPDATE_SYSTEMS",
  "LOAD_DATA",
  "GOTO_ASSET",
  "SET_ROLE",
  "OPEN_SCAN",
  "SCAN_ASSET"
] as const;

type ActionListType = typeof ActionList;

export type ActionType = ActionListType[number];

export interface Action {
  type: ActionType;
  payload?: any;
}
