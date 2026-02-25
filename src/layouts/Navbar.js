import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import logo from "../assets/logo.png";
import ProfileMenu from "../features/profile/components/ProfileMenu";

function Navbar({ children }) {
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "white",
        boxShadow: "none",
        borderBottom: "1px solid #D9D9D9",
      }}
    >
      <Toolbar
        sx={{
          padding: { sm: "0 1rem" },
          minHeight: { sm: "48px" },
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap:"0.25rem" }}>
          {children}
          <img
            src={logo}
            alt="Logo"
            width="24"
            style={{ borderRadius: "3px" }}
          />
          <Typography fontWeight={600} color="black" variant="body2">
            Unnise
          </Typography>
        </Box>
        <ProfileMenu/>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
