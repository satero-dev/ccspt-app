import React, { useState } from "react";

import { useAppContext } from "../../middleware/context-provider";
import { v4 as uuidv4 } from 'uuid';
import Write from "./tag-write";

//Interfaz
import CloseIcon from '@mui/icons-material/Close';  //Iconos 
import { Button, TextField, Box } from "@mui/material"; //Elementos UI
import "./asset-menu-style.css";  //CSS

interface PopUpProps {
  onClose: () => void;
}

const RegisterAssetWindow: React.FC<PopUpProps> = ({ onClose }) => {


  const handleClose = () => {
    onClose();
  };

  const [state, dispatch] = useAppContext();

  //Parámetros de control de escaneo
  const [isSaving, setIsSaving] = useState(false);  //Estamos esperando al TAG
  const [isSaved, setIsSaved] = useState(false);  //Ya hemos guardado la información en el TAG y en el servidor

  const [newAsset, setNewAsset] = useState(null); //Variables para guardar el nuevo activo
  const [uuid, setUuid] = useState("");   //Variables para guardar el uuid
  const { asset } = state;  //Traemos la estructura de asset

  const createAsset = (event: React.FormEvent<HTMLFormElement>) => {

    //let myuuid = uuidv4();
    setUuid(uuidv4());

    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nAsset = { ...asset } as any;
    nAsset.name = data.get("asset-name") || "Undefined";
    nAsset.level = data.get("asset-level") || "Undefined";
    nAsset.uuid = uuid;

    console.log("INICIO uuid: " + uuid);

    console.log("CREANDO ASSET");

    setNewAsset(nAsset);

    setIsSaving(true);

  };

  const handleUpdateMessage = () => {
    setIsSaving(false);

    dispatch({ type: "ADD_ASSET", payload: newAsset });

    setIsSaved(true);
    console.log("ACTUA SOCCER");
  };

  const findTag = () => {
    setIsSaving(!isSaving);
  }

  const saveAsset = () => {

    setIsSaving(true);

    console.log("Guardando asset");

    /*e.preventDefault();
    writeFn(message);
    setMessage('');*/
  };


  return (

    <Box
      component="form" onSubmit={createAsset}
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
          {isSaving && <Write onUpdateMessage={handleUpdateMessage} uuid={uuid} />}
          <div className="data_content">
            <TextField type="Usuario" id="asset-name" label="Nombre del activo" variant="standard" name="asset-name" />
            <TextField type="Usuario" id="asset-level" label="Nivel" variant="standard" name="asset-level" />

            {isSaved &&
              <div className="data_message">
                <small>Activo registrado en la base de datos. </small>
                <small>Tag grabado correctamente.</small>
              </div>}
          </div>




          {!isSaved && (!isSaving ? <Button variant="contained" type="submit">REGISTRAR ACTIVO</Button> : <Button variant="contained" color="warning" disabled>REGISTRAR ACTIVO</Button>)}




        </div>
        <div className="modal_background" />
      </div>
    </Box >
  );
};

export default RegisterAssetWindow;

//{isCreated && !isSaved && (!isSaving ? <Button variant="contained" color="warning" onClick={saveAsset}>GRABAR EN TAG</Button> : <Button variant="contained" color="warning" disabled>GRABANDO EN TAG</Button>)}