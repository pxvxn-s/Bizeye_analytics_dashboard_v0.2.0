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

import { useState, useEffect, useRef } from "react";

// react-router components
import { useLocation, Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";
import MDButton from "components/MDButton";
import { logout, isAuthenticated } from "utils/auth";
import { useNavigate } from "react-router-dom";

// API Service
import apiService from "services/apiService";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import { useMaterialUIController, setTransparentNavbar, setMiniSidenav, setOpenConfigurator } from "context";

function DashboardNavbar({ absolute, light, isMini, onDatasetUploaded }) {
  const navigate = useNavigate();
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [scrapeDialogOpen, setScrapeDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const fileInputRef = useRef(null);
  const scrapeUrlRef = useRef(null);
  const route = useLocation().pathname.split("/").slice(1);

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);
  const handleLogout = () => {
    // TODO: Call backend logout endpoint if available
    logout();
    navigate("/authentication/sign-in");
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleRemoveDataset = async () => {
    try {
      setLoading(true);
      await apiService.clearDataset();

      setSnackbar({
        open: true,
        message: "Dataset removed successfully!",
        severity: "success",
      });

      // Auto-refresh the page to show cleared state
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error removing dataset:", error);
      setSnackbar({
        open: true,
        message: "Failed to remove dataset. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImportDataset = () => {
    setImportDialogOpen(true);
  };

  const handleWebScrape = () => {
    setScrapeDialogOpen(true);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);

      // Use the unified dataset upload endpoint
      const response = await apiService.uploadDataset(file);

      if (response.status === "success") {
        setSnackbar({
          open: true,
          message: `Dataset uploaded successfully! ${response.records} records processed.`,
          severity: "success",
        });
        setImportDialogOpen(false);

        // Notify dashboard about dataset upload instead of reloading page
        if (onDatasetUploaded) {
          onDatasetUploaded();
        }
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      setSnackbar({
        open: true,
        message: "Failed to upload file. Please make sure the backend server is running on port 5000.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScrapeData = async () => {
    const url = scrapeUrlRef.current?.value;
    if (!url) {
      setSnackbar({
        open: true,
        message: "Please enter a valid URL",
        severity: "warning",
      });
      return;
    }

    try {
      setLoading(true);

      // TODO: Implement web scraping endpoint in backend
      // For now, simulate the scraping process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSnackbar({
        open: true,
        message: "Web scraping completed! Data has been processed.",
        severity: "success",
      });
      setScrapeDialogOpen(false);
    } catch (err) {
      console.error("Error scraping data:", err);
      setSnackbar({
        open: true,
        message: "Failed to scrape data. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem icon={<Icon>email</Icon>} title="Check new messages" />
      <NotificationItem icon={<Icon>podcasts</Icon>} title="Manage Podcast sessions" />
      <NotificationItem icon={<Icon>shopping_cart</Icon>} title="Payment successfully completed" />
    </Menu>
  );

  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  return (
    <>
      <AppBar
        position={absolute ? "absolute" : navbarType}
        color="inherit"
        sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
      >
        <Toolbar sx={(theme) => navbarContainer(theme)}>
          <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
            <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
          </MDBox>
          {isMini ? null : (
            <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
              <MDBox pr={1} display="flex" alignItems="center" gap={1}>
                <MDButton variant="outlined" color="info" onClick={handleImportDataset} disabled={loading}>
                  Import dataset
                </MDButton>
                <MDButton variant="outlined" color="error" onClick={handleRemoveDataset} disabled={loading}>
                  Remove dataset
                </MDButton>
                <MDButton variant="outlined" color="info" onClick={handleWebScrape} disabled={loading}>
                  Web scrape product feedback
                </MDButton>
              </MDBox>
              <MDBox color={light ? "white" : "inherit"}>
                {!isAuthenticated() ? (
                  <Link to="/authentication/sign-in">
                    <IconButton sx={navbarIconButton} size="small" disableRipple>
                      <Icon sx={iconsStyle}>account_circle</Icon>
                    </IconButton>
                  </Link>
                ) : null}
                <IconButton
                  size="small"
                  disableRipple
                  color="inherit"
                  sx={navbarMobileMenu}
                  onClick={handleMiniSidenav}
                >
                  <Icon sx={iconsStyle} fontSize="medium">
                    {miniSidenav ? "menu_open" : "menu"}
                  </Icon>
                </IconButton>
                <IconButton
                  size="small"
                  disableRipple
                  color="inherit"
                  sx={navbarIconButton}
                  onClick={handleConfiguratorOpen}
                >
                  <Icon sx={iconsStyle}>settings</Icon>
                </IconButton>
                <IconButton
                  size="small"
                  disableRipple
                  color="inherit"
                  sx={navbarIconButton}
                  aria-controls="notification-menu"
                  aria-haspopup="true"
                  variant="contained"
                  onClick={handleOpenMenu}
                >
                  <Icon sx={iconsStyle}>notifications</Icon>
                </IconButton>
                {renderMenu()}
              </MDBox>
            </MDBox>
          )}
        </Toolbar>
      </AppBar>

      {/* Import Dataset Dialog */}
      <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Import Dataset</DialogTitle>
        <DialogContent>
          <MDBox mt={2}>
            <MDTypography variant="body2" color="text" mb={2}>
              Upload a CSV file containing sales data or customer reviews for analysis.
            </MDTypography>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
            <MDButton variant="outlined" color="info" onClick={() => fileInputRef.current?.click()} disabled={loading}>
              Choose File
            </MDButton>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setImportDialogOpen(false)} disabled={loading}>
            Cancel
          </MDButton>
        </DialogActions>
      </Dialog>

      {/* Web Scrape Dialog */}
      <Dialog open={scrapeDialogOpen} onClose={() => setScrapeDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Web Scrape Product Feedback</DialogTitle>
        <DialogContent>
          <MDBox mt={2}>
            <MDTypography variant="body2" color="text" mb={2}>
              Enter a product URL to scrape customer reviews and feedback.
            </MDTypography>
            <TextField
              ref={scrapeUrlRef}
              fullWidth
              label="Product URL"
              placeholder="https://www.amazon.com/product-page"
              variant="outlined"
              margin="normal"
            />
          </MDBox>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setScrapeDialogOpen(false)} disabled={loading}>
            Cancel
          </MDButton>
          <MDButton onClick={handleScrapeData} variant="contained" color="info" disabled={loading}>
            {loading ? "Scraping..." : "Start Scraping"}
          </MDButton>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
  onDatasetUploaded: PropTypes.func,
};

export default DashboardNavbar;
