import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Tooltip,
} from "@mui/material";
import { useProjectMenu } from "../hooks/useProjectMenu";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const ProjectMenu = () => {
  const { data, open, handleOpen } = useProjectMenu();

  return (
    <>
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
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding dense>
          {data.map((item) => (
            <ListItemButton key={item.id} sx={{ pl: 4 }}>
              <Tooltip title={item.name} placement="right">
                <ListItemText
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  primary={item.name}
                />
              </Tooltip>
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default ProjectMenu;
