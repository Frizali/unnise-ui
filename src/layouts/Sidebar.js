import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ProjectMenu from "../features/project/components/ProjectMenu";

function Sidebar() {
  const listMenu = [
    {
      title: "My Work",
      icon: <AssignmentOutlinedIcon sx={{ color: "icon.main" }} />,
    },
    {
      title: "Calendar",
      icon: <CalendarMonthOutlinedIcon sx={{ color: "icon.main" }} />,
    },
  ];

  return (
    <Box
      sx={{
        padding: "12px 0",
      }}
    >
      <List sx={{ flexGrow: 1 }} disablePadding dense>
        {listMenu.map((menu) => (
          <ListItemButton sx={{ gap: 1 }} key={menu.title}>
            <ListItemIcon
              sx={{
                minWidth: "24px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {menu.icon}
            </ListItemIcon>
            <ListItemText color="text.primary" primary={menu.title} />
          </ListItemButton>
        ))}
        <ProjectMenu />
      </List>
    </Box>
  );
}

export default Sidebar;
