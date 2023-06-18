import React from "react";

import { useState, useEffect } from 'react';
import { useAppContext } from "../../middleware/context-provider";


import Scan from "./tag-scan";

//Interfaz
import CloseIcon from '@mui/icons-material/Close';
import { Button, TextField, Box } from "@mui/material";
import "./asset-menu-style.css";

import { MapDataBase } from "../../core/map/map-database";

interface PopUpProps {
  onClose: () => void;
}

export const UpdateAssetWindow: React.FC<PopUpProps> = ({ onClose }) => {


  const handleClose = () => {
    onClose();
  };

  const [state, dispatch] = useAppContext();

  //Parámetros de control de escaneo
  const [isScanning, setIsScanning] = useState(false);
  const [isScanned, setIsScanned] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [shouldFetchData, setShouldFetchData] = useState(false);

  const { asset } = state;

  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [level, setLevel] = useState("");


  const handleUpdateMessage = (newMessage: any) => {
    setMessage(newMessage);
    setShouldFetchData(true);
    setIsScanned(true);
  };

  const scanAsset = () => {

    setIsScanning(!isScanning);   //Estamos en modo escaneo

  }

  const updateAsset = (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();//Cancela el evento si este es cancelable, sin detener el resto del funcionamiento del evento

    const data = new FormData(event.currentTarget); //Recogemos la información del formulario
    const newAsset = { ...asset } as any;//Creamos una instancia del activo

    newAsset.name = data.get("asset-name");   //Guardamos el nombre del activo 
    newAsset.level = data.get("asset-level"); //Guardamos el nivel del activo
    newAsset.uuid = message;                  //Guardamos el uuid del activo

    //Actualizamos estados
    setIsUpdated(true);

    //Actualizamos el activo
    dispatch({ type: "UPDATE_ASSET", payload: newAsset });

  };

  const fetchData = async () => {
    let database = new MapDataBase();
    const allDatabases = await Promise.all([database.getAssets()])

    const assetsDatabase = await allDatabases[0];


    const assetWithMessage = assetsDatabase.find(asset => asset.uuid === message);
    if (assetWithMessage) {
      console.log("Asset encontrado:", assetWithMessage);
      setName(assetWithMessage.name);
      setLevel(assetWithMessage.level);
      setLat(String(assetWithMessage.lat));
      setLng(String(assetWithMessage.lng));
    } else {
      console.log("No se encontró el asset con el nombre:", message);
    }

  };

  useEffect(() => {
    if (shouldFetchData) {
      fetchData();
      setShouldFetchData(false);
    }
  }, [shouldFetchData]);


  return (

    <Box
      component="form"
      onSubmit={updateAsset}
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
              {isScanning && <Scan onUpdateMessage={handleUpdateMessage} />}
              <TextField type="Usuario" id="asset-name" label="Nombre del activo" variant="standard" name="asset-name" value={name} onChange={(event) => setName(event.target.value)} />
              <TextField type="Usuario" id="asset-level" label="Nivel" variant="standard" name="asset-level" value={level} onChange={(event) => setLevel(event.target.value)} />
              <TextField type="Usuario" id="asset-lat" label="Latitud" variant="standard" name="asset-lat" value={lat} disabled />
              <TextField type="Usuario" id="asset-lng" label="Longitud" variant="standard" name="asset-lng" value={lng} disabled />
              {isUpdated &&
                <div className="data_message">
                  <small>Activo actualizado en la base de datos. </small>
                </div>}


            </div>
          </>

          {!isScanned && (!isScanning ? <Button variant="contained" onClick={scanAsset}>ESCANEAR TAG</Button> : <Button variant="contained" color="warning" disabled>ESCANEAR TAG</Button>)}

          {isScanned && !isUpdated && <Button variant="contained" type="submit">ACTUALIZAR ACTIVO</Button>}


        </div>
        <div className="modal_background" />
      </div >
    </Box >

  );
};

//export default UpdateAssetWindow;

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