import { Button, Tooltip } from "@mui/material";

function UiButtonIcon({
  children,
  title,
  size = "medium",
  bordered = false,
  loading = false,
  ...prop
}) {
  const dimension = size === "small" ? "24px" : "2rem";

  return (
    <Tooltip title={title} placement="bottom">
      <Button
        loading={loading}
        color="icon.main"
        sx={{
          minWidth: dimension,
          height: dimension,
          padding: 0,
          color: "icon.main",
          display: "flex",
          justifyContent: "center",
          justifyItems: "center",
          border: bordered ? "1px solid #D9D9D9" : "none",
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
