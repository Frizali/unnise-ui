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
import CardTimestamp from "../../../components/Card/CardTimestamp";
import LabelGroup from "../../../components/Label/LabelGroup";

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

export function KanbanBoardDetail({
  card,
  onUpdate,
  showDetail,
  setShowDetail,
  columns,
}) {
  const inputRef = useRef(null);
  const {
    cardId,
    isOpen,
    TABS,
    currentTab,
    members,
    projectLabels,
    handleClose,
    setCurrentTab,
    setCardAssignees,
    setCardLabels
  } = useCardDetail({ showDetail, setShowDetail });
  const [editingField, setEditingField] = useState(null);
  const [assignees, setAssignees] = useState(card.assignees || []);
  const [labels, setLabels] = useState(card.labels || []);
  const [status, setStatus] = useState(card.column || null);
  const [startDate, setStartDate] = useState(card.startDate || null);
  const [dueDate, setDueDate] = useState(card.endDate || null);

  useEffect(() => {
    setAssignees(card.assignees || []);
    setLabels(card.labels || []);
    setStatus(card.status || "");
    setStartDate(card.startDate || null);
    setDueDate(card.endDate || null);
  }, [card]);

  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingField]);

  const updateField = (field, value) => {
    onUpdate({ ...card, [field]: value });
  };

  const onSetAssignees = (e, newValue) => {
    setCardAssignees(newValue.map((a) => a.id));
    setAssignees(newValue);
    updateField("assignees", newValue);
  };

  const onSetLabels = (e, newValue) => {
    setCardLabels(newValue.map((l) => l.id));
    setLabels(newValue);
    updateField("labels", newValue);
  };

  const onSetStatus = (newStatus) => {
    setStatus(newStatus);
    updateField("columnId", newStatus);
  };

  const onSetStartDate = (date) => {
    setStartDate(date);
    updateField("startDate", date);
  };

  const onSetDueDate = (date) => {
    setDueDate(date);
    updateField("endDate", date);
  };

  return (
    <Dialog
      open={isOpen}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          height: "80vh",
        },
      }}
    >
      <Box
        sx={{
          padding: "18px 0",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
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
                      gap: "12px",
                    }}
                  >
                    {/* Assignee */}
                    <Grid container alignItems="flex-start">
                      <Grid item size={4.5}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            minHeight: "40px",
                            cursor: "pointer",
                          }}
                        >
                          <Typography variant="body2" color="text.primary">
                            Assignees
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid size={7.5} item>
                        {editingField == "assignees" ? (
                          <Autocomplete
                            multiple
                            autoFocus
                            openOnFocus
                            disablePortal={false}
                            limitTags={1}
                            options={members}
                            value={assignees}
                            onChange={onSetAssignees}
                            onBlur={() => setEditingField(null)}
                            getOptionLabel={(option) => option.username}
                            isOptionEqualToValue={(option, value) =>
                              option.id === value.id
                            }
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
                                  "& .MuiInputBase-root": {
                                    height: "auto",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                    gap: "4px",
                                    padding: "4px 8px",
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
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              minHeight: "40px",
                              cursor: "pointer",
                            }}
                            onClick={() => setEditingField("assignees")}
                          >
                            {assignees.length === 0 && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                None
                              </Typography>
                            )}
                            {assignees.length > 0 && (
                              <AvatarGroupChip users={assignees} />
                            )}
                          </Box>
                        )}
                      </Grid>
                    </Grid>

                    {/* Labels */}
                    <Grid container alignItems="flex-start">
                      <Grid item size={4.5}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            minHeight: "40px",
                            cursor: "pointer",
                          }}
                        >
                          <Typography variant="body2" color="text.primary">
                            Labels
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={7.5} item>
                        {editingField === "labels" ? (
                          <Autocomplete
                            multiple
                            autoFocus
                            openOnFocus
                            disablePortal={false}
                            limitTags={1}
                            options={projectLabels}
                            value={labels}
                            onChange={onSetLabels}
                            onBlur={() => setEditingField(null)}
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(option, value) =>
                              option.id === value.id
                            }
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
                                  <Box
                                    sx={{
                                      padding: "4px 10px",
                                      background: `${option.color}30`,
                                      borderRadius: "4px",
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      color={option.color}
                                      fontWeight={500}
                                    >
                                      {option.name}
                                    </Typography>
                                  </Box>
                                </Box>
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                inputRef={inputRef}
                                {...params}
                                placeholder="Select labels"
                                size="small"
                                sx={{
                                  "& .MuiInputBase-input": {
                                    fontSize: "14px",
                                    height: "auto",
                                  },
                                  "& .MuiInputBase-root": {
                                    height: "auto",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                    gap: "4px",
                                    padding: "4px 8px",
                                  },
                                }}
                              />
                            )}
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Box
                                  {...getTagProps({ index })}
                                  key={option.id}
                                  sx={{
                                    padding: "2px 8px",
                                    background: `${option.color}30`,
                                    borderRadius: "4px",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    color={option.color}
                                    fontWeight={500}
                                  >
                                    {option.name}
                                  </Typography>
                                </Box>
                              ))
                            }
                            sx={{
                              "& .MuiAutocomplete-tag": {
                                margin: "0 3px 3px 0",
                              },
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              minHeight: "40px",
                              cursor: "pointer",
                            }}
                            onClick={() => setEditingField("labels")}
                          >
                            {labels.length === 0 ? (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                None
                              </Typography>
                            ) : (
                              <LabelGroup labels={labels} />
                            )}
                          </Box>
                        )}
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
                        <StatusSelect value={card.columnId} columns={columns} onChange={onSetStatus}/>
                      </Grid>
                    </Grid>

                    {/* Due Date */}
                    <Grid container>
                      <Grid item size={4.5} alignSelf="center">
                        <Typography variant="body2" color="text.primary">
                          Due Date
                        </Typography>
                      </Grid>

                      <Grid size={7.5} item height="40px" alignSelf="center">
                        {editingField === "dueDate" ? (
                          <></>
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              height: "40px",
                              cursor: "pointer",
                            }}
                            onClick={() => setEditingField("dueDate")}
                          >
                            {dueDate === null && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                None
                              </Typography>
                            )}
                          </Box>
                        )}
                      </Grid>
                    </Grid>

                    {/* Start Date */}
                    <Grid container>
                      <Grid item size={4.5} alignSelf="center">
                        <Typography variant="body2" color="text.primary">
                          Start Date
                        </Typography>
                      </Grid>

                      <Grid size={7.5} item height="40px" alignSelf="center">
                        {editingField === "startDate" ? (
                          <></>
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              height: "40px",
                              cursor: "pointer",
                            }}
                            onClick={() => setEditingField("startDate")}
                          >
                            {assignees.length === 0 && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                None
                              </Typography>
                            )}
                          </Box>
                        )}
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
              <Box px={2}>
                <CardTimestamp
                  createdAt={card.createdAt}
                  updatedAt={card.updatedAt}
                />
              </Box>
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
