import { useState, useRef, useEffect } from "react";
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
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import UiButtonIcon from "../../../components/UiButton/UiButtonIcon";
import { AvatarGroupChip } from "../../../components/Avatar/AvatarGroupChip";
import StatusSelect from "../../../components/Select/StatusSelect";
import CardTimestamp from "../../../components/Card/CardTimestamp";
import LabelGroup from "../../../components/Label/LabelGroup";
import { useCardDetail } from "../hooks/useCardDetail";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import { DifficultyVote } from "./DifficultyVote";

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    padding: ".5rem .75rem",
    minHeight: 0,
    textTransform: "none",
    fontWeight: 400,
    color: theme.palette.text.primary,
    "&:hover": { color: theme.palette.primary.main, opacity: 1 },
    "&.Mui-focusVisible": { backgroundColor: "#d1eaff" },
  }),
);

const DIFFICULTY_META = {
  Low:    { color: "#16a34a", bg: "#dcfce7", border: "#86efac", points: 3 },
  Medium: { color: "#d97706", bg: "#fef3c7", border: "#fcd34d", points: 6 },
  High:   { color: "#dc2626", bg: "#fee2e2", border: "#fca5a5", points: 10 },
};

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
    isDialogOpen,
    activeTab,
    setActiveTab,
    members,
    projectLabels,
    closeDetail,
    saveCardAssignees,
    saveCardLabels,
    DETAIL_TABS,
  } = useCardDetail({ isOpen: showDetail, setIsOpen: setShowDetail });

  const [editingField, setEditingField] = useState(null);
  const [assignees, setAssignees] = useState(card.assignees || []);
  const [labels, setLabels] = useState(card.labels || []);
  const [status, setStatus] = useState(card.columnId || null);
  const [startDate, setStartDate] = useState(card.startDate || null);
  const [dueDate, setDueDate] = useState(card.endDate || null);

  const [difficultyResult, setDifficultyResult] = useState(card.difficulty || null);

  useEffect(() => {
    setAssignees(card.assignees || []);
    setLabels(card.labels || []);
    setStatus(card.columnId || "");
    setStartDate(card.startDate || null);
    setDueDate(card.endDate || null);
  }, [card]);

  useEffect(() => {
    if (editingField && inputRef.current) inputRef.current.focus();
  }, [editingField]);

  const updateField = (field, value) => onUpdate({ ...card, [field]: value });

  const handleAssigneesChange = (_, newValue) => {
    saveCardAssignees(newValue.map((a) => a.id));
    setAssignees(newValue);
    updateField("assignees", newValue);
  };

  const handleLabelsChange = (_, newValue) => {
    saveCardLabels(newValue.map((l) => l.id));
    setLabels(newValue);
    updateField("labels", newValue);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    updateField("columnId", newStatus);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    updateField("startDate", date);
  };

  const handleDueDateChange = (date) => {
    setDueDate(date);
    updateField("endDate", date);
  };

  const handleDifficultyResult = (winnerKey) => {
    setDifficultyResult(winnerKey);
    updateField("difficulty", winnerKey);
  };
 
  const diffMeta = difficultyResult ? DIFFICULTY_META[difficultyResult] : null;
 
  const currentUserId = members?.[0]?.id ?? "current-user";

  return (
    <Dialog
      open={isDialogOpen}
      fullWidth
      maxWidth="lg"
      PaperProps={{ sx: { height: "80vh" } }}
    >
      <Box
        sx={{
          padding: "18px 0",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <DetailHeader cardId={cardId} onClose={closeDetail} />

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
              <Accordion defaultExpanded sx={accordionSx}>
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
                    <LabelsField
                      labels={labels}
                      projectLabels={projectLabels}
                      inputRef={inputRef}
                      isEditing={editingField === "labels"}
                      onEdit={() => setEditingField("labels")}
                      onBlur={() => setEditingField(null)}
                      onChange={handleLabelsChange}
                    />
                    <AssigneesField
                      assignees={assignees}
                      members={members}
                      inputRef={inputRef}
                      isEditing={editingField === "assignees"}
                      onEdit={() => setEditingField("assignees")}
                      onBlur={() => setEditingField(null)}
                      onChange={handleAssigneesChange}
                    />
                    <DetailRow label="Status">
                      <StatusSelect
                        value={status}
                        columns={columns}
                        onChange={handleStatusChange}
                      />
                    </DetailRow>
                    <DateField
                      label="Due Date"
                      value={dueDate}
                      isEditing={editingField === "endDate"}
                      onEdit={() => setEditingField("endDate")}
                      onChange={handleDueDateChange}
                      onBlur={() => setEditingField(null)}
                    />
                    <DateField
                      label="Start Date"
                      value={startDate}
                      isEditing={editingField === "startDate"}
                      onEdit={() => setEditingField("startDate")}
                      onChange={handleStartDateChange}
                      onBlur={() => setEditingField(null)}
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>


                  <Accordion
                    sx={accordionSx}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreOutlinedIcon />}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
                        <Typography color="text.primary" fontWeight={500}>
                          Difficulty
                        </Typography>

                        {diffMeta && (
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0.5,
                              padding: "2px 10px",
                              borderRadius: "20px",
                              background: diffMeta.bg,
                              border: `1px solid ${diffMeta.border}`,
                            }}
                          >
                            <Typography fontSize={12} fontWeight={700} color={diffMeta.color}>
                              {difficultyResult}
                            </Typography>
                            <Typography fontSize={11} color={diffMeta.color}>
                              · {diffMeta.points} pts
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <DifficultyVote
                        members={members}
                        card={card}
                        currentUserId={currentUserId}
                        onUpdateDifficulty={handleDifficultyResult}
                      />
                    </AccordionDetails>
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
            sx={{ padding: "0 26px", borderLeft: "1px solid #D9D9D9" }}
          >
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={activeTab}
                onChange={(_, val) => setActiveTab(val)}
                sx={{
                  minHeight: 0,
                  "& .MuiTabs-indicator": { height: "1px", borderRadius: 2 },
                }}
              >
                {DETAIL_TABS.map((tab) => (
                  <StyledTab
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

function DetailHeader({ cardId, onClose }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 26px",
        marginBottom: "1rem",
      }}
    >
      <Typography fontSize={12}>{cardId}</Typography>
      <Box sx={{ display: "flex", gap: ".5rem" }}>
        <UiButtonIcon title="More Actions" bordered={true}>
          <MoreHorizOutlinedIcon />
        </UiButtonIcon>
        <UiButtonIcon title="Close" onClick={onClose} bordered={true}>
          <CloseOutlinedIcon />
        </UiButtonIcon>
      </Box>
    </Box>
  );
}

function DetailRow({ label, children }) {
  return (
    <Grid container alignItems="center">
      <Grid item size={4.5}>
        <Typography variant="body2" color="text.primary">
          {label}
        </Typography>
      </Grid>
      <Grid
        item
        size={7.5}
        height="40px"
        sx={{ display: "flex", alignItems: "center" }}
      >
        {children}
      </Grid>
    </Grid>
  );
}

function DateField({ label, value, isEditing, onEdit, onChange, onBlur }) {
  return (
    <DetailRow label={label}>
      {isEditing ? (
        <DatePicker
          open={isEditing}
          value={value ? dayjs(value) : null}
          onChange={(newValue) => {
            const formatted = newValue ? newValue.toISOString() : null;
            onChange(formatted);
          }}
          onClose={onBlur}
          slots={{
            openPickerIcon: (props) => (
              <CalendarMonthOutlinedIcon {...props} fontSize="small" />
            ),
            clearIcon: (props) => <ClearIcon {...props} fontSize="small" />,
          }}
          sx={{
            flex: 1,
            "& .MuiPickersInputBase-root": {
              fontSize: "14px",
              minHeight: "40px",
            },
            "& .MuiPickersInputBase-input": {
              fontSize: "14px",
            },
          }}
          slotProps={{
            field: {
              clearable: true,
            },
            textField: {
              size: "small",
              autoFocus: true,
            },
          }}
        />
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "40px",
            cursor: "pointer",
          }}
          onClick={onEdit}
        >
          {value ? (
            <Typography variant="body2" color="text.primary">
              {dayjs(value).format("DD MMM YYYY")}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              None
            </Typography>
          )}
        </Box>
      )}
    </DetailRow>
  );
}

function AssigneesField({
  assignees,
  members,
  inputRef,
  isEditing,
  onEdit,
  onBlur,
  onChange,
}) {
  return (
    <Grid container alignItems="flex-start">
      <Grid item size={4.5}>
        <Box sx={{ display: "flex", alignItems: "center", minHeight: "40px" }}>
          <Typography variant="body2" color="text.primary">
            Assignees
          </Typography>
        </Box>
      </Grid>
      <Grid item size={7.5}>
        {isEditing ? (
          <Autocomplete
            multiple
            autoFocus
            openOnFocus
            disablePortal={false}
            limitTags={1}
            options={members}
            value={assignees}
            onChange={onChange}
            onBlur={onBlur}
            getOptionLabel={(o) => o.username}
            isOptionEqualToValue={(o, v) => o.id === v.id}
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
            onClick={onEdit}
          >
            {assignees.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                None
              </Typography>
            ) : (
              <AvatarGroupChip users={assignees} />
            )}
          </Box>
        )}
      </Grid>
    </Grid>
  );
}

function LabelsField({
  labels,
  projectLabels,
  inputRef,
  isEditing,
  onEdit,
  onBlur,
  onChange,
}) {
  return (
    <Grid container alignItems="flex-start">
      <Grid item size={4.5}>
        <Box sx={{ display: "flex", alignItems: "center", minHeight: "40px" }}>
          <Typography variant="body2" color="text.primary">
            Labels
          </Typography>
        </Box>
      </Grid>
      <Grid item size={7.5}>
        {isEditing ? (
          <Autocomplete
            multiple
            autoFocus
            openOnFocus
            disablePortal={false}
            limitTags={1}
            options={projectLabels}
            value={labels}
            onChange={onChange}
            onBlur={onBlur}
            getOptionLabel={(o) => o.name}
            isOptionEqualToValue={(o, v) => o.id === v.id}
            renderOption={(props, option) => {
              const { key, ...rest } = props;
              return (
                <Box
                  key={key}
                  {...rest}
                  component="li"
                  sx={{ display: "flex", gap: 1, alignItems: "center" }}
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
                sx={autocompleteInputSx}
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
            onClick={onEdit}
          >
            {labels.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                None
              </Typography>
            ) : (
              <LabelGroup labels={labels} />
            )}
          </Box>
        )}
      </Grid>
    </Grid>
  );
}

const accordionSx = {
  boxShadow: "none",
  border: "1px solid #D9D9D9",
  borderRadius: "4px",
  "&::before": { display: "none" },
  "&.Mui-expanded": { margin: 0 },
};

const autocompleteInputSx = {
  "& .MuiInputBase-input": { fontSize: "14px", height: "auto" },
  "& .MuiInputBase-root": {
    height: "auto",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "4px",
    padding: "4px 8px",
  },
};
