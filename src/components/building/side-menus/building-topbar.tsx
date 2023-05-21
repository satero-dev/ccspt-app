import { FC } from "react";
import * as React from "react";

import Toolbar from "@mui/material/Toolbar";
import { Button, IconButton } from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import { Typography } from "@mui/material";
import { getAppBar } from "./mui-utils";
import { makeStyles } from "@mui/material/styles";

export const BuildingTopbar: FC<{
  open: boolean;
  onOpen: () => void;
  width: number;
  buildingName: string;
}> = (props) => {
  const { open, onOpen, width, buildingName } = props;

  const AppBar = getAppBar(width);

  return (

    <AppBar position="fixed" open={open} color="transparent" elevation={0}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onOpen}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon sx={{ color: "#FFFFFF" }} />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          {buildingName}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
