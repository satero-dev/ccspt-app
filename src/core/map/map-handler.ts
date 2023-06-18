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
      //await this.viewer.getAllAssets();
    }

  },


  addAsset(asset: Asset) {

    if (this.viewer) {
      //console.log("map-handler scan");
      this.viewer.addAsset(asset);
    }
  },

  updateAsset(asset: Asset) {

    if (this.viewer) {
      //console.log("map-handler scan");
      this.viewer.updateAsset(asset);
    }
  },

  gotoAsset(asset: Asset) {
    if (this.viewer) {
      ////console.log("map-handler scan");
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
