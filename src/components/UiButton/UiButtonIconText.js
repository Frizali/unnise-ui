import { Button, Stack, Typography, Tooltip } from "@mui/material";

function UiButtonIconText({ children, icon, title = "", ...prop }) {
  return (
    <Tooltip title={title} placement="bottom">
      <Button
        color="icon.main"
        sx={{
          minWidth: "0",
          textTransform: "none",
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
        <Stack direction="row" gap={0.5} alignItems="center">
          {icon}
          <Typography variant="body2" sx={{ color: "text.primary" }}>{children}</Typography>
        </Stack>
      </Button>
    </Tooltip>
  );
}

export default UiButtonIconText;
