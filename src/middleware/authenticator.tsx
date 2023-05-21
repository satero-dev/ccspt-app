import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, FC } from "react";
import { useAppContext } from "./context-provider";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getApp } from "firebase/app";

let authInitialized = false;

export const Authenticator: FC = () => {
  const auth = getAuth();
  const dispatch = useAppContext()[1];

  const listenToAuthChanges = () => {

    async function getRol(uid: any) {

      const dbInstance = getFirestore(getApp());
      const docuRef = doc(dbInstance, `users/${uid}`);
      const docuCifrada = await getDoc(docuRef);
      const infoFinal = docuCifrada.data()?.role;

      return infoFinal;

    }

    onAuthStateChanged(auth, (foundUser) => {
      let user = foundUser ? { ...foundUser } : null;

      dispatch({ type: "UPDATE_USER", payload: user });

      if (user) {

        getRol(user.uid).then((role) => {
          user = foundUser ? { ...foundUser } : null;

          //console.log("USUARIO ROL: " + user);

          dispatch({ type: "SET_ROLE", payload: role });
          //return role;
        });
      }
    });
  };

  useEffect(() => {
    if (!authInitialized) {
      listenToAuthChanges();
      authInitialized = true;
    }
  });

  return <></>;
};
