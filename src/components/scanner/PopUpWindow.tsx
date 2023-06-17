import React from "react";
import "./PopUpWindow.css";
import { useState } from 'react';

import { useAppContext } from "../../middleware/context-provider";
import { Button, TextField, Grid, Box } from "@mui/material";

import Scan from "./Scan";
import RadarIcon from '@mui/icons-material/Radar';

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

          <h3>Activo</h3>
          <TextField disabled type="Usuario" id="outlined-basic" label="UUID" variant="standard" value={isScanning ? <Scan /> : "HOLA"} />
          {isScanning && <Scan />}
          <TextField type="Usuario" id="outlined-basic" label="Nombre del activo" variant="standard" />
          <TextField disabled type="Usuario" id="outlined-basic" label="Coordenadas" variant="standard" />
          <TextField type="Usuario" id="outlined-basic" label="Planta" variant="standard" />


          <Grid>
            {isScanning ? <Button variant="contained" onClick={scanAsset}>ESCANEANDO...</Button> : <Button variant="contained" onClick={scanAsset}>ESCANEAR</Button>}

            <Button variant="contained" onClick={scanAsset}>GUARDAR</Button>
          </Grid>

        </div>
        <div className="modal_background" />
      </div>
    </Box>
  );
};

export default PopUpWindow;