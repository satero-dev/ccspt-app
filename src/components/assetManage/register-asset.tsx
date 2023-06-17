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

const RegisterAssetWindow: React.FC<PopUpProps> = ({ onClose }) => {


  const handleClose = () => {
    onClose();
  };

  const [state, dispatch] = useAppContext();
  //Parámetros de control de escaneo
  const [isCreated, setIsCreated] = useState(false);
  //const [actions, setActions] = useState(null);
  //const { scan } = state;
  const { asset } = state;

  const addAsset = (event: React.FormEvent<HTMLFormElement>) => {
    setIsCreated(!isCreated);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newAsset = { ...asset } as any;
    newAsset.name = data.get("asset-name") || "PERICO";
    console.log("ASSET 1");
    //dispatch({ type: "ADD_ASSET", payload: newAsset });
  };

  return (

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
  );
};

export default RegisterAssetWindow;