import { Alert, AlertTitle } from "@mui/material";
import { useState } from "react";

const UiAlert = ({}) => {
  const [alert, setAlert] = useState({
    open: false,
    title: "",
    detail: "",
    severity: "info",
  });

  const showAlert = ({
    title,
    detail,
    severity = "info"
  }) => {
    setAlert({
        open:true,
        title,
        detail,
        severity
    })
  }

  return (
    <Alert severity={alert.severity}>
      <AlertTitle>{alert.title}</AlertTitle>
      {alert.title}
    </Alert>
  );
};
