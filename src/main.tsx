import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ModalProvider } from "./components/context/modal/modalProvider";
import { UIEssentialsProvider } from "./components/context/UIEssentials/provider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UIEssentialsProvider>
      <ModalProvider>
        <App />
      </ModalProvider>
    </UIEssentialsProvider>
  </React.StrictMode>,
);
