import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app/styles/index.css";
import App from "./app/App";
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "./app/providers/theme";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
