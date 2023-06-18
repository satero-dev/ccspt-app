import React, { useEffect } from "react";

const Write = ({ onUpdateMessage }) => {
  console.log("ESCRIBIENDO EN EL TAG");

  const onWrite = async (message) => {
    message = "MENSAJE";

    console.log("ESCRIBIENDO EN onWrite: " + message);

    if ("NDEFReader" in window) {
      try {
        const ndef = new window.NDEFReader();
        // This line will avoid showing the native NFC UI reader
        await ndef.scan();
        await ndef.write({ records: [{ recordType: "text", data: message }] });
        onUpdateMessage("BAILONGO");
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
      <div className="UUID">ESCRIBIENDO TAG...</div>
    </>
  );
};

export default Write;
