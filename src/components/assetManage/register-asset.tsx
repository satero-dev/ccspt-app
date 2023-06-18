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

    let myuuid = uuidv4();

    event.preventDefault(); //Cancela el evento si este es cancelable, sin detener el resto del funcionamiento del evento

    const data = new FormData(event.currentTarget); //Recogemos la información del formulario
    const nAsset = { ...asset } as any; //Creamos una instancia del activo

    nAsset.name = data.get("asset-name") || "Undefined";    //Guardamos el nombre del activo 
    nAsset.level = data.get("asset-level") || "Undefined";  //Guardamos el nivel del activo
    nAsset.uuid = myuuid;                                   //Guardamos el uuid del activo

    //Actualizamos estados
    setUuid(myuuid);      //de uuid
    setNewAsset(nAsset);  //de activo
    setIsSaving(true);    //estamos guardando la información a la espera de escribir en el tag

  };

  const handleUpdateMessage = () => {

    dispatch({ type: "ADD_ASSET", payload: newAsset }); //Una vez leido el tag, enviamos la información a la base de datos

    setIsSaving(false); //Ya no estamos esperando al tag
    setIsSaved(true);   //Ya se ha guardado la información

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