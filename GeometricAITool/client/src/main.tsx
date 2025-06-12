import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set default theme
document.body.className = "dark";

createRoot(document.getElementById("root")!).render(<App />);
