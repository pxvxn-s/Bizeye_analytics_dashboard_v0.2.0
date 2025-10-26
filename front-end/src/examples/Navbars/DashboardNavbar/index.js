/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
*/

import { useState, useEffect, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import Breadcrumbs from "examples/Breadcrumbs";

import { logout, isAuthenticated } from "utils/auth";
import apiService from "services/apiService";

import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

import { useMaterialUIController, setTransparentNavbar, setMiniSidenav, setOpenConfigurator } from "context";

function DashboardNavbar({ absolute, light, isMini, onDatasetUploaded }) {
  const navigate = useNavigate();
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;

  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [scrapeDialogOpen, setScrapeDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const scrapeUrlRef = useRef(null);
  const route = useLocation().pathname.split("/").slice(1);

  useEffect(() => {
    if (fixedNavbar) setNavbarType("sticky");
    else setNavbarType("static");

    const handleTransparentNavbar = () => {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    };

    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();

    return () => {
      window.removeEventListener("scroll", handleTransparentNavbar);
    };
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleLogout = () => {
    logout();
    navigate("/authentication/sign-in");
  };

  const handleRemoveDataset = async () => {
    try {
      setLoading(true);
      await apiService.clearDataset();
      if (onDatasetUploaded) onDatasetUploaded();
      alert("Dataset removed successfully!");
    } catch (error) {
      console.error("Error removing dataset:", error);
      alert("Failed to remove dataset. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const response = await apiService.uploadDataset(file);
      if (response.status === "success") {
        alert(`Uploaded successfully: ${response.records} records.`);
        setImportDialogOpen(false);
        if (onDatasetUploaded) onDatasetUploaded();
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Failed to upload dataset.");
    } finally {
      setLoading(false);
    }
  };

  const handleScrapeData = async () => {
    const url = scrapeUrlRef.current?.value;
    if (!url) {
      alert("Please enter a valid product URL.");
      return;
    }
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // simulate
      alert("Product reviews scraped successfully!");
      setScrapeDialogOpen(false);
    } catch (err) {
      alert("Failed to scrape data.");
    } finally {
      setLoading(false);
    }
  };

  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;
      if (transparentNavbar && !light) colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
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

          {!isMini && (
            <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
              <MDBox pr={1} display="flex" alignItems="center" gap={1}>
                <MDButton variant="outlined" color="info" onClick={() => setImportDialogOpen(true)} disabled={loading}>
                  Import dataset
                </MDButton>
                <MDButton variant="outlined" color="error" onClick={handleRemoveDataset} disabled={loading}>
                  Remove dataset
                </MDButton>
                <MDButton variant="outlined" color="info" onClick={() => setScrapeDialogOpen(true)} disabled={loading}>
                  Web scrape product feedback
                </MDButton>
              </MDBox>

              <MDBox color={light ? "white" : "inherit"}>
                {!isAuthenticated() && (
                  <Link to="/authentication/sign-in">
                    <IconButton sx={navbarIconButton} size="small" disableRipple>
                      <Icon sx={iconsStyle}>account_circle</Icon>
                    </IconButton>
                  </Link>
                )}
                <IconButton size="small" disableRipple color="inherit" sx={navbarMobileMenu} onClick={handleMiniSidenav}>
                  <Icon sx={iconsStyle}>{miniSidenav ? "menu_open" : "menu"}</Icon>
                </IconButton>
                <IconButton size="small" disableRipple color="inherit" sx={navbarIconButton} onClick={handleConfiguratorOpen}>
                  <Icon sx={iconsStyle}>settings</Icon>
                </IconButton>
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
            <TextField ref={scrapeUrlRef} fullWidth label="Product URL" placeholder="https://www.amazon.com/product-page" variant="outlined" margin="normal" />
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
    </>
  );
}

DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
  onDatasetUploaded: PropTypes.func,
};

export default DashboardNavbar;