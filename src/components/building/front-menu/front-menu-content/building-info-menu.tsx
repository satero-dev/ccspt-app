import { Button, TextField, Box } from "@mui/material";
import { FC } from "react";
import { useAppContext } from "../../../../middleware/context-provider";
import "./front-menu-content.css";

export const BuildingInfoMenu: FC<{
  onToggleMenu: (active: boolean) => void;
}> = ({ onToggleMenu }) => {
  const [state, dispatch] = useAppContext();

  const { building } = state;
  if (!building) {
    throw new Error("No building active!");
  }

  const onUpdateBuilding = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newBuilding = { ...building } as any;
    newBuilding.name = data.get("building-name") || building.name;
    newBuilding.lat = data.get("building-lat") || building.lat;
    newBuilding.lng = data.get("building-lng") || building.lng;
    dispatch({ type: "UPDATE_BUILDING", payload: newBuilding });
    onToggleMenu(false);
  };

  return (
    <Box component="form" onSubmit={onUpdateBuilding} className="full-width">
      <div className="list-item">
        <TextField
          required
          fullWidth
          id="building-id"
          label="ID de Edificio"
          name="building-id"
          autoComplete="building-id"
          value={building.uuid}
          disabled={true}
        />
      </div>
      <div className="list-item">
        <TextField
          fullWidth
          id="building-name"
          label="Nombre de Edificio"
          name="building-name"
          autoComplete="building-name"
          defaultValue={building.name}
        />
      </div>
      <div className="list-item">
        <TextField
          fullWidth
          required
          id="building-lng"
          label="Longitud"
          name="building-lng"
          autoComplete="building-lng"
          defaultValue={building.lng}
        />
      </div>
      <div className="list-item">
        <TextField
          fullWidth
          required
          id="building-lat"
          label="Latitud"
          name="building-lat"
          autoComplete="building-lat"
          defaultValue={building.lat}
        />
      </div>
      <div className="list-item">
        <Button type="submit" className="submit-button">
          Actualizar edificio
        </Button>
      </div>
    </Box>
  );
};
