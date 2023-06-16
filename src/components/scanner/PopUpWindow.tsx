import React from "react";
import "./PopUpWindow.css";
import { useState } from 'react';

import { useAppContext } from "../../middleware/context-provider";
import { Button, Card, Grid, IconButton } from "@mui/material";

import Scan from "./Scan";

interface PopUpProps {
  toggle: () => void;
}

const PopUpWindow: React.FC<PopUpProps> = ({ toggle }) => {
  const handleClick = () => {
    toggle();
  };

  const [state, dispatch] = useAppContext();
  //Parámetros de control de escaneo
  const [isScanning, setIsScanning] = useState(false);
  //const [actions, setActions] = useState(null);
  const { scan } = state;

  const scanAsset = () => {

    setIsScanning(!isScanning);
    console.log("Estamos escanenado");
    //dispatch({ type: "OPEN_SCAN" });
    dispatch({ type: "SCAN_ASSET" });

  }

  //const actionsValue = { actions, setActions };

  /*const onHandleAction = (actions) => {
    setActions({ ...actions });
  }*/

  return (
    <div className="modal">
      <div className="modal_content">
        <form>
          <h3>Escanea!</h3>
          {isScanning && <Scan />}
          <label>
            Nombre del activo: <input type="text" name="name" />
          </label>
          <br />
          <label>
            Nombre del activo: <input type="text" name="name" />
          </label>
          <br />
          <Button variant="contained" onClick={scanAsset}>Scan</Button>
        </form>
      </div>
      <div className="modal_background" />
    </div>
  );
};

export default PopUpWindow;