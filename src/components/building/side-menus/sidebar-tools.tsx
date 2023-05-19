import MapIcon from "@mui/icons-material/Map";
import LogoutIcon from "@mui/icons-material/Logout";
import ModelsIcon from "@mui/icons-material/HolidayVillage";
import ListAltIcon from '@mui/icons-material/ListAlt';
import FloorplanIcon from "@mui/icons-material/Layers";
import PropertiesIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import LanIcon from '@mui/icons-material/Lan';
import { Tool } from "../../../types";

export function getSidebarTools(): Tool[] {
  return [
    {
      name: "Info",
      active: false,
      icon: <ListAltIcon />,
      action: ({ onToggleMenu }) => {
        onToggleMenu(true, "BuildingInfo");
      },
    },
    {
      name: "Modelos",
      active: false,
      icon: <ModelsIcon />,
      action: ({ onToggleMenu }) => {
        onToggleMenu(true, "ModelList");
      },
    },
    {
      name: "Planos de planta",
      active: false,
      icon: <FloorplanIcon />,
      action: ({ onToggleMenu }) => {
        onToggleMenu(true, "Floorplans");
      },
    },
    {
      name: "Propiedades",
      active: false,
      icon: <PropertiesIcon />,
      action: ({ onToggleMenu }) => {
        onToggleMenu(true, "Properties");
      },
    },
    {
      name: "Sistemas",
      active: false,
      icon: <LanIcon />,
      action: ({ onToggleMenu }) => {
        onToggleMenu(true, "Systems");
      },
    },
    {
      name: "Mapa",
      active: false,
      icon: <MapIcon />,
      action: ({ dispatch }) => {
        dispatch({ type: "CLOSE_BUILDING" });
      },
    },
    {
      name: "Eliminar edificio",
      active: false,
      icon: <DeleteIcon />,
      action: ({ dispatch, state }) => {
        dispatch({ type: "DELETE_BUILDING", payload: state.building });
      },
    },
    {
      name: "Cerrar sesión",
      active: false,
      icon: <LogoutIcon />,
      action: ({ dispatch }) => {
        dispatch({ type: "LOGOUT" });
      },
    },
  ];
}
