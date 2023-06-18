import { getApp } from "firebase/app";
import { getAuth, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import { Events } from "../../middleware/event-handler";
import { Building, Model, Asset } from "../../types";
import { getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";
import { buildingHandler } from "../building/building-handler";
import { Action } from "../../middleware/actions";

export const databaseHandler = {

  login: (action: Action) => {

    const auth = getAuth();

    if (action.payload) {

      let user = action.payload.user;
      let pass = action.payload.pass;

      console.log("USER: " + user);

      //Defino un usuario y un password por defecto, cambiar al final
      /*if (user == "") user = "invitado@uoc.edu";
      if (pass == "") pass = "undostrescuatro";*/

      signInWithEmailAndPassword(auth, user, pass)
        .then((userCredential) => {

          // Signed in
          //const user = userCredential.user;
          // ...
        })
        .catch((error) => {
          //console.log("Error");
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    }
    //const provider = new GoogleAuthProvider();
    //signInWithPopup(auth, provider);
  },

  logout: () => {
    const auth = getAuth();
    signOut(auth);
  },

  deleteBuilding: async (building: Building, events: Events) => {
    const id = building.uid;
    const dbInstance = getFirestore(getApp());
    await deleteDoc(doc(dbInstance, "buildings", id));
    const appInstance = getApp();
    const storageInstance = getStorage(appInstance);
    const ids: string[] = [];
    for (const model of building.models) {
      ids.push(model.id);
      const fileRef = ref(storageInstance, model.id);
      await deleteObject(fileRef);
    }
    await buildingHandler.deleteModels(ids);
    events.trigger({ type: "CLOSE_BUILDING" });
  },

  updateAsset: async (asset: Asset) => {

    console.log("ASSET 3: " + asset.uid);

    let longitud = 0;
    let latitud = 0;

    navigator.geolocation.getCurrentPosition(position => {

      asset.lng = position.coords.longitude;
      asset.lat = position.coords.latitude;
      asset.level = "PT2";

    });

    console.log("position.coords.longitude: " + asset.lng);
    asset.level = "PT2";
    const dbInstance = getFirestore(getApp());
    //console.log("CARGANDO BUILDINGS 3: " + building.uid);
    await updateDoc(doc(dbInstance, "assets", asset.uid), {
      ...asset,
    });

  },

  updateBuilding: async (building: Building) => {

    const dbInstance = getFirestore(getApp());
    //console.log("CARGANDO BUILDINGS 3: " + building.uid);
    await updateDoc(doc(dbInstance, "buildings", building.uid), {
      ...building,
    });

  },

  uploadModel: async (model: Model, file: File, building: Building, events: Events) => {
    const appInstance = getApp();
    const storageInstance = getStorage(appInstance);
    const fileRef = ref(storageInstance, model.id);
    await uploadBytes(fileRef, file);
    await buildingHandler.refreshModels(building, events);

    events.trigger({ type: "UPDATE_BUILDING", payload: building });
  },

  deleteModel: async (model: Model, building: Building, events: Events) => {
    const appInstance = getApp();
    const storageInstance = getStorage(appInstance);
    const fileRef = ref(storageInstance, model.id);
    await deleteObject(fileRef);
    await buildingHandler.deleteModels([model.id]);
    await buildingHandler.refreshModels(building, events);
    events.trigger({ type: "UPDATE_BUILDING", payload: building });
  },
};
