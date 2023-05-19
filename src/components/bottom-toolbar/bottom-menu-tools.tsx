import { Action } from "../../middleware/actions";
import { State } from "../../middleware/state";
import { Tool } from "../../types";

import LogoutIcon from "@mui/icons-material/Logout";
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';

import PersonIcon from '@mui/icons-material/Person';
import FullscreenIcon from '@mui/icons-material/Fullscreen';


export function getBottomMenuUsers(): Tool[] {

    const users = [
        {
            name: "User Options",
            icon: <PersonIcon />,
            active: false,
            action: (dispatch: any) => {
                const user = findUser("User Options");
                deactivateAllUsers(dispatch, "User Options");
                user.active = !user.active;

                //dispatch({ type: "LOGOUT" });
                //dispatch({ type: "TOGGLE_CLIPPER", payload: tool.active });
            },
        },
    ];

    const findUser = (name: string) => {
        const user = users.find((user) => user.name === name);
        if (!user) throw new Error("Tool not found!");
        return user;
    };

    const deactivateAllUsers = (dispatch: any, name: string) => {
        for (const user of users) {
            if (user.active && user.name !== name) {
                user.action(dispatch);
            }
        }
    };

    return users;
}

export function getBottomMenuFullscreen(): Tool[] {


    const fullscreen = [
        {
            name: "Fullscreen",
            icon: <FullscreenIcon />,
            active: false,
            action: (dispatch: any) => {
                const user = findUser("Fullscreen");
                deactivateAllUsers(dispatch, "Fullscreen");
                user.active = !user.active;
                //dispatch({ type: "LOGOUT" });
                //dispatch({ type: "TOGGLE_CLIPPER", payload: tool.active });
            },
        },
    ];


    const findUser = (name: string) => {
        const fs = fullscreen.find((fs) => fs.name === name);
        if (!fs) throw new Error("Tool not found!");
        return fs;
    };

    const deactivateAllUsers = (dispatch: any, name: string) => {
        for (const fs of fullscreen) {
            if (fs.active && fs.name !== name) {
                fs.action(dispatch);
            }
        }
    };

    return fullscreen;
}



export function getBottomMenuTools(): Tool[] {


    const tools = [
        {
            name: "Clipping planes",
            icon: <LogoutIcon />,
            active: false,
            action: (dispatch: any) => {
                const tool = findTool("Clipping planes");
                deactivateAllTools(dispatch, "Clipping planes");
                tool.active = !tool.active;
                dispatch({ type: "LOGOUT" });
                //dispatch({ type: "TOGGLE_CLIPPER", payload: tool.active });
            },
        },
        {
            name: "Dimensions",
            icon: <DomainAddIcon />,
            active: false,
            action: (dispatch: any) => {
                const tool = findTool("Dimensions");
                deactivateAllTools(dispatch, "Dimensions");
                tool.active = !tool.active;
                //dispatch({ type: "SCAN_ASSET" });
            },
        },
        {
            name: "Explosion",
            icon: <DocumentScannerIcon />,
            active: false,
            action: (dispatch: any) => {
                const tool = findTool("Explosion");
                deactivateAllTools(dispatch, "Explosion");
                tool.active = !tool.active;
                dispatch({ type: "SCAN_ASSET" });
            },
        },
    ];

    const findTool = (name: string) => {
        const tool = tools.find((tool) => tool.name === name);
        if (!tool) throw new Error("Tool not found!");
        return tool;
    };

    const deactivateAllTools = (dispatch: any, name: string) => {
        for (const tool of tools) {
            if (tool.active && tool.name !== name) {
                tool.action(dispatch);
            }
        }
    };

    return tools;
}
