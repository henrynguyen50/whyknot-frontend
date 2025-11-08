
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";

  // Leaflet setup, imports css properly
  import "./utils/leafletSetup";

  createRoot(document.getElementById("root")!).render(<App />);
  