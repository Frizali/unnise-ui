import { Box, Grid, Typography, Link } from "@mui/material";
import UiFormGroup from "../../../components/UiFormGroup/UiFormGroup";
import UiButton from "../../../components/UiButton/UiButton";
import { useSignUp } from "../hooks/useSignUp";

function SignUp() {
  const { loading, validationError, handleChange, register} = useSignUp();

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
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: { md: "space-between" },
              width: "100%",
            }}
          >
            <Box sx={{ marginBottom: "1rem" }}>
              <Typography color="text.primary" variant="h4" fontWeight={700}>
                Sign up to
              </Typography>
              <Typography color="primary.main" variant="h4" fontWeight={700}>
                Unnise
              </Typography>
            </Box>
            <Box
              sx={{
                textAlign: { xs: "start", md: "end" },
                marginBottom: { xs: "0.5rem", md: "0" },
              }}
            >
              <Typography>Already have an account?</Typography>
              <Link href='/signin' underline="hover">
                Sign In
              </Link>
            </Box>
          </Box>
          <Box
            sx={{ display: "flex", flexDirection: "column", rowGap: "0.5rem" }}
          >
            <UiFormGroup 
              id="email" 
              type="email" 
              placeholder="Email"
              error={validationError?.email}
              onChange={handleChange}
            >
              Email
            </UiFormGroup>
            <UiFormGroup
              id="password"
              type="password"
              placeholder="Password"
              helperText="Password must be at least 8 characters long to ensure your account remains secure and protected."
              error={validationError?.password}
              onChange={handleChange}
            >
              Password
            </UiFormGroup>
            <UiFormGroup 
              id="confirmPassword"
              type="password" 
              placeholder="Confirm Password"
              error={validationError?.confirmPassword}
              onChange={handleChange}
            >
              Confirm Password
            </UiFormGroup>
            <UiFormGroup
              id="username"
              placeholder="Username"
              helperText="Username can only contain uppercase letters, lowercase letters, and numbers without any special characters or spaces."
              error={validationError?.username}
              onChange={handleChange}
            >
              Username
            </UiFormGroup>
            <UiButton size="large" fullWidth={true} loading={loading} onClick={register}>
              Create Account
            </UiButton>
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
            Start Your Adventure with Unnise — Where Projects Turn into
            Victories
          </Typography>
          <Typography color="white" variant="subtitle1">
            Collaborate with your team, complete challenges, and earn points to
            prove your skills.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}

export default SignUp;
