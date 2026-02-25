import {
  Dialog,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import UiButtonIcon from "../../../components/UiButton/UiButtonIcon";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

export function CreateProject({
  project,
  loading,
  open,
  validationError,
  checkName,
  create,
  handleChange,
  handleOpen,
}) {
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
            padding: "12px 0",
            width: "240px",
            flexShrink: 0,
            borderRight: "1px solid #ddd",
          }}
        >
          <List sx={{ flexGrow: 1 }} disablePadding dense>
            <ListItemButton sx={{ gap: ".25rem" }} key="madeforyou">
              <ListItemText color="text.primary" primary="Made for you" />
            </ListItemButton>
          </List>
        </Box>
        <Box sx={{ flex: 1, overflow: "auto", padding: "2rem 3.5rem" }}>
          <Box>
            <Grid container spacing={2}>
              <Grid size={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography fontWeight={500}>Kanban</Typography>
                    <Typography variant="body2">
                      Work efficiently and visualize work on a board with to do,
                      doing, and done.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography fontWeight={500}>Scrum</Typography>
                    <Typography variant="body2">
                      Plan, track, and execute work using sprints and a backlog.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography fontWeight={500}>Task Tracking</Typography>
                    <Typography variant="body2">
                      Organize and track team or personal tasks.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
