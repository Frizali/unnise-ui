import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ProjectMenu from "../features/project/components/ProjectMenu";
import styled from "@emotion/styled";
import { useLocation, useNavigate } from "react-router-dom";
import { Calendar, Briefcase } from "lucide-react";
import BaseIcon from "../components/Icon/BaseIcon";

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: "8px",
  padding: "4px",
  boxSizing: "border-box",
  position: "relative",

  "&.Mui-selected": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  
  "&.Mui-selected:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const listMenu = [
    {
      title: "Workspace",
      path: "/main",
      icon: (
        <BaseIcon>
          <Briefcase />
        </BaseIcon>
      ),
    },
    {
      title: "Calendar",
      path: "/main/calendar",
      icon: (
        <BaseIcon>
          <Calendar />
        </BaseIcon>
      ),
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
                {item.icon}
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
