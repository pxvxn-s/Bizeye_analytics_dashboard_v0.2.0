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

// Prediction Service for API Integration
// Connected to real ML backend API endpoints

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

class PredictionService {
  /**
   * Get sales forecast predictions
   * API: GET /api/predictions/sales-forecast
   * Request: { timeRange: string, category: string, days_ahead: number }
   * Response: { predictions: array, confidence_intervals: array, model_accuracy: number }
   */
  async getSalesForecast(params) {
    try {
      const queryParams = new URLSearchParams();
      if (params.timeRange) queryParams.append('days_ahead', this._getDaysFromTimeRange(params.timeRange));
      if (params.category) queryParams.append('category', params.category);
      
      const response = await fetch(`${API_BASE_URL}/predictions/sales-forecast?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching sales forecast:", error);
      throw error;
    }
  }

  /**
   * Get category performance predictions
   * API: GET /api/predictions/demand-forecast
   * Request: { category: string, timeRange: string }
   * Response: { category_predictions: object, top_categories: array }
   */
  async getCategoryPerformance(params) {
    try {
      const queryParams = new URLSearchParams();
      if (params.timeRange) queryParams.append('days_ahead', this._getDaysFromTimeRange(params.timeRange));
      if (params.category) queryParams.append('category', params.category);
      
      const response = await fetch(`${API_BASE_URL}/predictions/demand-forecast?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching category performance:", error);
      throw error;
    }
  }

  /**
   * Get inventory optimization recommendations
   * API: GET /api/predictions/inventory-recommendations
   * Request: { category: string }
   * Response: { inventory_metrics: object, products_analysis: array, recommendations: object }
   */
  async getInventoryRecommendations(params) {
    try {
      const queryParams = new URLSearchParams();
      if (params.category) queryParams.append('category', params.category);
      
      const response = await fetch(`${API_BASE_URL}/predictions/inventory-recommendations?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching inventory recommendations:", error);
      throw error;
    }
  }

  /**
   * Get customer churn prediction analysis
   * API: GET /api/predictions/churn-analysis
   * Response: { churn_analysis: array, high_risk_products: array, summary: object }
   */
  async getChurnAnalysis(params) {
    try {
      const response = await fetch(`${API_BASE_URL}/predictions/churn-analysis`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching churn analysis:", error);
      throw error;
    }
  }

  /**
   * Get price optimization recommendations
   * API: GET /api/predictions/price-optimization
   * Request: { category: string }
   * Response: { price_analysis: array, high_impact_opportunities: array }
   */
  async getPriceOptimization(params) {
    try {
      const queryParams = new URLSearchParams();
      if (params.category) queryParams.append('category', params.category);
      
      const response = await fetch(`${API_BASE_URL}/predictions/price-optimization?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching price optimization:", error);
      throw error;
    }
  }

  /**
   * Get comprehensive risk assessment
   * API: GET /api/predictions/risk-assessment
   * Response: { risks: array, risk_summary: object, mitigation_priorities: array }
   */
  async getRiskAnalysis(params) {
    try {
      const response = await fetch(`${API_BASE_URL}/predictions/risk-assessment`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching risk analysis:", error);
      throw error;
    }
  }

  /**
   * Get AI insights and recommendations
   * API: GET /api/predictions/comprehensive-analysis
   * Request: { category: string }
   * Response: { sales_forecast: object, demand_prediction: object, inventory_recommendations: object, ... }
   */
  async getAIInsights(params) {
    try {
      const queryParams = new URLSearchParams();
      if (params.category) queryParams.append('category', params.category);
      
      const response = await fetch(`${API_BASE_URL}/predictions/comprehensive-analysis?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      throw error;
    }
  }

  /**
   * Refresh all predictions
   * API: POST /api/predictions/refresh
   * Response: { status: string, timestamp: string, model_accuracy: number }
   */
  async refreshPredictions(force = false) {
    try {
      const response = await fetch(`${API_BASE_URL}/predictions/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ force })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data;
    } catch (error) {
      console.error("Error refreshing predictions:", error);
      throw error;
    }
  }

  /**
   * Mitigate a specific risk
   * API: POST /api/predictions/risks/{riskId}/mitigate
   * Request: { action: string, priority: string }
   * Response: { status: string, mitigationId: string }
   */
  async mitigateRisk(riskId, action) {
    try {
      const response = await fetch(`${API_BASE_URL}/predictions/risks/${riskId}/mitigate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data;
    } catch (error) {
      console.error("Error mitigating risk:", error);
      throw error;
    }
  }

  /**
   * Helper method to convert time range to days
   */
  _getDaysFromTimeRange(timeRange) {
    const timeRangeMap = {
      '3months': 90,
      '6months': 180,
      '1year': 365,
      '30days': 30,
      '60days': 60,
      '90days': 90
    };
    return timeRangeMap[timeRange] || 30;
  }

  /**
   * Get prediction status and health check
   */
  async getPredictionStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/predictions/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        return {
          status: 'offline',
          message: 'Prediction service unavailable',
          lastUpdate: null
        };
      }
      
      return await response.json();
    } catch (error) {
      return {
        status: 'offline',
        message: 'Prediction service unavailable',
        lastUpdate: null
      };
    }
  }
}

// Export singleton instance
export const predictionService = new PredictionService();

/**
 * USAGE EXAMPLES:
 * 
 * // Get sales forecast for next 3 months
 * const forecast = await predictionService.getSalesForecast({
 *   timeRange: '3months',
 *   category: 'Electronics'
 * });
 * 
 * // Get inventory recommendations
 * const inventory = await predictionService.getInventoryRecommendations({
 *   category: 'Electronics'
 * });
 * 
 * // Get comprehensive analysis
 * const analysis = await predictionService.getAIInsights({
 *   category: 'all'
 * });
 * 
 * // Refresh predictions
 * const refresh = await predictionService.refreshPredictions(true);
 */
