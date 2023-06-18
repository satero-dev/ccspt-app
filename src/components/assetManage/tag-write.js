import React, { useCallback, useContext, useEffect, useState } from "react";

const Write = ({ onUpdateMessage, uuid }) => {
  console.log("ESCRIBIENDO EN EL TAG: " + uuid);

  const onWrite = async () => {
    //message = "MENSAJE";

    console.log("ESCRIBIENDO EN onWrite: " + uuid);

    /*const scannedMessage = "jGhHcSNMkfpattg4pGk2";
    setMessage(scannedMessage);
    onUpdateMessage(scannedMessage); // Llamada a la función onUpdateMessage del padre*/

    if ("NDEFReader" in window) {
      try {
        const ndef = new window.NDEFReader();
        // This line will avoid showing the native NFC UI reader
        await ndef.scan();
        await ndef.write({ records: [{ recordType: "text", data: uuid }] });
        onUpdateMessage();
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
      <div className="uuid">BUSCANDO TAG...</div>
    </>
  );
};

export default Write;
