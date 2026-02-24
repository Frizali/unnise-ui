import { Button, Tooltip } from "@mui/material";

function UiButtonIcon({ children, title, size = "medium", ...prop }) {
  const dimension = size === "small" ? "24px" : "2rem";

  return (
    <Tooltip title={title} placement="bottom">
      <Button
        color="icon.main"
        sx={{
          minWidth: dimension,
          minHeight: dimension,
          padding: 0,
          color: "icon.main",
          display: "flex",
          justifyContent: "center",
          justifyItems: "center",
          "&:hover": {
            backgroundColor: "#0B120E24",
          },

          "&:active": {
            backgroundColor: "#0B120E24",
          },
        }}
        {...prop}
      >
        {children}
      </Button>
    </Tooltip>
  );
}

export default UiButtonIcon;
