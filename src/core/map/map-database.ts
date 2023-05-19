import { getApp } from "firebase/app";
import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { Asset, Building } from "../../types";

export class MapDataBase {
  private readonly buildings = "buildings";
  private readonly assets = "assets";

  async addBuilding(building: Building) {

    console.log("ADD EDIFICIO MAP-DATABASE 1");

    const dbInstance = getFirestore(getApp());
    const { name, tipo, lat, lng, userID, models } = building;
    const result = await addDoc(collection(dbInstance, this.buildings), {
      name,
      tipo,
      lat,
      lng,
      userID,
      models,
    });
    return result.id;
  }

  async getBuildings() {

    const dbInstance = getFirestore(getApp());
    const q = query(
      collection(dbInstance, this.buildings)//,
      //where("userID", "==", user.uid)
    );



    return new Promise<Building[]>((resolve) => {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const result: Building[] = [];

        snapshot.docs.forEach((doc) => {
          result.push({ ...(doc.data() as Building), uid: doc.id });

        });
        unsubscribe();
        resolve(result);
      });
    });


  }

  async addAsset(asset: Asset) {
    const dbInstance = getFirestore(getApp());
    const { tipo, lat, lng, name } = asset;
    const result = await addDoc(collection(dbInstance, this.assets), {
      lat,
      lng,
      name,
      tipo,
    });
    return result.id;
  }

  async getAssets(user: User) {
    const dbInstance = getFirestore(getApp());
    const q = query(
      collection(dbInstance, this.assets)
      //where("userID", "==", user.uid)
    );

    return new Promise<Asset[]>((resolve) => {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const result: Asset[] = [];
        snapshot.docs.forEach((doc) => {
          result.push({ ...(doc.data() as Asset), uid: doc.id });
        });
        unsubscribe();
        resolve(result);
      });
    });
  }
}