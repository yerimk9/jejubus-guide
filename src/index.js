import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";
import "./styles/global.css";
import { APIProvider } from "@vis.gl/react-google-maps";
import { RecoilRoot } from "recoil";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <RecoilRoot>
    <APIProvider
      apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
      onLoad={() => console.log("Maps API has loaded.")}
    >
      <App />
    </APIProvider>
  </RecoilRoot>
);
