import React, { useEffect } from "react";

const Write = ({ onUpdateMessage, uuid }) => {
  //Escribimos información en el Tag
  const onWrite = async () => {
    //Este comentario lo dejo para pruebas en Escritorio
    /*const scannedMessage = "jGhHcSNMkfpattg4pGk2";
    setMessage(scannedMessage);
    onUpdateMessage(scannedMessage); // Llamada a la función onUpdateMessage del padre*/

    if ("NDEFReader" in window) {
      try {
        const ndef = new window.NDEFReader();
        //Esta parte evita que se abra el NFC UI nativo
        await ndef.scan();
        //El tag únicamente contiene el uuid del activo.
        await ndef.write({ records: [{ recordType: "text", data: uuid }] });
        onUpdateMessage();
      } catch (error) {
        alert(`Error!`);
        console.log(`¡Error de escaneo!: ${error}.`);
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
