/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Checkbox from "@mui/material/Checkbox";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { login } from "utils/auth";

function Basic() {
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [useOtpLogin, setUseOtpLogin] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [formValues, setFormValues] = useState({ emailOrPhone: "", password: "", otp: "" });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, severity: "success", message: "" });

  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const handleToggleOtpLogin = () => setUseOtpLogin((v) => !v);
  const handleChange = (field) => (e) =>
    setFormValues((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

  const validate = () => {
    const newErrors = {};
    if (!formValues.emailOrPhone.trim()) newErrors.emailOrPhone = "Email or phone is required";
    if (useOtpLogin) {
      if (!otpSent) newErrors.otp = "Send OTP first";
      if (!formValues.otp.trim()) newErrors.otp = "Enter the OTP";
    } else {
      if (!formValues.password) newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = () => {
    // TODO: Request backend to generate and send OTP to email/phone
    if (!formValues.emailOrPhone.trim()) {
      setSnackbar({ open: true, severity: "error", message: "Enter email/phone to send OTP" });
      return;
    }
    setOtpSent(true);
    setUseOtpLogin(true);
    setSnackbar({ open: true, severity: "info", message: "OTP sent (placeholder)" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      setSnackbar({ open: true, severity: "error", message: "Fix validation errors" });
      return;
    }

    // TODO: Connect to backend authentication API
    // If useOtpLogin: verify OTP server-side
    // Else: verify credentials server-side
    // Respect rememberMe for issuing refresh tokens/cookies

    setSnackbar({ open: true, severity: "success", message: "Login successful (frontend)" });
    setTimeout(() => {
      // TODO: Use backend response to set real auth state
      login();
      navigate("/dashboard");
    }, 600);
  };

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Email or phone"
                fullWidth
                value={formValues.emailOrPhone}
                onChange={handleChange("emailOrPhone")}
                error={Boolean(errors.emailOrPhone)}
                helperText={errors.emailOrPhone}
              />
            </MDBox>
            {!useOtpLogin && (
              <MDBox mb={2}>
                <MDInput
                  type="password"
                  label="Password"
                  fullWidth
                  value={formValues.password}
                  onChange={handleChange("password")}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                />
              </MDBox>
            )}
            {useOtpLogin && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <MDInput
                    type="text"
                    label={otpSent ? "Enter OTP" : "OTP (request first)"}
                    fullWidth
                    value={formValues.otp}
                    onChange={handleChange("otp")}
                    error={Boolean(errors.otp)}
                    helperText={errors.otp}
                    disabled={!otpSent}
                  />
                </Grid>
                <Grid item xs={12} sm={4} display="flex" alignItems="flex-end">
                  <MDButton variant="outlined" color="info" onClick={handleSendOtp} fullWidth>
                    {otpSent ? "Resend OTP" : "Send OTP"}
                  </MDButton>
                </Grid>
              </Grid>
            )}
            <MDBox display="flex" alignItems="center" ml={-1} mt={1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
              <MDBox ml={2} display="flex" alignItems="center">
                <Checkbox checked={useOtpLogin} onChange={handleToggleOtpLogin} />
                <MDTypography
                  variant="button"
                  color="text"
                  onClick={handleToggleOtpLogin}
                  sx={{ cursor: "pointer" }}
                >
                  Use OTP login
                </MDTypography>
              </MDBox>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="info" fullWidth>
                Sign in
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </BasicLayout>
  );
}

export default Basic;
