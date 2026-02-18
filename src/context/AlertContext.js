import { createContext, useState, useContext, useCallback } from "react";
import { Alert, AlertTitle, Snackbar } from "@mui/material";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    open: false,
    title: "",
    message: "",
    severity: "info",
  });

  const showAlert = useCallback((title, message, severity = "info") => {
    setAlert({ open: true, title, message, severity });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <AlertContext.Provider value={showAlert}>
      {children}
      <Snackbar
        open={alert.open}
        // autoHideDuration={4000}
        onClose={hideAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={hideAlert}
          severity={alert.severity}
        >
          <AlertTitle>{alert.title}</AlertTitle>
          {alert.message}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  return useContext(AlertContext);
};