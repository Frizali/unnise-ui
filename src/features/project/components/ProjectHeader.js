import {
  Box,
  Typography,
  Stack,
  Tabs,
  Tab,
  Dialog,
  Autocomplete,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useProjectHeader } from "../hooks/useProjectHeader";
import UiButtonIconText from "../../../components/UiButton/UiButtonIconText";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import styled from "@emotion/styled";
import UiButtonIcon from "../../../components/UiButton/UiButtonIcon";
import React from "react";

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
    "&.Mui-selected": {
      color: theme.palette.primary.main,
    },
    "&.Mui-focusVisible": {
      backgroundColor: "#d1eaff",
    },
  }),
);

export function ProjectHeader() {
  const {
    project,
    loading,
    value,
    inviteDialog,
    handleChange,
    handleInviteDialog,
  } = useProjectHeader();

  return (
    <>
      <Box
        sx={{
          padding: "0 1.25rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5" fontWeight="600">
            {project.name}
          </Typography>
          <Stack direction="row" gap={1}>
            <UiButtonIconText
              icon={<ShareOutlinedIcon fontSize="small" />}
              onClick={handleInviteDialog}
            >
              Invite
            </UiButtonIconText>
            <UiButtonIconText icon={<SettingsOutlinedIcon fontSize="small" />}>
              Settings
            </UiButtonIconText>
          </Stack>
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Project Menu"
            sx={{
              minHeight: 0,
              "& .MuiTabs-indicator": {
                height: "1px",
                borderRadius: 2,
              },
            }}
          >
            <AntTab label="Board" />
            <AntTab label="Timeline" />
            <AntTab label="Chart" />
            <AntTab label="Calendar" />
            <AntTab label="Leaderboard" />
          </Tabs>
        </Box>
      </Box>
      <Dialog open={inviteDialog}>
        <Box
          sx={{
            minWidth: "600px",
            padding: "1.5rem",
          }}
        >
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h5" fontWeight="600" color="text.primary">
              Invite to this project
            </Typography>
            <UiButtonIcon title="Close" onClick={handleInviteDialog}>
              <CloseOutlinedIcon />
            </UiButtonIcon>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Assign points for completing tasks, deadlines, and collaboration
            activities.
          </Typography>

          <Autocomplete
            sx={{
              margin: "1rem 0",
            }}
            isOptionEqualToValue={(option, value) =>
              option.title === value.title
            }
            getOptionLabel={(option) => option.title}
            options={[]}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search by username or email address"
                size="small"
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: "14px",
                  },
                }}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  },
                }}
              />
            )}
          />
        </Box>
      </Dialog>
    </>
  );
}
