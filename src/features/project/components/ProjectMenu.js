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
import { useProject } from "../hooks/useProject";
import { CreateProject } from "../pages/CreateProject";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import UiButtonIcon from "../../../components/UiButton/UiButtonIcon";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

const ProjectMenu = () => {
  const { data, openMenu, handleOpenMenu } = useProjectMenu();
  const projectState = useProject();

  return (
    <>
      <ListItemButton sx={{ gap: "0.25rem" }} key="Project">
        <ListItemIcon
          sx={{
            minWidth: "24px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RocketLaunchOutlinedIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText color="text.primary" primary="Project" />
        <Box
          sx={{
            display: "flex",
            gap: ".25rem",
          }}
        >
          <UiButtonIcon
            size="small"
            title="Create Project"
            onClick={projectState.handleOpen}
          >
            <AddOutlinedIcon fontSize="small" />
          </UiButtonIcon>
          <UiButtonIcon
            size="small"
            title={openMenu ? "Less" : "More"}
            onClick={handleOpenMenu}
          >
            {openMenu ? (
              <ExpandLess fontSize="small" />
            ) : (
              <ExpandMore fontSize="small" />
            )}
          </UiButtonIcon>
        </Box>
      </ListItemButton>

      {/* Collapse Menu */}
      <Collapse in={openMenu} timeout="auto" unmountOnExit>
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

      {/* Dialog Create Project */}
      <CreateProject {...projectState} />
    </>
  );
};

export default ProjectMenu;
