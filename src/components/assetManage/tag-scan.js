import React, { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../../middleware/context-provider";
import "./asset-menu-style.css";

const Scan = ({ onUpdateMessage }) => {
  const [message, setMessage] = useState("");
  const { actions, setActions } = useAppContext();

  const scan = useCallback(async () => {
    //Este comentario lo dejo para pruebas en Escritorio
    /*const scannedMessage = "jGhHcSNMkfpattg4pGk2";
    setMessage(scannedMessage);
    onUpdateMessage(scannedMessage); // Llamada a la función onUpdateMessage del padre*/

    if ("NDEFReader" in window) {
      try {
        const ndef = new window.NDEFReader();
        await ndef.scan();

        //Si existe error de lectura...
        ndef.onreadingerror = () => {};

        //Iniciamos escaneo
        ndef.onreading = (event) => {
          onReading(event);
          setActions({
            scan: "scanned",
            write: null,
          });
        };
      } catch (error) {
        alert(`Error!`);
        console.log(`¡Error de escaneo!: ${error}.`);
      }
    }
  }, [setActions]);

  //Escaneamos el tag y recogemos la información de texto
  const onReading = ({ message }) => {
    for (const record of message.records) {
      switch (record.recordType) {
        case "text":
          const textDecoder = new TextDecoder(record.encoding);
          setMessage(textDecoder.decode(record.data));
          onUpdateMessage(textDecoder.decode(record.data)); // Llamamos a la función onUpdateMessage del padre
          break;
        default:
        // TODO: Otro tipo de datos.
      }
    }
  };

  useEffect(() => {
    scan();
  }, [scan]);

  return (
    <>
      {message ? (
        <div className="uuid"></div>
      ) : (
        <div className="uuid">BUSCANDO TAG...</div>
      )}
    </>
  );
};

export default Scan;
