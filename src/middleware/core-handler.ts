import { mapHandler } from "../core/map/map-handler";
import { databaseHandler } from "../core/database/db-handler";
import { Action } from "./actions";
import { Events } from "./event-handler";
import { buildingHandler } from "../core/building/building-handler";
import Scan from "../components/assetManage/tag-scan";
import { UpdateAssetWindow } from "../components/assetManage/update-asset";



export const executeCore = async (action: Action, events: Events) => {
  if (action.type === "LOGIN") {
    return databaseHandler.login(action);
  }
  if (action.type === "LOGOUT") {
    buildingHandler.remove();
    mapHandler.remove();
    return databaseHandler.logout();
  }
  if (action.type === "START_MAP") {
    const { container, user } = action.payload;
    return mapHandler.start(container, user, events);
  }
  if (action.type === "REMOVE_MAP" || action.type === "OPEN_BUILDING") {
    return mapHandler.remove();
  }
  if (action.type === "ADD_BUILDING") {
    return mapHandler.addBuilding(action.payload);
  }
  if (action.type === "ADD_ASSET") {
    return mapHandler.addAsset(action.payload);
  }
  if (action.type === "DELETE_BUILDING") {
    return databaseHandler.deleteBuilding(action.payload, events);
  }
  if (action.type === "UPDATE_BUILDING") {
    return databaseHandler.updateBuilding(action.payload);
  }
  if (action.type === "START_BUILDING") {
    const { container, building } = action.payload;
    return buildingHandler.start(container, building, events);
  }
  if (action.type === "CLOSE_BUILDING") {
    return buildingHandler.remove();
  }
  if (action.type === "UPLOAD_MODEL") {
    const { model, file, building } = action.payload;
    const zipFile = await buildingHandler.convertIfcToFragments(file);
    return databaseHandler.uploadModel(model, zipFile, building, events);
  }
  if (action.type === "DELETE_MODEL") {
    const { model, building } = action.payload;
    return databaseHandler.deleteModel(model, building, events);
  }
  if (action.type === "EXPLODE_MODEL") {
    return buildingHandler.explode(action.payload);
  }
  if (action.type === "TOGGLE_CLIPPER") {
    return buildingHandler.toggleClippingPlanes(action.payload);
  }
  if (action.type === "TOGGLE_DIMENSIONS") {
    return buildingHandler.toggleDimensions(action.payload);
  }
  if (action.type === "TOGGLE_FLOORPLAN") {
    const { active, floorplan } = action.payload;
    return buildingHandler.toggleFloorplan(active, floorplan);
  }

  if (action.type === "UPDATE_ASSET") {
    console.log("ASSET 2");
    return mapHandler.updateAsset(action.payload);
  }

  /*if (action.type === "SCAN_ASSET") {
    return (
      <div>
      < Scan />
      </>
    )
  }*/


  //Cargamos información de edificios
  /*if (action.type === "LOAD_DATA") {
    let { data } = action.payload;
    return mapHandler.loadData(data);

    ////console.log("LOAD DATA SEARCH: " + action.payload);        
  }*/

  //Volamos hasta el asset
  if (action.type === "GOTO_ASSET") {

    return mapHandler.gotoAsset(action.payload);

  }

};
