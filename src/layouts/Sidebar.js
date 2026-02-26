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
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const listMenu = [
    {
      title: "For you",
      icon: (
        <AccountCircleOutlinedIcon
          fontSize="small"
        />
      ),
    },
    {
      title: "Calendar",
      icon: (
        <CalendarMonthOutlinedIcon
          fontSize="small"
        />
      ),
    },
  ];

  return (
    <Box
      sx={{
        padding: "12px",
      }}
    >
      <List sx={{ flexGrow: 1 }} disablePadding dense>
        {listMenu.map((item, index) => (
          <StyledListItemButton
            selected={selectedIndex == index}
            sx={{ gap: ".25rem" }}
            key={item.title}
            onClick={(event) => handleListItemClick(event, index)}
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
                  color:
                    selectedIndex === index ? "primary.main" : "icon.main",
                  ...(item.icon.props.sx || {}),
                },
              })}
            </ListItemIcon>
            <ListItemText color="text.primary" primary={item.title} />
          </StyledListItemButton>
        ))}
        <ProjectMenu />
      </List>
    </Box>
  );
}

export default Sidebar;
