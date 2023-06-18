import React, { useCallback, useContext, useEffect, useState } from "react";

const Write = ({ onUpdateMessage }) => {
  console.log("ESCRIBIENDO EN EL TAG: " + onUpdateMessage);
  const [message, setMessage] = useState("");

  const onWrite = async (message) => {
    message = "MENSAJE";

    console.log("ESCRIBIENDO EN onWrite: " + message);

    /*const scannedMessage = "jGhHcSNMkfpattg4pGk2";
    setMessage(scannedMessage);
    onUpdateMessage(scannedMessage); // Llamada a la función onUpdateMessage del padre*/

    if ("NDEFReader" in window) {
      try {
        const ndef = new window.NDEFReader();
        // This line will avoid showing the native NFC UI reader
        await ndef.scan();
        await ndef.write({ records: [{ recordType: "text", data: message }] });
        onUpdateMessage();
        alert(`Value Saved!`);
      } catch (error) {
        alert(`Error!`);
        console.log(`Error! Scan failed to start: ${error}.`);
      }
    }
  };

  useEffect(() => {
    onWrite();
  }, []);

  return (
    <>
      <div className="UUID">BUSCANDO TAG...</div>
    </>
  );
};

export default Write;
