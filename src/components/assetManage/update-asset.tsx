import React from "react";
import "./asset-menu-style.css";
import { useState } from 'react';

import { useAppContext } from "../../middleware/context-provider";
import { Button, TextField, Grid, Box } from "@mui/material";

import Scan from "./Scan";
import { pepo } from "./Scan";
import RadarIcon from '@mui/icons-material/Radar';
import CloseIcon from '@mui/icons-material/Close';

interface PopUpProps {
  onClose: () => void;
}

const UpdateAssetWindow: React.FC<PopUpProps> = ({ onClose }) => {

  console.log("SCAN VALUE: " + pepo);

  const handleClose = () => {
    onClose();
  };


  const [state, dispatch] = useAppContext();
  //Parámetros de control de escaneo
  const [isScanning, setIsScanning] = useState(false);
  //const [actions, setActions] = useState(null);
  //const { scan } = state;
  const { user, building, role, asset } = state;

  const scanAsset = () => {

    setIsScanning(!isScanning);
    console.log("Estamos escanenado");
    //dispatch({ type: "OPEN_SCAN" });
    //dispatch({ type: "SCAN_ASSET" });

  }

  const addAsset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newAsset = { ...asset } as any;
    newAsset.name = data.get("asset-name") || "PERICO";
    console.log("ASSET 1");
    dispatch({ type: "ADD_ASSET", payload: newAsset });

  };

  /*const onUpdateBuilding = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newBuilding = { ...building } as any;
    newBuilding.name = data.get("building-name") || building.name;
    newBuilding.lat = data.get("building-lat") || building.lat;
    newBuilding.lng = data.get("building-lng") || building.lng;
    dispatch({ type: "UPDATE_BUILDING", payload: newBuilding });
    onToggleMenu(false);
  };*/


  //const actionsValue = { actions, setActions };

  /*const onHandleAction = (actions) => {
    setActions({ ...actions });
  }*/

  return (

    <>

      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <div className="modal">
          <div className="modal_content">
            <div className="close_button" onClick={handleClose}>
              <CloseIcon />
            </div>

            <h3>Modificar activo</h3>
            <>
              <div className="data_content">
                {isScanning && <Scan />}
                <TextField type="Usuario" id="asset-name" label="Nombre del activo" variant="standard" name="asset-name" />
                <TextField type="Usuario" id="asset-lvl" label="Planta" variant="standard" />

              </div>
            </>

            {!isScanning ? <Button variant="contained" onClick={scanAsset}>ESCANEAR TAG</Button> : <Button variant="contained" color="warning" disabled>ESCANEAR TAG</Button>}



          </div>
          <div className="modal_background" />
        </div >
      </Box >


    </>
  );
};

export default UpdateAssetWindow;

/*

{!isScanning ? <Button variant="contained" type="submit">ESCANEAR TAG</Button> : <Button variant="contained" color="warning">GUARDAR CAMBIOS</Button>}

<Box
        component="form" onSubmit={addAsset}
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <div className="modal">
          <div className="modal_content">
            <div className="close_button" onClick={handleClose}>
              <CloseIcon />
            </div>
            <h3>Registrar nuevo activo</h3>
            <div className="data_content">
              <TextField type="Usuario" id="asset-name" label="Nombre del activo" variant="standard" name="asset-name" />
              <TextField type="Usuario" id="asset-lvl" label="Planta" variant="standard" />
              {isCreated &&
                <div className="data_message">
                  <small>Activo registrado en la base de datos. </small>
                  <small>Escanea el tag para asociarlo al activo.</small>
                </div>}
            </div>

            {!isCreated ? <Button variant="contained" type="submit">REGISTRAR</Button> : <Button variant="contained" color="warning">GRABAR EN TAG</Button>}


          </div>
          <div className="modal_background" />
        </div>
      </Box >
      */