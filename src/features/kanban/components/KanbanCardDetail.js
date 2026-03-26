import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Autocomplete,
  Avatar,
  Box,
  Chip,
  Dialog,
  Grid,
  Typography,
  TextField,
  Tab,
  Tabs,
} from "@mui/material";
import styled from "@emotion/styled";
import UiButtonIcon from "../../../components/UiButton/UiButtonIcon";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { useCardDetail } from "../hooks/useCardDetail";
import { useState, useRef, useEffect } from "react";
import { AvatarGroupChip } from "../../../components/Avatar/AvatarGroupChip";
import StatusSelect from "../../../components/Select/StatusSelect";

const AntTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    padding: ".5rem .75rem",
    minHeight: 0,
    textTransform: "none",
    fontWeight: 400,
    color: theme.palette.text.primary,
    "&:hover": {
      color: theme.palette.primary.main,
      opacity: 1,
    },
    "&.Mui-focusVisible": {
      backgroundColor: "#d1eaff",
    },
  }),
);

export function KanbanBoardDetail({ showDetail, setShowDetail, columns }) {
  const [card] = useState({
    id: "9602348c-96d5-4e0a-abe3-b45cde9345f2",
    projectId: "47fc79ec-2d97-4605-93a8-0bc9c0e33fbe",
    columnId: "456e6c93-96b7-42d0-9668-815635d5d25c",
    title: "Design landing page",
    description:
      "Create initial layout and UI components for the landing page.",
    startDate: null,
    endDate: "2026-03-31T00:00:00",
    position: 0,
    priority: "High",
  });
  const inputRef = useRef(null);
  const {
    cardId,
    isOpen,
    TABS,
    currentTab,
    members,
    handleClose,
    setCurrentTab,
  } = useCardDetail({ showDetail, setShowDetail });
  const [isEditing, setIsEditing] = useState(false);
  const [assignees, setAssignees] = useState([]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

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
          <Box sx={{ display: "flex", gap: ".5rem" }}>
            <UiButtonIcon title={"More Actions"} bordered={true}>
              <MoreHorizOutlinedIcon />
            </UiButtonIcon>
            <UiButtonIcon title={"Close"} onClick={handleClose} bordered={true}>
              <CloseOutlinedIcon />
            </UiButtonIcon>
          </Box>
        </Box>
        <Grid container>
          <Grid size={5} padding="0 26px">
            <Box mb="1rem">
              <Typography variant="h5" fontWeight={600} color="text.primary">
                {card.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {card.description}
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: ".5rem" }}
            >
              <Accordion
                defaultExpanded
                sx={{
                  boxShadow: "none",
                  border: "1px solid #D9D9D9",
                  "&::before": {
                    display: "none",
                  },
                  "&.Mui-expanded": {
                    margin: 0,
                  },
                  borderRadius: "4px",
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreOutlinedIcon />}>
                  <Typography color="text.primary" fontWeight={500}>
                    Details
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      gap: ".5rem",
                    }}
                  >
                    {/* Assignee */}
                    <Grid container>
                      <Grid item size={4.5} alignSelf="center">
                        <Typography variant="body2" color="text.primary">
                          Assignee
                        </Typography>
                      </Grid>

                      <Grid size={7.5} item height="40px" alignSelf="center">
                        {!isEditing && assignees.length === 0 && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              height: "40px",
                            }}
                          >
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ cursor: "pointer" }}
                              onClick={() => setIsEditing(true)}
                            >
                              None
                            </Typography>
                          </Box>
                        )}

                        {!isEditing && assignees.length > 0 && (
                          <Box
                            width="100%"
                            height="40px"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            onClick={() => setIsEditing(true)}
                          >
                            <AvatarGroupChip users={assignees} />
                          </Box>
                        )}

                        {isEditing && (
                          <Autocomplete
                            multiple
                            autoFocus
                            openOnFocus
                            disablePortal={false}
                            limitTags={1}
                            options={members}
                            value={assignees}
                            onChange={(e, newValue) => setAssignees(newValue)}
                            onBlur={() => setIsEditing(false)}
                            getOptionLabel={(option) => option.username}
                            renderOption={(props, option) => {
                              const { key, ...rest } = props;

                              return (
                                <Box
                                  key={key}
                                  {...rest}
                                  component="li"
                                  sx={{
                                    display: "flex",
                                    gap: 1,
                                    alignItems: "center",
                                  }}
                                >
                                  <Avatar sx={{ width: 24, height: 24 }} />
                                  <Box sx={{ flex: 1 }}>
                                    <Typography
                                      variant="body2"
                                      color="text.primary"
                                    >
                                      {option.username}
                                    </Typography>
                                  </Box>
                                </Box>
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                inputRef={inputRef}
                                {...params}
                                placeholder="Select member"
                                size="small"
                                sx={{
                                  "& .MuiInputBase-input": {
                                    fontSize: "14px",
                                    height: "auto",
                                  },
                                }}
                              />
                            )}
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip
                                  {...getTagProps({ index })}
                                  key={option.id}
                                  avatar={
                                    <Avatar sx={{ width: 24, height: 24 }} />
                                  }
                                  label={option.username}
                                  size="small"
                                  sx={{
                                    borderRadius: "4px",
                                    fontSize: "14px",
                                    background: "transparent",
                                    "& .MuiChip-avatarSmall": {
                                      width: 24,
                                      height: 24,
                                      color: "white",
                                    },
                                  }}
                                />
                              ))
                            }
                            sx={{
                              "& .MuiAutocomplete-tag": {
                                margin: "0 3px 0 0",
                              },
                            }}
                          />
                        )}
                      </Grid>
                    </Grid>
                    {/* Labels */}
                    <Grid container>
                      <Grid item size={4.5} alignSelf="center">
                        <Typography variant="body2" color="text.primary">
                          Labels
                        </Typography>
                      </Grid>

                      <Grid size={7.5} item height="40px" alignSelf="center">
                        {/* {!isEditing && assignees.length === 0 && ( */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            height: "40px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ cursor: "pointer" }}
                            onClick={() => setIsEditing(true)}
                          >
                            None
                          </Typography>
                        </Box>
                        {/* )} */}

                        {!isEditing && assignees.length > 0 && (
                          <Box
                            width="100%"
                            height="40px"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            onClick={() => setIsEditing(true)}
                          ></Box>
                        )}

                        {/* {isEditing && (
                          <></>
                        )} */}
                      </Grid>
                    </Grid>
                    {/* Status */}
                    <Grid container>
                      <Grid item size={4.5} alignSelf="center">
                        <Typography variant="body2" color="text.primary">
                          Status
                        </Typography>
                      </Grid>

                      <Grid size={7.5} item height="40px" alignSelf="center">
                        <StatusSelect value={card.columnId} columns={columns}/>
                      </Grid>
                    </Grid>
                  </Box>
                </AccordionDetails>
              </Accordion>
              <Accordion
                sx={{
                  boxShadow: "none",
                  border: "1px solid #D9D9D9",
                  "&::before": {
                    display: "none",
                  },
                  "&.Mui-expanded": {
                    margin: 0,
                  },
                  borderRadius: "4px",
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreOutlinedIcon />}>
                  <Typography color="text.primary" fontWeight={500}>
                    Dificulty
                  </Typography>
                </AccordionSummary>
                <AccordionDetails></AccordionDetails>
              </Accordion>
            </Box>
          </Grid>
          <Grid
            size={7}
            sx={{
              padding: "0 26px",
              borderLeft: "1px solid #D9D9D9",
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={currentTab}
                onChange={(e, val) => setCurrentTab(val)}
                aria-label="Project Menu"
                sx={{
                  minHeight: 0,
                  "& .MuiTabs-indicator": {
                    height: "1px",
                    borderRadius: 2,
                  },
                }}
              >
                {TABS.map((tab) => (
                  <AntTab
                    sx={{ textTransform: "none" }}
                    key={tab.value}
                    label={tab.label}
                    value={tab.value}
                  />
                ))}
              </Tabs>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
}
