import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  ListItem,
} from "@mui/material";
import { useProjectMenu } from "../hooks/useProjectMenu";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const ProjectMenu = () => {
  const { data, open, handleOpen } = useProjectMenu();

  return (
    <>
      <ListItem disablePadding dense>
        <ListItemButton sx={{ gap: 1 }} onClick={handleOpen} key="Project">
          <ListItemIcon
            sx={{
              minWidth: "24px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <RocketLaunchOutlinedIcon />
          </ListItemIcon>
          <ListItemText color="text.primary" primary="Project" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton key="item1" sx={{ pl: 4 }}>
            <ListItemText primary="Starred" />
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
};

export default ProjectMenu;
