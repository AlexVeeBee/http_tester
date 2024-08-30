import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ModalProvider } from "./components/context/modal/modalProvider";
import { UIEssentialsProvider } from "./components/context/UIEssentials/provider";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Toaster 
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        style: {
          padding: "8px 16px",
          color: "#fff",
          background: "#333",
        },
      }}
    />
    <UIEssentialsProvider>
      <ModalProvider>
        <App />
      </ModalProvider>
    </UIEssentialsProvider>
  </React.StrictMode>,
);
