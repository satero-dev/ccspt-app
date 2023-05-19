import React from "react";
import { useAppContext } from "../../middleware/context-provider";
import { Button, TextField } from "@mui/material";
import { Navigate } from "react-router";
import { Box } from "@mui/system";
import "./login-styles.css";

type Props = {
  children?: React.ReactNode;
};



export const LoginPage = ({ children }: Props) => {

  const [state, dispatch] = useAppContext();

  const onLogin = () => {
    console.log("Logging in!");
    dispatch({ type: "LOGIN" })
  }


  if (state.user) {
    return <Navigate to="/map" />
  }

  return (

    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        padding: 0,
      }}
    >
      <img className="landing-logo" alt="pt logo" src="pt-logo-landing.png" width={250} />

      <div className="tf">
        <TextField id="usuario" label="Usuario" variant="filled" />
        <TextField id="pass" type="password" label="Contraseña" variant="filled" />
      </div>
      <Button variant="contained" color="primary" onClick={onLogin}>
        Entrar
            </Button>
    </Box>
  );
};