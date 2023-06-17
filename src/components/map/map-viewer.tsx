import { FC, useRef, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../../middleware/context-provider";
import { Button, Card, Grid, IconButton } from "@mui/material";
import "./map-viewer.css";

import { SearchMenu } from "../search-toolbar/search-menu";
import { MapDataBase } from "../../core/map/map-database";

import DomainAddIcon from '@mui/icons-material/DomainAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

import RegisterAssetWindow from "../assetManage/register-asset";
import { UpdateAssetWindow } from "../assetManage/update-asset";


import AddBoxIcon from '@mui/icons-material/AddBox';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';






export const MapViewer: FC = () => {
  const [state, dispatch] = useAppContext();
  const containerRef = useRef(null);
  const thumbnailRef = useRef(null);
  const [isCreating, setIsCreating] = useState(false);
  const { user, building, role } = state;

  //State que controla los datos recibidos
  const [datos, setDatos] = useState<any[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  //Parámetros de control de escaneo
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  /*const togglePopUp = () => {
    //setIsPopUpOpen(!isPopUpOpen);
    toggle();
  };*/

  const closeRegisterAsset = () => {
    setIsRegisterOpen(false);
  };

  const closeUpdateAsset = () => {
    setIsUpdateOpen(false);
  };

  const registerAsset = () => {

    setIsRegisterOpen(!isRegisterOpen);
    console.log("Pulsamos botón Scan");
    //dispatch({ type: "OPEN_SCAN" });
    //dispatch({ type: "SCAN_ASSET" });

  }

  const updateAsset = () => {

    setIsUpdateOpen(!isUpdateOpen);
    console.log("Pulsamos botón Scan");
    //dispatch({ type: "OPEN_SCAN" });
    //dispatch({ type: "SCAN_ASSET" });

  }


  const onToggleCreate = () => {
    setIsCreating(!isCreating);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const onLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const onCreate = () => {
    if (isCreating) {
      dispatch({ type: "ADD_BUILDING", payload: user });
      setIsCreating(false);
    }
  };


  useEffect(() => {
    const container = containerRef.current;
    if (container && user) {

      const thumbnail = thumbnailRef.current;
      dispatch({ type: "START_MAP", payload: { container, user, thumbnail } });

      //Lectura de base de datos
      let database = new MapDataBase();

      const fetchData = async () => {

        const allDatabases = await Promise.all([database.getBuildings(), database.getAssets()])

        const assetsDatabase = await allDatabases[1];
        const buildingsDatabase = await allDatabases[0];

        //console.log("DATABASE ASSETS: " + assetsDatabase[0].name);

        //Unimos arrays de diferentes objetos
        Array.prototype.push.apply(buildingsDatabase, assetsDatabase);

        buildingsDatabase.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)) //Función inline de Marco Demaio

        setDatos(buildingsDatabase);
      };
      fetchData();

    }
  }, []);

  if (!user) {
    return <Navigate to="/login" />;
  }

  //console.log("USER: " + user);

  if (building) {
    const url = `/building/?id=${building.uid}`;
    return <Navigate to={url} />;
  }

  return (
    <>
      <div
        className="full-screen"
        onContextMenu={onCreate}
        ref={containerRef}
      />
      {isCreating && (
        <div className="overlay">
          <p>Clica en el botón derecho para crear un nuevo edificio o |</p>
          <Button variant="contained" onClick={onToggleCreate}>cancela</Button>
        </div>
      )}

      {isRegisterOpen && (

        <RegisterAssetWindow onClose={closeRegisterAsset} />

      )}

      {isUpdateOpen && (

        <UpdateAssetWindow onClose={closeUpdateAsset} />

      )}

      <Grid className="bottom-menu" gap={2}>
        {role == "admin" && (
          <Card>
            <IconButton onClick={onToggleCreate} key="createBuilding"><DomainAddIcon /></IconButton>
          </Card>
        )}

        <Card>
          <IconButton onClick={registerAsset}><AddBoxIcon /></IconButton>
        </Card>

        <Card>
          <IconButton onClick={updateAsset}><AppRegistrationIcon /></IconButton>
        </Card>

        <Card>
          <IconButton onClick={toggleFullscreen}>
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </Card>
        <Card>
          <IconButton onClick={onLogout} key="logout"><LogoutIcon /></IconButton>
        </Card>
      </Grid>


      <SearchMenu datos={datos} />


    </>
  );
};
