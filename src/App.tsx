import { useEffect } from "react";
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
  useEffect(() => {
    (async () => {
      const available = await isUpdateAvailable()
      if (available) {
        toast.success("Update available");
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
