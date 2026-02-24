import {
  Box,
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
import UiButtonIcon from "../../../components/UiButton/UiButtonIcon";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

const ProjectMenu = () => {
  const { data, open, handleOpen } = useProjectMenu();

  return (
    <>
      <ListItemButton sx={{ gap:"0.25rem" }} key="Project">
        <ListItemIcon
          sx={{
            minWidth: "24px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RocketLaunchOutlinedIcon fontSize="small"/>
        </ListItemIcon>
        <ListItemText color="text.primary" primary="Project" />
        <Box
          sx={{
            display: "flex",
            gap: ".25rem",
          }}
        >
          <UiButtonIcon size="small" title="Create Project">
            <AddOutlinedIcon fontSize="small" />
          </UiButtonIcon>
          <UiButtonIcon
            size="small"
            title={open ? "Less" : "More"}
            onClick={handleOpen}
          >
            {open ? (
              <ExpandLess fontSize="small" />
            ) : (
              <ExpandMore fontSize="small" />
            )}
          </UiButtonIcon>
        </Box>
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
