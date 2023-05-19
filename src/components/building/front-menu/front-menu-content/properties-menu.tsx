import { Divider } from "@mui/material";
import { FC } from "react";
import { useAppContext } from "../../../../middleware/context-provider";
import "./front-menu-content.css";

export const PropertiesMenu: FC = () => {
  const [state] = useAppContext();

  //console.log("state.properties: " + state.properties.length);

  return (
    <div>
      {Boolean(state.properties.length) ? (
        <Divider />
      ) : (
        <p>No se ha seleccionado ningún activo</p>
      )}

      {state.properties.map((property) => (
        <div key={property.name}>
          <div className="value-pair list-item">
            <div>{property.name}</div>
            <p>:</p>
            <div>{property.value}</div>
          </div>
          <Divider />
        </div>
      ))}
    </div>
  );
};
