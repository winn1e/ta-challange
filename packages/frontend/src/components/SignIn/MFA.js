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
import { mfa } from "../../api/auth.service";
import { StorageKeys } from "../../constants";
import { isAuthorized } from "../../utils";

const theme = createTheme();

export default function MFA() {
  const navigate = useNavigate();
  const [otpValid, setOtpValid] = useState(true);
  const [inProgress, setInProgress] = useState(false);
  const loginSessionId = localStorage.getItem(StorageKeys.LoginSession);

  useEffect(() => {
    if (isAuthorized()) {
      navigate("/");
    }

    if (!loginSessionId) {
      navigate("/signin");
    }
  });

  const handleSubmit = async (event) => {
    setInProgress(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      const { token } = await mfa(data.get("otp"), loginSessionId);
      localStorage.removeItem(StorageKeys.LoginSession);
      localStorage.setItem(StorageKeys.AuthToken, token);

      navigate("/");
    } catch (error) {
      console.log(error);

      if (isAxiosError(error)) {
        if (error.response.status === 400) {
          setOtpValid(false);
        }
      }
    }

    setInProgress(false);
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
              id="otp"
              label="One Time Password"
              name="otp"
              autoComplete="otp"
              autoFocus
              error={!otpValid}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={inProgress}
            >
              Verify
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
