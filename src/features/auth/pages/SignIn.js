import { Box, Grid, Typography, Link } from "@mui/material";
import UiFormGroup from "../../../components/UiFormGroup/UiFormGroup";
import UiButton from "../../../components/UiButton/UiButton";
import { useSignIn } from "../hooks/useSignIn";

function SignIn() {
  const { loading, validationError, handleChange, login } = useSignIn();

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
          <Box>
            <Box sx={{ marginBottom: "1rem" }}>
              <Typography color="text.primary" variant="h4" fontWeight={700}>
                Sign in to
              </Typography>
              <Typography color="primary.main" variant="h4" fontWeight={700}>
                Unnise
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{ display: "flex", flexDirection: "column", rowGap: "0.5rem" }}
          >
            <UiFormGroup 
              id="identity" 
              placeholder="Identity"
              onChange={handleChange}
              error={validationError?.identity}
            >
              Username or email address
            </UiFormGroup>
            <UiFormGroup 
              id="password" 
              type="password" 
              placeholder="Password"
              onChange={handleChange}
              error={validationError?.password}
            >
              Password
            </UiFormGroup>
            <UiButton size="large" fullWidth={true} loading={loading} onClick={login}>
              Sign In
            </UiButton>
            <Typography sx={{ textAlign: "center" }}>
              New to Unnise?{" "}
              <Link href="/" underline="hover">
                Create Account
              </Link>
            </Typography>
          </Box>
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

export default SignIn;
