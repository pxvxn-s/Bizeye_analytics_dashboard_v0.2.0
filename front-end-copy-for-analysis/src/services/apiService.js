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
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "API call failed");
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Sales Analysis API calls
  async uploadSalesData(file) {
    // Mock successful upload for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: "success",
          message: "Sales data uploaded and processed successfully",
          filename: file.name,
          records: 150,
        });
      }, 1000);
    });
  }

  async generateSampleSales(productName = "Sample Product", days = 90) {
    return this.apiCall("/sales/generate-sample", {
      method: "POST",
      body: JSON.stringify({ product_name: productName, days }),
    });
  }

  async analyzeSales(recentDays = 7, productId = null) {
    // Mock sales analysis data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: "success",
          metrics: {
            historical_avg: 119.5,
            recent_sales: 94.2,
            performance_change: -21.3,
            total_records: 180,
          },
        });
      }, 500);
    });
  }

  async getSalesChartData(productId = null) {
    const params = new URLSearchParams();
    if (productId) params.append("product_id", productId);

    return this.apiCall(`/sales/chart-data?${params}`);
  }

  async getSalesComparisonData(recentDays = 7, productId = null) {
    const params = new URLSearchParams();
    if (recentDays) params.append("recent_days", recentDays);
    if (productId) params.append("product_id", productId);

    return this.apiCall(`/sales/comparison-data?${params}`);
  }

  // Sentiment Analysis API calls
  async uploadSentimentData(file) {
    // Mock successful upload for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: "success",
          message: "Sentiment data uploaded and processed successfully",
          filename: file.name,
          records: 200,
        });
      }, 1000);
    });
  }

  async analyzeSentiment() {
    // Mock sentiment analysis data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: "success",
          summary: {
            sentiment_percentages: {
              Positive: 45.2,
              Neutral: 32.1,
              Negative: 22.7,
            },
            total_reviews: 200,
          },
        });
      }, 500);
    });
  }

  async getSentimentReviews(page = 1, perPage = 10) {
    // Mock sentiment reviews data
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockReviews = [
          {
            product_id: "PROD001",
            product_name: "Wireless Headphones",
            model_name: "WH-2000",
            review: "Great sound quality and comfortable to wear for long periods.",
            sentiment: "positive",
          },
          {
            product_id: "PROD002",
            product_name: "Smart Watch",
            model_name: "SW-500",
            review: "Battery life could be better, but overall decent product.",
            sentiment: "neutral",
          },
          {
            product_id: "PROD003",
            product_name: "Bluetooth Speaker",
            model_name: "BS-100",
            review: "Poor sound quality and stopped working after a week.",
            sentiment: "negative",
          },
        ];

        resolve({
          status: "success",
          reviews: mockReviews,
          pagination: {
            page: page,
            total_pages: 1,
            per_page: perPage,
            total_records: mockReviews.length,
          },
        });
      }, 500);
    });
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
  async getDataStatus() {
    return this.apiCall("/data/status");
  }

  async loadSampleData() {
    // Mock sample data loading
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: "success",
          message: "Sample data loaded successfully!",
          records_loaded: 150,
        });
      }, 1000);
    });
  }

  // Health check
  async healthCheck() {
    return this.apiCall("/");
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
