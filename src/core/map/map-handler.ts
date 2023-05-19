import { User } from "firebase/auth";
import { Events } from "../../middleware/event-handler";
import { Asset } from "../../types";
import { MapScene } from "./map-scene";

export const mapHandler = {
  viewer: null as MapScene | null,

  async start(container: HTMLDivElement, user: User, events: Events) {
    if (!this.viewer) {
      this.viewer = new MapScene(container, events);
      await this.viewer.getAllBuildings();
    }
  },

  //Cargamos los datos
  /*async loadData(data: string) {
    if (this.viewer) {
      console.log("MAP-HANDLER LOAD DATA: " + data);
      await this.viewer.updateData(data);

      //data = "cordiales";

      //await console.log("MAPA LOAD DATA: " + data);
      //await this.viewer.getAllAssets(user);
    }
  },*/

  /*scanAsset(user: User) {
    if (this.viewer) {
      console.log("map-handler scan");
      this.viewer.addAsset(user);
    }
  },*/

  gotoAsset(asset: Asset) {
    if (this.viewer) {
      //console.log("map-handler scan");
      this.viewer.gotoAsset(asset);
    }
  },

  remove() {
    if (this.viewer) {
      this.viewer.dispose();
      this.viewer = null;
    }
  },

  async addBuilding(user: User) {
    if (this.viewer) {
      await this.viewer.addBuilding(user);
    }
  },
};
