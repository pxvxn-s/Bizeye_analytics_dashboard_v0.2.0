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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Chart components
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

function SalesForecastChart({ data, timeRange, selectedCategory, salesData }) {
  // Generate current sales data using ACTUAL backend data
  const generateCurrentSalesData = () => {
    // Use the salesData prop which contains the actual sales information
    const salesInfo = salesData || data;
    
    console.log('🔍 SalesForecastChart - salesData:', salesData);
    console.log('🔍 SalesForecastChart - data:', data);
    console.log('🔍 SalesForecastChart - salesInfo:', salesInfo);
    
    // Check if we have category sales data
    if (!salesInfo || !salesInfo.category_sales) {
      // Fallback data when no sales data is available
      return {
        labels: ["Electronics", "Clothing", "Home Appliances", "Sports", "Books", "Beauty Products"],
        datasets: [
          {
            label: "Current Sales (₹)",
            data: [0, 0, 0, 0, 0, 0],
          },
        ],
      };
    }

    // Get actual category-wise sales from backend
    const categorySales = salesInfo.category_sales;
    const allCategories = Object.keys(categorySales);
    
    // Filter categories based on selection
    let categoriesToDisplay = allCategories;
    if (selectedCategory && selectedCategory !== "all") {
      categoriesToDisplay = allCategories.filter(cat => 
        cat.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Apply time range multiplier to actual data
    let timeMultiplier = 1;
    switch (timeRange) {
      case "1week":
        timeMultiplier = 0.25; // 25% of quarterly data
        break;
      case "1month":
        timeMultiplier = 0.33; // 33% of quarterly data
        break;
      case "3months":
        timeMultiplier = 1; // Full quarterly data
        break;
      case "6months":
        timeMultiplier = 1.5; // 150% of quarterly data (extrapolated)
        break;
      default:
        timeMultiplier = 1;
    }
    
    // Generate sales data array from ACTUAL backend data (no time multiplier for current sales)
    const salesDataArray = categoriesToDisplay.map(category => {
      const categoryData = categorySales[category];
      const actualRevenue = categoryData.total_revenue || 0;
      return Math.round(actualRevenue); // Remove timeMultiplier for current sales
    });

    // Debug: Calculate total to verify
    const totalSales = salesDataArray.reduce((sum, value) => sum + value, 0);
    console.log('🔍 SalesForecastChart - Current Sales Calculation:', {
      categoriesToDisplay,
      salesDataArray,
      totalSales,
      timeMultiplier: 'NOT APPLIED (correct for current sales)'
    });

    return {
      labels: categoriesToDisplay,
      datasets: [
        {
          label: "Current Sales (₹)",
          data: salesDataArray,
        },
      ],
    };
  };

  const chartData = generateCurrentSalesData();

  return (
    <MDBox mb={3}>
      <ReportsBarChart
        color="info"
        title="Current Sales of Product"
        description="Current sales performance across different product categories"
        date={`Sales for ${timeRange} by category`}
        chart={chartData}
      />
    </MDBox>
  );
}

SalesForecastChart.defaultProps = {
  timeRange: "3months",
  selectedCategory: "all",
};

SalesForecastChart.propTypes = {
  data: PropTypes.shape({
    category_sales: PropTypes.objectOf(PropTypes.shape({
      total_revenue: PropTypes.number,
      total_units: PropTypes.number,
      total_products: PropTypes.number,
    })),
    quarterly_analysis: PropTypes.shape({
      total_sales: PropTypes.number,
      avg_daily_sales: PropTypes.number,
      growth_percentage: PropTypes.number,
      total_units: PropTypes.number,
    }),
  }),
  timeRange: PropTypes.string,
  selectedCategory: PropTypes.string,
  salesData: PropTypes.object,
};

export default SalesForecastChart;