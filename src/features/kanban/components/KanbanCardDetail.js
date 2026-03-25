import { useSearchParams } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Dialog,
  Grid,
  Typography,
} from "@mui/material";
import UiButtonIcon from "../../../components/UiButton/UiButtonIcon";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";

export function KanbanBoardDetail({ showModal }) {
  const [searchParams] = useSearchParams();

  const cardId = searchParams.get("card");

  const isOpen = showModal && !!cardId;

  return (
    <Dialog open={isOpen} fullWidth maxWidth="lg">
      <Box sx={{ padding: "18px 0" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 26px",
            marginBottom: "1rem",
          }}
        >
          <Box>
            <Typography fontSize={12}>{cardId}</Typography>
          </Box>
          <Box>
            <UiButtonIcon bordered={true}>
              <CloseOutlinedIcon />
            </UiButtonIcon>
          </Box>
        </Box>
        <Grid container>
          <Grid size={5} padding="0 26px">
            <Box mb="1rem">
              <Typography variant="h5" fontWeight={600} color="text.primary">
                Design landing page
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create initial layout and UI components for the landing page.
              </Typography>
            </Box>
            <Accordion
              sx={{
                boxShadow: "none",
                border: "1px solid #D9D9D9",
                "&::before": {
                  display: "none",
                },
                borderRadius:"4px"
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreOutlinedIcon />}>
                <Typography color="text.primary" fontWeight={500}>
                  Details
                </Typography>
              </AccordionSummary>
              <AccordionSummary>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    width: "100%",
                  }}
                >
                  <Box sx={{ display: "flex", width: "100%" }}>
                    <Box sx={{ width: "40%" }}>
                      <Typography variant="body2" color="text.primary">
                        Assignees
                      </Typography>
                    </Box>
                    <Box></Box>
                  </Box>
                  <Box sx={{ display: "flex", width: "100%" }}>
                    <Box sx={{ width: "40%" }}>
                      <Typography variant="body2" color="text.primary">
                        Labels
                      </Typography>
                    </Box>
                    <Box></Box>
                  </Box>
                  <Box sx={{ display: "flex", width: "100%" }}>
                    <Box sx={{ width: "40%" }}>
                      <Typography variant="body2" color="text.primary">
                        Due Date
                      </Typography>
                    </Box>
                    <Box></Box>
                  </Box>
                  <Box sx={{ display: "flex", width: "100%" }}>
                    <Box sx={{ width: "40%" }}>
                      <Typography variant="body2" color="text.primary">
                        Start Date
                      </Typography>
                    </Box>
                    <Box></Box>
                  </Box>
                </Box>
              </AccordionSummary>
            </Accordion>
          </Grid>
          <Grid
            size={7}
            sx={{
              padding: "0 26px",
              borderLeft: "1px solid #D9D9D9",
            }}
          >
            Right
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
}
