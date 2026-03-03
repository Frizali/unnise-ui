import { Button, Stack, Typography } from "@mui/material";

function UiButtonIconText({ children, icon, ...prop }) {
  return (
    <Button
      color="icon.main"
      sx={{
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
        <Typography variant="body2" sx={{ color:"text.primary"}}>{children}</Typography>
      </Stack>
    </Button>
  );
}

export default UiButtonIconText;
