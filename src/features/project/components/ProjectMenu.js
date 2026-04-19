import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Tooltip,
  Skeleton,
} from "@mui/material";
import { useProjectMenu } from "../hooks/useProjectMenu";
import { useProject } from "../hooks/useProject";
import { CreateProject } from "../pages/CreateProject";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import UiButtonIcon from "../../../components/UiButton/UiButtonIcon";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useLocation } from "react-router-dom";
import styled from "@emotion/styled";

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: 3,
  padding: "4px .5rem",
  marginLeft:"1rem",
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

const ProjectMenu = () => {
  const location = useLocation();

  const {
    projects,
    loading,
    openMenu,
    handleOpenMenu,
    navigate,
    fetchProjects,
  } = useProjectMenu();

  const projectState = useProject({ fetchProjects });

  return (
    <>
      <ListItemButton sx={{ gap: "0.25rem" }}>
        <ListItemIcon sx={{ minWidth: 24 }}>
          <RocketLaunchOutlinedIcon fontSize="small" />
        </ListItemIcon>

        <ListItemText primary="Project" />

        <Box sx={{ display: "flex", gap: ".25rem" }}>
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

      <Collapse in={openMenu} timeout="auto" unmountOnExit>
        <List disablePadding dense>
          {loading
            ? Array.from(new Array(3)).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  sx={{
                    height: 28,
                    mb: 1,
                    ml: 4,
                    borderRadius: "3px",
                  }}
                />
              ))
            : projects.map((item) => {
                const isSelected =
                  location.pathname.startsWith(`/main/projects/${item.id}`);

                return (
                  <StyledListItemButton
                    key={item.id}
                    sx={{ pl: 4 }}
                    selected={isSelected}
                    onClick={() =>
                      navigate(`/main/projects/${item.id}`)
                    }
                  >
                    <Tooltip title={item.name} placement="right">
                      <ListItemText
                        primary={item.name}
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      />
                    </Tooltip>
                  </StyledListItemButton>
                );
              })}
        </List>
      </Collapse>

      <CreateProject {...projectState} />
    </>
  );
};


export default ProjectMenu;
