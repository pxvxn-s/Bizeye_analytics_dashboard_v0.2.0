/**
 * BizEye API Service
 * Handles all backend API communications
 */

const API_BASE_URL = "http://localhost:5000/api";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic API call method
  async apiCall(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    console.log(`🌐 API Call: ${url}`);
    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const config = { ...defaultOptions, ...options };

    // If body is FormData, remove Content-Type header to let browser set it
    if (config.body instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    try {
      console.log(`📡 Making request to: ${url}`);
      const response = await fetch(url, config);
      console.log(`📡 Response status: ${response.status}`);

      const data = await response.json();
      console.log(`📡 Response data:`, data);

      if (!response.ok) {
        throw new Error(data.error || "API call failed");
      }

      return data;
    } catch (error) {
      console.error(`❌ API Error for ${url}:`, error);
      throw error;
    }
  }

  // Data Management API calls
  async uploadDataset(file) {
    const formData = new FormData();
    formData.append("file", file);

    return this.apiCall("/data/upload", {
      method: "POST",
      body: formData,
    });
  }

  async loadDefaultDataset() {
    return this.apiCall("/data/load-default", {
      method: "POST",
    });
  }

  async getDataStatus() {
    console.log("Making API call to /data/status");
    const result = await this.apiCall("/data/status");
    console.log("API call result:", result);
    return result;
  }

  // Sales Analysis API calls
  async uploadSalesData(file) {
    // Use the new dataset upload endpoint
    return this.uploadDataset(file);
  }

  async generateSampleSales(productName = "Sample Product", days = 90) {
    return this.apiCall("/sales/generate-sample", {
      method: "POST",
      body: JSON.stringify({ product_name: productName, days }),
    });
  }

  async analyzeSales(category = "all") {
    const params = new URLSearchParams();
    if (category && category !== "all") params.append("category", category);

    return this.apiCall(`/sales/analyze?${params}`);
  }

  async getSalesChartData(category = "all") {
    const params = new URLSearchParams();
    if (category && category !== "all") params.append("category", category);

    return this.apiCall(`/sales/chart-data?${params}`);
  }

  async getSalesComparisonData(recentDays = 7, category = "all") {
    const params = new URLSearchParams();
    if (recentDays) params.append("recent_days", recentDays);
    if (category && category !== "all") params.append("category", category);

    return this.apiCall(`/sales/comparison-data?${params}`);
  }

  // Sentiment Analysis API calls
  async uploadSentimentData(file) {
    // Use the new dataset upload endpoint
    return this.uploadDataset(file);
  }

  async analyzeSentiment(category = "all") {
    const params = new URLSearchParams();
    if (category && category !== "all") params.append("category", category);

    return this.apiCall(`/sentiment/analyze?${params}`);
  }

  async getSentimentReviews(page = 1, perPage = 500, category = null) {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("per_page", perPage);
    if (category && category !== "all") {
      params.append("category", category);
    }

    console.log("API call with params:", params.toString());
    return this.apiCall(`/sentiment/reviews?${params}`);
  }

  async getSentimentCategories() {
    console.log("🌐 Getting sentiment categories...");
    const result = await this.apiCall("/sentiment/categories");
    console.log("📡 Categories result:", result);
    return result;
  }

  // Predictive Analysis API calls
  async getSalesForecast() {
    return this.apiCall("/predictive/forecast");
  }

  async getCategoryPerformance() {
    return this.apiCall("/predictive/category-performance");
  }

  async getPredictedRisks() {
    return this.apiCall("/predictive/risks");
  }

  async getAIInsights() {
    return this.apiCall("/predictive/insights");
  }

  // Data Management API calls
  async clearDataset() {
    return this.apiCall("/data/clear", {
      method: "POST",
    });
  }

  async loadSampleData() {
    // Load the default dataset
    return this.loadDefaultDataset();
  }

  // Health check
  async healthCheck() {
    return this.apiCall("/");
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
