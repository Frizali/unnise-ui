import {
  Dialog,
  Divider,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";
import UiButtonIcon from "../../../components/UiButton/UiButtonIcon";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useState } from "react";
import UiButton from "../../../components/UiButton/UiButton";
import UiFormGroup from "../../../components/UiFormGroup/UiFormGroup";

const templates = [
  {
    id: 1,
    title: "Kanban",
    description:
      "Work efficiently and visualize work on a board with to do, doing, and done.",
  },
  {
    id: 2,
    title: "Scrum",
    description: "Plan, track, and execute work using sprints and a backlog.",
  },
  {
    id: 3,
    title: "Task Tracking",
    description: "Organize and track team or personal tasks.",
  },
];

export function CreateProject({
  loading,
  open,
  nameAvailable,
  validationError,
  create,
  handleChange,
  handleOpen,
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

  const handleTemplateItemClick = (index) => {
    setSelectedTemplate(index);
  };

  return (
    <Dialog fullScreen open={open}>
      <Box
        sx={{
          maxHeight: "4rem",
          flex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          overflow: "hidden",
          px: "1rem",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="600">
            Create Project
          </Typography>
        </Box>
        <Box>
          <UiButtonIcon title="Close" onClick={handleOpen}>
            <CloseOutlinedIcon />
          </UiButtonIcon>
        </Box>
      </Box>
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <Box
          sx={{
            display: {
              xs: "none",
              md: "block",
            },
            padding: "12px 1rem",
            width: "240px",
            flexShrink: 0,
            borderRight: "1px solid #ddd",
          }}
        >
          <List sx={{ flexGrow: 1 }} disablePadding dense>
            <ListItemButton
              selected={selectedIndex === 0}
              sx={{
                gap: ".25rem",
                "&.Mui-selected": {
                  backgroundColor: "#e9f2fe",
                  color: "primary.main",
                  borderLeft: "2px solid #2D71F8",
                },
              }}
              onClick={() => handleListItemClick(0)}
              key="madeforyou"
            >
              <ListItemText color="text.primary" primary="Made for you" />
            </ListItemButton>
          </List>
        </Box>
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            padding: {
              xs: "2rem 1.5rem",
              md: "2rem 3.5rem",
            },
          }}
        >
          {selectedTemplate == null && (
            <Box>
              <Grid container spacing={2}>
                {templates.map((item, index) => (
                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                      md: 4,
                    }}
                  >
                    <Card variant="outlined">
                      <CardActionArea
                        onClick={() => handleTemplateItemClick(index)}
                      >
                        <CardContent>
                          <Typography fontWeight={500}>{item.title}</Typography>
                          <Typography variant="body2">
                            {item.description}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {selectedTemplate == 0 && (
            <Box
              sx={{
                padding: "2.5rem 2rem",
                border: "1px solid #D9D9D9",
                borderRadius: "3px",
              }}
            >
              <Box mb={3}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="h5" fontWeight="600">
                    Kanban
                  </Typography>
                  <UiButtonIcon
                    size="small"
                    title="Close Template"
                    onClick={() => handleTemplateItemClick(null)}
                  >
                    <CloseOutlinedIcon fontSize="small" />
                  </UiButtonIcon>
                </Box>
                <Typography variant="body2">
                  Kanban is a workflow management method centered on making work
                  visible and understandable. By representing tasks on a visual
                  board—typically divided into stages such as To Do, In
                  Progress, and Done—teams gain immediate insight into the
                  status of every item. This visualization reduces ambiguity,
                  clarifies responsibilities, and ensures that everyone shares
                  the same understanding of current priorities and progress.
                </Typography>
              </Box>
              <Box display="flex" flexDirection="column" gap={1} mb={3}>
                <UiFormGroup
                  id="name"
                  size="extraSmall"
                  placeholder="Project Name"
                  helperText="Use a unique and descriptive project name. Duplicate names are not allowed."
                  error={nameAvailable?.reason}
                  onChange={handleChange}
                >
                  Project Name
                </UiFormGroup>

                <UiFormGroup
                  id="description"
                  size="extraSmall"
                  placeholder="Description"
                  helperText="Keep it concise. Use up to 250 characters to explain what this project is about."
                  error={validationError?.description}
                  onChange={handleChange}
                >
                  Description
                </UiFormGroup>
              </Box>

              <Box mb={3}>
                <Typography variant="h5" fontWeight="600" mb={2}>
                  Limiting Work in Progress (WIP)
                </Typography>
                <Typography variant="body2">
                  A core principle of Kanban is limiting Work in Progress (WIP).
                  By setting explicit limits on how many tasks can be handled at
                  each stage, teams prevent overload and reduce context
                  switching. This constraint exposes bottlenecks early,
                  encourages focus, and promotes smoother flow across the
                  system. Instead of starting more work, teams prioritize
                  finishing what has already been initiated, which leads to
                  shorter cycle times and improved throughput.
                </Typography>
              </Box>

              <Box mb={5}>
                <Typography variant="h5" fontWeight="600" mb={2}>
                  Continuous Improvement and Flexibility
                </Typography>
                <Typography variant="body2">
                  Kanban promotes incremental and continuous improvement rather
                  than radical process changes. Because work items flow
                  continuously, teams can adapt to shifting priorities without
                  disrupting the entire system. Metrics such as lead time and
                  cycle time provide data-driven insights for optimization. As a
                  result, Kanban fosters transparency, adaptability, and
                  sustained efficiency throughout the development lifecycle.
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  gap: 1,
                }}
              >
                <UiButton onClick={create} loading={loading}>
                  Use template
                </UiButton>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Dialog>
  );
}
