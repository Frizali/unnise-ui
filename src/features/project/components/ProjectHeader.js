import { Box, Typography, Stack, Tabs, Tab, Skeleton } from "@mui/material";
import { useProjectHeader } from "../hooks/useProjectHeader";
import UiButtonIconText from "../../../components/UiButton/UiButtonIconText";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import styled from "@emotion/styled";
import { ProjectInviteMember } from "./ProjectInviteMember";
import { useLocation, useNavigate } from "react-router-dom";

const TABS = [
  { label: "Board", value: "board" },
  { label: "Timeline", value: "timeline" },
  { label: "Chart", value: "chart" },
  { label: "Calendar", value: "calendar" },
  { label: "Leaderboard", value: "leaderboard" },
];

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
    inviteDialog,
    handleInviteDialog,
  } = useProjectHeader();
  const location = useLocation();
  const navigate = useNavigate();

  const last = location.pathname.split("/").pop();
  const validTabs = TABS.map((t) => t.value);

  const currentTab = validTabs.includes(last) ? last : "board";

  return (
    <>
      <Box
        sx={{
          padding: "0 2.25rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {loading ? (
            <Skeleton animation="wave" height={32} width="30%" />
          ) : (
            <Typography variant="h5" fontWeight="600">
              {project.name}
            </Typography>
          )}

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
            value={currentTab}
            onChange={(e, val) => navigate(val)}
            aria-label="Project Menu"
            sx={{
              minHeight: 0,
              "& .MuiTabs-indicator": {
                height: "2px",
                borderRadius: 2,
              },
            }}
          >
            {TABS.map((tab) => (
              <AntTab sx={{textTransform:"none"}} key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </Box>
      </Box>
      <ProjectInviteMember
        inviteDialog={inviteDialog}
        handleInviteDialog={handleInviteDialog}
      />
    </>
  );
}
