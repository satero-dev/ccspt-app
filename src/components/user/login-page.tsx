import React, { useState } from "react";
import { useAppContext } from "../../middleware/context-provider";
import { Button, TextField } from "@mui/material";
import { Navigate } from "react-router";
import { Box } from "@mui/system";
import "./login-styles.css";
import { Event } from "three";

type Props = {
  children?: React.ReactNode;
};



export const LoginPage = ({ children }: Props) => {

  const [state, dispatch] = useAppContext();

  const [inputUser, setInputUser] = useState("");
  const [inputPass, setInputPass] = useState("");

  const onLogin = (e: Event) => {
    console.log("Logging in!: " + e.target);
    dispatch({ type: "LOGIN", payload: { user: inputUser, pass: inputPass } })

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
        <TextField id="usuario" label="Usuario" variant="filled" onChange={(event) => setInputUser(event.target.value)} />
        <TextField id="pass" type="password" label="Contraseña" variant="filled" onChange={(event) => setInputPass(event.target.value)} />
      </div>
      <Button variant="contained" color="primary" onClick={onLogin}>
        Entrar
      </Button>
    </Box>
  );
};