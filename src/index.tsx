import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initializeApp } from "firebase/app";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBudsx2Nuc0vSUSxw-v6Xd-gwTbbfaAOs0",
  authDomain: "ccspt-fb-spaces.firebaseapp.com",
  projectId: "ccspt-fb-spaces",
  storageBucket: "ccspt-fb-spaces.appspot.com",
  messagingSenderId: "482057083927",
  appId: "1:482057083927:web:71327ec303c7e38f311052",
  measurementId: "G-F4CCNR7WJN",
};

// Initialize Firebase
initializeApp(firebaseConfig);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
