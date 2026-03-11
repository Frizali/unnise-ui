import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { AlertProvider } from "./context/AlertContext";

import "./index.css";
import App from "./App";
import { theme } from "./theme";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AlertProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AlertProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

reportWebVitals();
