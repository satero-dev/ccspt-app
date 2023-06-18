import React, { useEffect } from "react";

import { useAppContext } from "../../middleware/context-provider";

const Write = () => {
  console.log("ESCRIBIENDO EN EL TAG");

  const { actions } = useAppContext();

  const onWrite = async (message) => {
    console.log("ESCRIBIENDO EN onWrite");

    if ("NDEFReader" in window) {
      try {
        const ndef = new window.NDEFReader();
        // This line will avoid showing the native NFC UI reader
        await ndef.scan();
        await ndef.write({ records: [{ recordType: "text", data: message }] });
        alert(`Value Saved!`);
      } catch (error) {
        console.log(`Error! Scan failed to start: ${error}.`);
      }
    }
  };

  useEffect(() => {
    onWrite();
  }, []);

  return (
    <>
      <div className="UUID">ESCRBIENDO TAG...</div>
    </>
  );
};

export default Write;
