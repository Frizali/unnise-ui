import { useProjectInvitation } from "../hooks/useProjectInvitation";
import { Avatar, Box, Typography, Link } from "@mui/material";
import UiButton from "../../../components/UiButton/UiButton";
import logo from "../../../assets/logo.png";

export function ProjectInvitation() {
  const { user, invitation, loading, acceptInvitation } =
    useProjectInvitation();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      {invitation !== null && (
        <Box
          sx={{
            borderRadius: 1.5,
            maxWidth: "500px",
            padding: "3rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            border: "1px solid #D9D9D9",
          }}
        >
          <Box display="flex" justifyContent="center">
            <img
              src={logo}
              alt="Logo"
              width="70px"
              style={{ borderRadius: "3px" }}
            />
          </Box>
          <Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography color="text.primary" variant="h4" fontWeight={700}>
                Accept your invitation
              </Typography>

              <Typography color="text.secondary" variant="subtitle1">
                <b>{invitation.inviter}</b> has invited you to join the project{" "}
                <b>"{invitation.project}"</b> on our Kanban Board.
              </Typography>
            </Box>
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
          >
            <Typography variant="body2" color="text.secondary">
              You're signed in as
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Avatar sx={{ width: 36, height: 36 }} />
              <Typography variant="body2" color="text.primary">
                {user.email}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: "0.5rem",
              alignItems:"center"
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
            <Link href="/signin" underline="hover">
              <Typography variant="body2">Login with another account</Typography>
            </Link>
          </Box>
        </Box>
      )}
    </Box>
  );
}
