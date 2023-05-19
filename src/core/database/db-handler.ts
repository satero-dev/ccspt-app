import { getApp } from "firebase/app";
import { getAuth, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import { Events } from "../../middleware/event-handler";
import { Building, Model } from "../../types";
import { getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";
import { buildingHandler } from "../building/building-handler";
import { Action } from "../../middleware/actions";

export const databaseHandler = {
  login: () => {
    const auth = getAuth();
    //let user = action.payload.user;
    //let pass = action.payload.pass;

    //Defino un usuario y un password por defecto, cambiar al final
    let user = "satero@tauli.cat";
    let pass = "T0t0r0!!";

    signInWithEmailAndPassword(auth, user, pass)
      .then((userCredential) => {
        // Signed in
        //const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        console.log("Error");
        const errorCode = error.code;
        const errorMessage = error.message;
      });
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

  updateBuilding: async (building: Building) => {

    const dbInstance = getFirestore(getApp());
    console.log("CARGANDO BUILDINGS 3: " + building.uid);
    await updateDoc(doc(dbInstance, "buildings", building.uid), {
      ...building,
    });

  },

  uploadModel: async (
    model: Model,
    file: File,
    building: Building,
    events: Events
  ) => {
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
