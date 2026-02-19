import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

function Sidebar() {
  const listMenu = [
    {
      title: "My Work",
      icon: <AssignmentOutlinedIcon color="icon.main" />,
      children: [],
    },
    {
      title: "Calendar",
      icon: <CalendarMonthOutlinedIcon color="icon.main" />,
      children: [],
    },
    {
      title: "Project",
      icon: <RocketLaunchOutlinedIcon color="icon.main" />,
      children: [],
    },
  ];

  return (
    <Box
      sx={{
        height:'100%'
      }}
    >
      <List sx={{ flexGrow:1 }} disablePadding dense>
        {listMenu.map((menu) => (
          <ListItem disablePadding dense>
            <ListItemButton sx={{ columnGap: "0.3rem" }} key={menu.title}>
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
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default Sidebar;
