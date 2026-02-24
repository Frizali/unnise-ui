import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ProjectMenu from "../features/project/components/ProjectMenu";

function Sidebar() {
  const listMenu = [
    {
      title: "For you",
      icon: <AccountCircleOutlinedIcon sx={{ color: "icon.main" }} fontSize="small" />,
    },
    {
      title: "Calendar",
      icon: <CalendarMonthOutlinedIcon sx={{ color: "icon.main" }} fontSize="small" />,
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
          <ListItemButton sx={{ gap:".25rem" }} key={menu.title}>
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
