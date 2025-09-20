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

function FilterPanel({ timeRange, category, onFilterChange, salesData }) {
  const handleTimeRangeChange = (event) => {
    onFilterChange(event.target.value, category);
  };

  const handleCategoryChange = (event) => {
    onFilterChange(timeRange, event.target.value);
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
          <Grid item xs={12} sm={4} md={4}>
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
                <MenuItem value="1week">Last 1 Week</MenuItem>
                <MenuItem value="1month">Last 1 Month</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
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
                {(salesData?.data_summary?.categories || ["Electronics", "Clothing", "Home Appliances", "Sports", "Books"]).map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
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
  timeRange: "1month",
  category: "all",
};

// Typechecking props for the FilterPanel
FilterPanel.propTypes = {
  timeRange: PropTypes.string,
  category: PropTypes.string,
  onFilterChange: PropTypes.func.isRequired,
  salesData: PropTypes.object,
};

export default FilterPanel;
