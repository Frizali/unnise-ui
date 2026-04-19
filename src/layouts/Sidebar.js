import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ProjectMenu from "../features/project/components/ProjectMenu";
import styled from "@emotion/styled";
import { useState, cloneElement } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: 3,
  padding: "4px",
  boxSizing: "border-box",
  position: "relative",

  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translateY(-50%)",
    height: "40%",
    width: 2,
    borderRadius: 3,
    backgroundColor: "transparent",
    transition: "background-color 0.2s ease",
  },

  "&.Mui-selected": {
    backgroundColor: "#e9f2fe",
    color: theme.palette.primary.main,
  },

  "&.Mui-selected::before": {
    backgroundColor: theme.palette.primary.main,
  },

  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const listMenu = [
    {
      title: "For you",
      path: "/main",
      icon: <AccountCircleOutlinedIcon fontSize="small" />,
    },
    {
      title: "Calendar",
      path: "/main/calendar",
      icon: <CalendarMonthOutlinedIcon fontSize="small" />,
    },
  ];

  return (
    <Box sx={{ padding: "12px" }}>
      <List disablePadding dense>
        {listMenu.map((item) => {
          const isSelected = location.pathname === item.path;

          return (
            <StyledListItemButton
              key={item.title}
              selected={isSelected}
              sx={{ gap: ".25rem" }}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon
                sx={{
                  minWidth: 24,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {cloneElement(item.icon, {
                  sx: {
                    color: isSelected ? "primary.main" : "icon.main",
                  },
                })}
              </ListItemIcon>

              <ListItemText primary={item.title} />
            </StyledListItemButton>
          );
        })}

        <ProjectMenu />
      </List>
    </Box>
  );
}

export default Sidebar;