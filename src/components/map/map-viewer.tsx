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
import PopUpWindow from "./PopUpWindow";






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
  const [isScanning, setIsScanning] = useState(false);

  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  const togglePopUp = () => {
    setIsPopUpOpen(!isPopUpOpen);
  };

  const onScan = () => {

    setIsScanning(!isScanning);
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

        const allDatabases = await Promise.all([database.getAssets(), database.getBuildings()])

        const assetsDatabase = await allDatabases[0];
        const buildingsDatabase = await allDatabases[1];

        // //console.log("DATABASE ASSETS: " + assetsDatabase[0].autoID);

        //Unimos arrays de diferentes objetos
        Array.prototype.push.apply(assetsDatabase, buildingsDatabase);

        setDatos(assetsDatabase);
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

      {isScanning && (
        <div className="scanner">
          {<PopUpWindow toggle={togglePopUp} />}
        </div>
      )}

      <Grid className="bottom-menu" gap={2}>
        {role == "admin" && (
          <Card>
            <IconButton onClick={onToggleCreate} key="createBuilding"><DomainAddIcon /></IconButton>
          </Card>
        )}

        <Card>
          <IconButton onClick={onScan}><DocumentScannerIcon /></IconButton>
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
