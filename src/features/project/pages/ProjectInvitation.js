import { useProjectInvitation } from "../hooks/useProjectInvitation";
import { Grid, Box, Typography, Link } from "@mui/material";
import UiButton from "../../../components/UiButton/UiButton";

export function ProjectInvitation() {
  const { invitation, loading, acceptInvitation } = useProjectInvitation();

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      <Grid
        item
        size={{ xs: 12, md: 6 }}
        sx={{ padding: { xs: "0 1rem", md: "0 5rem" } }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: "100vh",
            width: "100%",
          }}
        >
          {invitation !== null && (
            <>
              <Box>
                <Box sx={{ marginBottom: "1rem", textAlign: "center" }}>
                  <Typography
                    color="text.primary"
                    variant="h4"
                    fontWeight={700}
                  >
                    Accept your invitation
                  </Typography>

                  <Typography color="text.secondary" variant="subtitle1">
                    <b>{invitation.inviter}</b> has invited you to join the
                    project <b>"{invitation.project}"</b> on our Kanban Board.
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "0.5rem",
                }}
              >
                <UiButton
                  size="large"
                  fullWidth={true}
                  loading={loading}
                  onClick={acceptInvitation}
                >
                  Accept Invitaton
                </UiButton>
              </Box>
            </>
          )}
        </Box>
      </Grid>
      <Grid
        item
        size={{ xs: false, md: 6 }}
        sx={{
          display: { xs: "none", md: "block" },
          backgroundColor: "primary.main",
          padding: { xs: "0 1rem", md: "0 5rem" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <Typography color="white" variant="h4" fontWeight={700}>
            Welcome Back to Unnise Your Journey to Project Mastery Continues
          </Typography>
          <Typography color="white" variant="subtitle1">
            Log in to track your progress, complete tasks, and climb the
            leaderboard with your team.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}
