import { useEffect, useState } from "react";
import "./App.css";
import HttpTester from "./pages/httpTester";
import { check } from "@tauri-apps/plugin-updater"
import toast from "react-hot-toast";


const isUpdateAvailable = async () => {
  console.log("Checking for updates");
  try {
    const update = await check();
    console.log("Update: ", update);
    return update;
  } catch (e) {
    console.error("Failed to check for updates: ", e);
    return false;
  }
}

function App() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateError, setUpdateError] = useState(false);
  const onUpdate = () => {
    setUpdateAvailable(true);
  };

  useEffect(() => {
    (async () => {
      const available = await isUpdateAvailable()
      if (available) {
        onUpdate();
        toast.success("Update available");
      } else {
        setUpdateAvailable(false);
        setUpdateError(true);
      }
    })()
  }, []);

  return (
    <>
      <HttpTester />
    </>
  );
}

export default App;
