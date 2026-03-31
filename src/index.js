import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { AlertProvider } from "./context/AlertContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider>
          <AlertProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </AlertProvider>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

reportWebVitals();
