import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { isAxiosError } from "axios";
import { signIn } from "../../api/auth.service";
import { StorageKeys } from "../../constants";
import { isAuthorized } from "../../utils";

const theme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();
  const [inProgress, setInProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (isAuthorized()) {
      navigate("/");
    }
  });

  const handleSubmit = async (event) => {
    setInProgress(true);
    setErrorMessage(null);
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    try {
      const { sessionId } = await signIn(data.get("email"));
      localStorage.setItem(StorageKeys.LoginSession, sessionId);

      navigate("/signin/mfa");
    } catch (error) {
      if (isAxiosError(error) && error.response.status === 401) {
        setErrorMessage("You're not authorized to sign-in");
      }
      setInProgress(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              error={!!errorMessage}
              helperText={errorMessage}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={inProgress}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
