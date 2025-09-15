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

// Mock data for Predictive Analysis
// TODO: Replace with real API data from ML backend

export const mockPredictionData = {
  // AI Insights Cards Data
  insights: [
    {
      type: "growth",
      title: "Expected Growth",
      value: "+15.2%",
      description: "Revenue growth prediction for next quarter",
      confidence: "High",
      confidenceScore: 92,
    },
    {
      type: "risk",
      title: "High Churn Risk",
      value: "3 customers",
      description: "Customers likely to churn in next 30 days",
      confidence: "Medium",
      confidenceScore: 78,
    },
    {
      type: "opportunity",
      title: "Market Opportunity",
      value: "$2.4M",
      description: "Untapped market potential identified",
      confidence: "High",
      confidenceScore: 85,
    },
    {
      type: "warning",
      title: "Inventory Alert",
      value: "5 products",
      description: "Products at risk of stockout",
      confidence: "High",
      confidenceScore: 88,
    },
  ],

  // Sales Forecast Data
  salesForecast: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    historical: [120, 95, 160, 80, 140, 110, 90, 130, 150, 100, 85, 75],
    forecast: [null, null, null, null, null, null, null, null, null, null, 95, 110],
    confidenceUpper: [null, null, null, null, null, null, null, null, null, null, 105, 125],
    confidenceLower: [null, null, null, null, null, null, null, null, null, null, 85, 95],
  },

  // Category Performance Data
  categoryPerformance: {
    labels: ["Electronics", "Clothing", "Home", "Sports", "Books"],
    values: [85, 72, 68, 91, 45],
  },

  // Risk Analysis Data
  risks: [
    {
      id: "risk-001",
      type: "Customer Churn",
      description: "High-value customers showing decreased engagement patterns",
      probability: 85,
      impact: "High",
      timeframe: "30 days",
      icon: "person_remove",
    },
    {
      id: "risk-002",
      type: "Inventory Shortage",
      description: "Popular products running low on stock",
      probability: 72,
      impact: "Medium",
      timeframe: "14 days",
      icon: "inventory_2",
    },
    {
      id: "risk-003",
      type: "Price Competition",
      description: "Competitors reducing prices on key products",
      probability: 68,
      impact: "High",
      timeframe: "7 days",
      icon: "trending_down",
    },
    {
      id: "risk-004",
      type: "Seasonal Decline",
      description: "Expected seasonal drop in certain categories",
      probability: 55,
      impact: "Medium",
      timeframe: "60 days",
      icon: "wb_sunny",
    },
    {
      id: "risk-005",
      type: "Supply Chain",
      description: "Potential delays in supplier deliveries",
      probability: 45,
      impact: "Low",
      timeframe: "21 days",
      icon: "local_shipping",
    },
  ],
};

// Additional mock data for different time ranges and categories
export const mockDataByTimeRange = {
  "3months": {
    salesForecast: {
      labels: ["Oct", "Nov", "Dec"],
      historical: [100, 85, 75],
      forecast: [95, 110, 125],
      confidenceUpper: [105, 125, 140],
      confidenceLower: [85, 95, 110],
    },
  },
  "6months": mockPredictionData.salesForecast,
  "1year": {
    salesForecast: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      historical: [120, 95, 160, 80, 140, 110, 90, 130, 150, 100, 85, 75],
      forecast: [95, 110, 125, 140, 155, 170],
      confidenceUpper: [105, 125, 140, 155, 170, 185],
      confidenceLower: [85, 95, 110, 125, 140, 155],
    },
  },
};

export const mockDataByCategory = {
  all: mockPredictionData.categoryPerformance,
  electronics: {
    labels: ["Smartphones", "Laptops", "Tablets", "Accessories"],
    values: [92, 88, 75, 68],
  },
  clothing: {
    labels: ["Men's", "Women's", "Kids", "Accessories"],
    values: [78, 85, 72, 65],
  },
  home: {
    labels: ["Furniture", "Decor", "Kitchen", "Garden"],
    values: [65, 70, 82, 58],
  },
};
