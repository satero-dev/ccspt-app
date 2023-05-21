import { FC } from "react";
import { useTheme } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { BuildingSidebar } from "./building-sidebar";
import { getDrawer, getDrawerHeader } from "./mui-utils";
import { FrontMenuMode } from "../front-menu/types";
import { Avatar } from "@mui/material";

export const BuildingDrawer: FC<{
  open: boolean;
  width: number;
  onToggleMenu: (active?: boolean, mode?: FrontMenuMode) => void;
  onClose: () => void;
}> = (props) => {
  const theme = useTheme();

  const { open, width: drawerWidth, onClose, onToggleMenu } = props;

  const Drawer = getDrawer(drawerWidth);
  const DrawerHeader = getDrawerHeader();

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader sx={{ background: "#0080FF" }}>

        {open && (
          <img alt="Logo Tauli" src="../../../../pt-logo-landing-150.png" width="150" />
        )}
        <IconButton onClick={onClose} sx={{
          ...(!open && { display: "none" }),
        }}>

          {theme.direction === "rtl" ? (
            <ChevronRightIcon sx={{ color: "#FFFFFF" }} />
          ) : (
            <ChevronLeftIcon sx={{ color: "#FFFFFF" }} />
          )}
        </IconButton>
      </DrawerHeader>
      <BuildingSidebar onToggleMenu={onToggleMenu} open={open} />
      <Divider />
    </Drawer>
  );
};
