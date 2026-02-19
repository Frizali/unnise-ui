import { AppBar, Avatar, Box, Toolbar, Typography } from "@mui/material";
import logo from "../assets/logo.png";

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {children}
          <img src={logo} alt="Logo" width="24" />
          <Typography fontWeight={600} color="black" variant="body2">
            Unnise
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar sx={{ width: 24, height: 24 }} />
          <Typography
            fontWeight={600}
            color="black"
            variant="body2"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Ali
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
