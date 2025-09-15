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

// @mui material components
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

function FilterPanel({ timeRange, category, onFilterChange }) {
  const handleTimeRangeChange = (event) => {
    onFilterChange(event.target.value, category);
  };

  const handleCategoryChange = (event) => {
    onFilterChange(timeRange, event.target.value);
  };

  const handleRefresh = () => {
    // TODO: Connect to prediction API here for manual refresh
    // predictionService.refreshPredictions();
    console.log("Manual refresh triggered");
  };

  return (
    <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 2, backgroundColor: "white" }}>
      <CardContent sx={{ p: 3 }}>
        <MDBox display="flex" alignItems="center" mb={2}>
          <Icon sx={{ color: "primary.main", mr: 1 }}>filter_list</Icon>
          <MDTypography variant="h6" fontWeight="bold">
            Analysis Filters
          </MDTypography>
        </MDBox>

        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: "text.primary", mb: 1 }}>Time Range</InputLabel>
              <Select
                value={timeRange}
                label="Time Range"
                onChange={handleTimeRangeChange}
                sx={{
                  borderRadius: 2,
                  backgroundColor: "white",
                  border: "1px solid #e0e0e0",
                  minHeight: "56px",
                  "& .MuiSelect-select": {
                    color: "text.primary",
                    fontWeight: "medium",
                    padding: "16px 14px",
                  },
                  "&:hover": {
                    borderColor: "error.main",
                  },
                  "&.Mui-focused": {
                    borderColor: "error.main",
                  },
                }}
              >
                <MenuItem value="3months">Last 3 Months</MenuItem>
                <MenuItem value="6months">Last 6 Months</MenuItem>
                <MenuItem value="1year">Last Year</MenuItem>
                <MenuItem value="2years">Last 2 Years</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: "text.primary", mb: 1 }}>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={handleCategoryChange}
                sx={{
                  borderRadius: 2,
                  backgroundColor: "white",
                  border: "1px solid #e0e0e0",
                  minHeight: "56px",
                  "& .MuiSelect-select": {
                    color: "text.primary",
                    fontWeight: "medium",
                    padding: "16px 14px",
                  },
                  "&:hover": {
                    borderColor: "error.main",
                  },
                  "&.Mui-focused": {
                    borderColor: "error.main",
                  },
                }}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="electronics">Electronics</MenuItem>
                <MenuItem value="clothing">Clothing</MenuItem>
                <MenuItem value="home">Home & Garden</MenuItem>
                <MenuItem value="sports">Sports</MenuItem>
                <MenuItem value="books">Books</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Icon sx={{ color: "white" }}>refresh</Icon>}
              onClick={handleRefresh}
              fullWidth
              sx={{
                borderRadius: 2,
                color: "white !important",
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: "0.875rem",
                boxShadow: 2,
                "&:hover": {
                  boxShadow: 4,
                  color: "white !important",
                },
                "& .MuiButton-startIcon": {
                  color: "white !important",
                },
              }}
            >
              Refresh Data
            </Button>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MDBox display="flex" alignItems="center" justifyContent="flex-end">
              <Icon sx={{ color: "success.main", mr: 1 }}>check_circle</Icon>
              <MDTypography variant="body2" color="text">
                Last updated: 2 min ago
              </MDTypography>
            </MDBox>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

// Setting default values for the props of FilterPanel
FilterPanel.defaultProps = {
  timeRange: "6months",
  category: "all",
};

// Typechecking props for the FilterPanel
FilterPanel.propTypes = {
  timeRange: PropTypes.string,
  category: PropTypes.string,
  onFilterChange: PropTypes.func.isRequired,
};

export default FilterPanel;
