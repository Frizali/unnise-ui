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
import UiButtonIcon from "../../../components/UiButton/UiButtonIcon";
import { useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import { Sparkles, Plus, ChevronDown, ChevronUp } from "lucide-react";
import BaseIcon from "../../../components/Icon/BaseIcon";

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: "8px",
  padding: "4px 4px 4px 6px",
  boxSizing: "border-box",
  position: "relative",
  gap: "0.25rem",

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
      <ListItemButton
        sx={{
          gap: "0.25rem",
          padding: "4px",
          "& .MuiListItemIcon-root": {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 24 }}>
          <BaseIcon>
            <Sparkles />
          </BaseIcon>
        </ListItemIcon>

        <ListItemText primary="Project" />

        <Box sx={{ display: "flex", gap: ".25rem" }}>
          <UiButtonIcon
            size="small"
            title="Create Project"
            onClick={projectState.handleOpen}
          >
            <BaseIcon>
              <Plus />
            </BaseIcon>
          </UiButtonIcon>

          <UiButtonIcon
            size="small"
            title={openMenu ? "Less" : "More"}
            onClick={handleOpenMenu}
          >
            {openMenu ? (
              <BaseIcon>
                <ChevronUp />
              </BaseIcon>
            ) : (
              <BaseIcon>
                <ChevronDown />
              </BaseIcon>
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
                    height: 14,
                    mb: 0.5,
                    // ml: 4,
                    borderRadius: "4px",
                  }}
                />
              ))
            : projects.map((item) => {
                const isSelected = location.pathname.startsWith(
                  `/main/projects/${item.id}`,
                );

                return (
                  <StyledListItemButton
                    key={item.id}
                    // sx={{ pl: 4 }}
                    selected={isSelected}
                    onClick={() => navigate(`/main/projects/${item.id}`)}
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
