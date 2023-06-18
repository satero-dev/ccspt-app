import React, { useCallback, useContext, useEffect, useState } from "react";
//import Scanner from "../components/Scanner/Scanner";
//import { ActionsContext } from "../contexts/context";
import { useAppContext } from "../../middleware/context-provider";
import "./asset-menu-style.css";

let pepo = "A";

const Scan = ({ onUpdateMessage }) => {
  //console.log("ESCANEANDO QUE ES GERUNDIO");

  const [message, setMessage] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const { actions, setActions } = useAppContext();
  const [state, dispatch] = useAppContext();

  const scan = useCallback(async () => {
    //dispatch({ type: "SCAN_ASSET", payload: "VALOR POR DEFECTO" });

    const scannedMessage = "jGhHcSNMkfpattg4pGk2";
    setMessage(scannedMessage);
    onUpdateMessage(scannedMessage); // Llamada a la función onUpdateMessage del padre

    if ("NDEFReader" in window) {
      try {
        const ndef = new window.NDEFReader();
        await ndef.scan();

        console.log("Scan started successfully.");
        ndef.onreadingerror = () => {
          console.log("Cannot read data from the NFC tag. Try another one?");
        };

        ndef.onreading = (event) => {
          console.log("NDEF message read.");
          onReading(event);
          setActions({
            scan: "scanned",
            write: null,
          });
        };
      } catch (error) {
        console.log(`Error! Scan failed to start: ${error}.`);
      }
    }
  }, [setActions]);

  const onReading = ({ message, serialNumber }) => {
    setSerialNumber(serialNumber);

    for (const record of message.records) {
      switch (record.recordType) {
        case "text":
          const textDecoder = new TextDecoder(record.encoding);
          setMessage(textDecoder.decode(record.data));
          //onUpdateMessage(textDecoder.decode(record.data)); // Llamada a la función onUpdateMessage del padre
          break;
        default:
        // TODO: Handle other records with record data.
      }
    }
  };

  useEffect(() => {
    scan();
    pepo = message;
  }, [scan]);

  return (
    <>
      {message ? (
        <div className="UUID">{message}</div>
      ) : (
        <div className="UUID">BUSCANDO TAG...</div>
      )}
    </>
  );
};

export default Scan;
export { pepo };

/*
<>
    
      {actions.scan === "scanned" ? (
        <div>
          <p>Serial Number: {serialNumber}</p>
          <p>Message: {message}</p>
        </div>
      ) : null}
    </>
    */
