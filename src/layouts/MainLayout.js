import { useState } from "react";
import { Box, Drawer, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import UiButtonIcon from "../components/UiButton/UiButtonIcon";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const drawerWidth = 240;

export default function MainLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar>
        {isMobile && (
          <UiButtonIcon onClick={toggleDrawer}>
            <MenuIcon />
          </UiButtonIcon>
        )}
      </Navbar>

      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {!isMobile && (
          <Box
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              borderRight: "1px solid #ddd",
            }}
          >
            <Sidebar />
          </Box>
        )}

        {isMobile && (
          <Drawer open={open} onClose={toggleDrawer} variant="temporary">
            <Box sx={{ width: drawerWidth }}>
              <Sidebar />
            </Box>
          </Drawer>
        )}

        {/* Content */}
        <Box
          sx={{
            width:"100%",
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 48px)",
            overflow: "auto",
            pt:2
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
