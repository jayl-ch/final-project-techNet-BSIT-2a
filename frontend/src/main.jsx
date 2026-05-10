import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app/styles/index.css";
import App from "./app/App";
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "./app/providers/theme";
import { QueryProvider } from "./app/providers/query";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryProvider>
    </ThemeProvider>
  </StrictMode>,
);
