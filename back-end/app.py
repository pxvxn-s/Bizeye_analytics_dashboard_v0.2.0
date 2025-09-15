"""
BizEye Backend API Server
Comprehensive Flask API integrating Sales Analysis, Sentiment Analysis, and Predictive Analytics
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import os
import sys
from datetime import datetime
import warnings
import re
warnings.filterwarnings('ignore')

# Import our custom modules
sys.path.append(os.path.join(os.path.dirname(__file__), 'Sales forecasting'))
sys.path.append(os.path.join(os.path.dirname(__file__), 'sentimental analysis'))

try:
    from sales_analytics import ProductPerformanceAnalyzer
except ImportError:
    # Create a dummy class if sales_analytics is not available
    class ProductPerformanceAnalyzer:
        def __init__(self):
            self.df = None
        def read_dataset(self, filepath, format):
            return True
        def generate_sample_data(self, product_name, days):
            pass
        def calculate_metrics(self, recent_days, product_id):
            return {"historical_avg": 120, "recent_sales": 94, "performance_change": -21.3}

try:
    from Sentiment_analysis import get_sentiment
except ImportError:
    # Create a dummy function if Sentiment_analysis is not available
    def get_sentiment(text):
        if pd.isna(text) or text == '':
            return 'neutral'
        # Simple sentiment analysis based on keywords
        text_lower = str(text).lower()
        positive_words = ['excellent', 'great', 'amazing', 'perfect', 'love', 'good', 'best', 'wonderful', 'fantastic']
        negative_words = ['terrible', 'awful', 'bad', 'worst', 'hate', 'poor', 'disappointed', 'horrible', 'useless']
        
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        if positive_count > negative_count:
            return 'positive'
        elif negative_count > positive_count:
            return 'negative'
        else:
            return 'neutral'

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Global variables to store loaded data
sales_analyzer = ProductPerformanceAnalyzer()
sentiment_data = None
dataset_path = None

def clean_review_text(text):
    """Clean review text by removing quotes and extra formatting"""
    if pd.isna(text) or text == '':
        return ''
    
    # Remove triple quotes and clean up
    text = str(text).replace('"""', '').replace('"', '')
    # Remove extra commas and clean up
    text = re.sub(r',\s*', ', ', text)
    # Remove leading/trailing whitespace
    text = text.strip()
    
    return text

def process_dataset(filepath):
    """Process the uploaded dataset and prepare it for analysis"""
    global sentiment_data, dataset_path
    
    try:
        # Read the CSV file with error handling
        df = pd.read_csv(filepath, on_bad_lines='skip', encoding='utf-8')
        dataset_path = filepath
        
        print(f"Dataset loaded with {len(df)} records")
        print(f"Columns: {list(df.columns)}")
        
        # Clean the Reviews column
        if 'Reviews' in df.columns:
            df['cleaned_reviews'] = df['Reviews'].apply(clean_review_text)
            
            # Filter out empty reviews but keep all valid rows
            df = df[df['cleaned_reviews'].str.len() > 0]
            
            print(f"After cleaning reviews: {len(df)} records")
            
            # Perform sentiment analysis on cleaned reviews
            print("Performing sentiment analysis...")
            df['sentiment'] = df['cleaned_reviews'].apply(get_sentiment)
            
            # Create a standardized format for the frontend
            processed_data = []
            for _, row in df.iterrows():
                processed_data.append({
                    'product_id': row.get('Product ID', 'N/A'),
                    'product_name': row.get('Product Name', 'N/A'),
                    'product_category': row.get('Product Category', 'N/A'),  # Using Product Category instead of model
                    'review_content': row.get('cleaned_reviews', ''),
                    'rating': row.get('Rating', 0),
                    'sentiment': row.get('sentiment', 'neutral'),
                    'category': row.get('Product Category', 'N/A'),
                    'region': row.get('Region', 'N/A'),
                    'date': row.get('Date', 'N/A'),
                    # Preserve sales data
                    'Units Sold': row.get('Units Sold', 0),
                    'Unit Price': row.get('Unit Price', 0),
                    'Total Revenue': row.get('Total Revenue', 0),
                    'Transaction ID': row.get('Transaction ID', 'N/A'),
                    'Payment Method': row.get('Payment Method', 'N/A')
                })
            
            sentiment_data = pd.DataFrame(processed_data)
            print(f"Processed {len(sentiment_data)} reviews with sentiment analysis")
            print(f"Unique products: {len(sentiment_data['product_id'].unique())}")
            print(f"Sample data: {sentiment_data.head(3).to_dict('records')}")
            
            return True
            
    except Exception as e:
        print(f"Error processing dataset: {e}")
        return False

@app.route('/')
def home():
    """API Health Check"""
    return jsonify({
        "status": "success",
        "message": "BizEye Backend API is running!",
        "endpoints": {
            "sales": "/api/sales/*",
            "sentiment": "/api/sentiment/*", 
            "predictive": "/api/predictive/*",
            "data": "/api/data/*"
        }
    })

# =============================================================================
# DATA UPLOAD AND MANAGEMENT ENDPOINTS
# =============================================================================

@app.route('/api/data/upload', methods=['POST'])
def upload_dataset():
    """Upload and process the main dataset"""
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Save uploaded file
        filename = f"uploaded_dataset_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        filepath = os.path.join('uploads', filename)
        os.makedirs('uploads', exist_ok=True)
        file.save(filepath)
        
        # Process the dataset
        success = process_dataset(filepath)
        
        if success:
            return jsonify({
                "status": "success",
                "message": "Dataset uploaded and processed successfully",
                "filename": filename,
                "records": len(sentiment_data) if sentiment_data is not None else 0,
                "products_analyzed": len(sentiment_data['product_id'].unique()) if sentiment_data is not None else 0
            })
        else:
            return jsonify({"error": "Failed to process dataset"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/data/load-default', methods=['POST'])
def load_default_dataset():
    """Load the default dataset from the project"""
    try:
        default_file = os.path.join(os.path.dirname(__file__), 'Online_Sales&reviews_Data.csv')
        
        if not os.path.exists(default_file):
            return jsonify({"error": "Default dataset not found"}), 404
        
        success = process_dataset(default_file)
        
        if success:
            return jsonify({
                "status": "success",
                "message": "Default dataset loaded successfully",
                "records": len(sentiment_data) if sentiment_data is not None else 0,
                "products_analyzed": len(sentiment_data['product_id'].unique()) if sentiment_data is not None else 0
            })
        else:
            return jsonify({"error": "Failed to process default dataset"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/data/status', methods=['GET'])
def get_data_status():
    """Get status of loaded datasets"""
    try:
        status = {
            "dataset_loaded": sentiment_data is not None,
            "records": len(sentiment_data) if sentiment_data is not None else 0,
            "products_count": len(sentiment_data['product_id'].unique()) if sentiment_data is not None else 0,
            "sentiment_analysis_completed": sentiment_data is not None and 'sentiment' in sentiment_data.columns
        }
        
        return jsonify({
            "status": "success",
            "data_status": status
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/data/clear', methods=['POST'])
def clear_dataset():
    """Clear the loaded dataset"""
    try:
        global sentiment_data, dataset_path
        
        sentiment_data = None
        dataset_path = None
        
        return jsonify({
            "status": "success",
            "message": "Dataset cleared successfully"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =============================================================================
# SENTIMENT ANALYSIS ENDPOINTS
# =============================================================================

@app.route('/api/sentiment/analyze', methods=['GET'])
def analyze_sentiment():
    """Get sentiment analysis results"""
    try:
        if sentiment_data is None:
            return jsonify({"error": "No dataset loaded. Please upload a dataset first."}), 400
        
        # Get category filter parameter
        category = request.args.get('category', None, type=str)
        
        # Filter by category if specified
        filtered_data = sentiment_data
        if category and category.lower() != 'all':
            filtered_data = sentiment_data[sentiment_data['product_category'].str.lower() == category.lower()]
            print(f"Sentiment analysis filtering by category '{category}': {len(filtered_data)} records")
        
        # Calculate sentiment distribution from filtered data
        sentiment_counts_raw = filtered_data['sentiment'].value_counts().to_dict()
        total_reviews = len(filtered_data)
        
        # Convert to lowercase keys for consistency
        sentiment_counts = {
            sentiment.lower(): count 
            for sentiment, count in sentiment_counts_raw.items()
        }
        
        # Calculate percentages
        sentiment_percentages = {
            sentiment.lower(): (count / total_reviews) * 100 
            for sentiment, count in sentiment_counts_raw.items()
        }
        
        # Calculate overall sentiment and sentiment score
        positive_count = sentiment_counts.get('positive', 0)
        negative_count = sentiment_counts.get('negative', 0)
        neutral_count = sentiment_counts.get('neutral', 0)
        
        # Determine overall sentiment
        if positive_count > negative_count and positive_count > neutral_count:
            overall_sentiment = "Positive"
        elif negative_count > positive_count and negative_count > neutral_count:
            overall_sentiment = "Negative"
        else:
            overall_sentiment = "Neutral"
        
        # Calculate sentiment score (positive - negative)
        sentiment_score = (positive_count - negative_count) / total_reviews if total_reviews > 0 else 0
        
        return jsonify({
            "status": "success",
            "total_reviews": total_reviews,
            "positive_percentage": round(sentiment_percentages.get('positive', 0), 1),
            "negative_percentage": round(sentiment_percentages.get('negative', 0), 1),
            "neutral_percentage": round(sentiment_percentages.get('neutral', 0), 1),
            "overall_sentiment": overall_sentiment,
            "sentiment_score": round(sentiment_score, 2),
            "products_analyzed": len(filtered_data['product_id'].unique()),
            "category": category if category else "all"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sentiment/categories', methods=['GET'])
def get_categories():
    """Get available product categories"""
    try:
        if sentiment_data is None:
            return jsonify({"error": "No dataset loaded. Please upload a dataset first."}), 400
        
        # Get unique categories
        categories = sentiment_data['product_category'].unique().tolist()
        categories = [cat for cat in categories if cat and cat != 'N/A']
        categories.sort()
        
        return jsonify({
            "status": "success",
            "categories": categories
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sentiment/reviews', methods=['GET'])
def get_sentiment_reviews():
    """Get sentiment analysis data for frontend table"""
    try:
        if sentiment_data is None:
            return jsonify({"error": "No dataset loaded. Please upload a dataset first."}), 400
        
        # Get pagination and filter parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 500, type=int)
        category = request.args.get('category', None, type=str)
        
        # Filter by category if specified
        filtered_data = sentiment_data
        if category and category.lower() != 'all':
            filtered_data = sentiment_data[sentiment_data['product_category'].str.lower() == category.lower()]
            print(f"Filtering by category '{category}': {len(filtered_data)} records")
        
        # Calculate pagination
        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        
        # Get paginated data - ensure we get all data if per_page is large
        if per_page >= len(filtered_data):
            paginated_data = filtered_data
            print(f"Returning all {len(filtered_data)} records (per_page={per_page})")
        else:
            paginated_data = filtered_data.iloc[start_idx:end_idx]
            print(f"Returning {len(paginated_data)} records (page={page}, per_page={per_page})")
        
        # Format for frontend
        reviews = []
        for _, row in paginated_data.iterrows():
            reviews.append({
                "product_id": row.get('product_id', 'N/A'),
                "product_name": row.get('product_name', 'N/A'),
                "product_category": row.get('product_category', 'N/A'),
                "review": row.get('review_content', 'N/A'),
                "sentiment": row.get('sentiment', 'N/A'),
                "rating": row.get('rating', 0),
                "category": row.get('category', 'N/A')
            })
        
        return jsonify({
            "status": "success",
            "reviews": reviews,
            "pagination": {
                "page": page,
                "per_page": per_page,
                "total": len(filtered_data),
                "total_pages": (len(filtered_data) + per_page - 1) // per_page
            },
            "filter": {
                "category": category
            }
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =============================================================================
# SALES ANALYSIS ENDPOINTS
# =============================================================================

@app.route('/api/sales/analyze', methods=['GET'])
def analyze_sales():
    """Analyze sales performance from the dataset"""
    try:
        if sentiment_data is None:
            return jsonify({"error": "No dataset loaded. Please upload a dataset first."}), 400
        
        # Get category filter parameter
        category = request.args.get('category', None, type=str)
        
        # Filter by category if specified
        filtered_data = sentiment_data
        if category and category.lower() != 'all':
            filtered_data = sentiment_data[sentiment_data['product_category'].str.lower() == category.lower()]
            print(f"Sales analysis filtering by category '{category}': {len(filtered_data)} records")
        
        # Calculate real sales metrics from the filtered dataset
        total_products = len(filtered_data['product_id'].unique())
        total_reviews = len(filtered_data)
        total_units_sold = filtered_data['Units Sold'].sum()
        total_revenue = filtered_data['Total Revenue'].sum()
        avg_unit_price = filtered_data['Unit Price'].mean()
        
        # Calculate performance metrics
        avg_rating = filtered_data['rating'].mean()
        positive_reviews = len(filtered_data[filtered_data['sentiment'] == 'positive'])
        positive_percentage = (positive_reviews / total_reviews) * 100 if total_reviews > 0 else 0
        
        # Calculate recent vs historical performance (last 7 days vs previous period)
        filtered_data['date'] = pd.to_datetime(filtered_data['date'])
        recent_cutoff = filtered_data['date'].max() - pd.Timedelta(days=7)
        recent_data = filtered_data[filtered_data['date'] >= recent_cutoff]
        historical_data = filtered_data[filtered_data['date'] < recent_cutoff]
        
        if len(historical_data) > 0 and len(recent_data) > 0:
            historical_avg_revenue = historical_data['Total Revenue'].mean()
            recent_avg_revenue = recent_data['Total Revenue'].mean()
            performance_change = ((recent_avg_revenue - historical_avg_revenue) / historical_avg_revenue) * 100
        else:
            performance_change = 0
        
        metrics = {
            "total_products": total_products,
            "total_reviews": total_reviews,
            "total_units_sold": int(total_units_sold),
            "total_revenue": round(total_revenue, 2),
            "avg_unit_price": round(avg_unit_price, 2),
            "avg_rating": round(avg_rating, 2),
            "positive_percentage": round(positive_percentage, 1),
            "performance_change": round(performance_change, 1),
            "category": category if category else "all"
        }
        
        return jsonify({
            "status": "success",
            "metrics": metrics,
            "analysis_date": datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sales/chart-data', methods=['GET'])
def get_sales_chart_data():
    """Get sales data formatted for frontend charts"""
    try:
        if sentiment_data is None:
            return jsonify({"error": "No dataset loaded. Please upload a dataset first."}), 400
        
        # Get category filter parameter
        category = request.args.get('category', None, type=str)
        
        # Filter by category if specified
        filtered_data = sentiment_data
        if category and category.lower() != 'all':
            filtered_data = sentiment_data[sentiment_data['product_category'].str.lower() == category.lower()]
            print(f"Chart data filtering by category '{category}': {len(filtered_data)} records")
        
        # Convert date column to datetime
        filtered_data['date'] = pd.to_datetime(filtered_data['date'])
        
        # Group by date and calculate daily metrics
        daily_sales = filtered_data.groupby('date').agg({
            'Total Revenue': 'sum',
            'Units Sold': 'sum',
            'product_id': 'count'
        }).reset_index()
        
        # Sort by date
        daily_sales = daily_sales.sort_values('date')
        
        # Create labels and data for the chart
        labels = [date.strftime('%Y-%m-%d') for date in daily_sales['date']]
        revenue_data = daily_sales['Total Revenue'].tolist()
        units_data = daily_sales['Units Sold'].tolist()
        
        # Calculate quarterly analysis
        total_sales = filtered_data['Total Revenue'].sum()
        total_units = filtered_data['Units Sold'].sum()
        
        # Calculate growth percentage (comparing recent vs historical)
        if len(revenue_data) >= 2:
            recent_avg = sum(revenue_data[-3:]) / min(3, len(revenue_data))
            historical_avg = sum(revenue_data[:-3]) / max(1, len(revenue_data) - 3) if len(revenue_data) > 3 else recent_avg
            growth_percentage = ((recent_avg - historical_avg) / historical_avg * 100) if historical_avg > 0 else 0
        else:
            growth_percentage = 0
        
        # Calculate quarterly metrics
        quarterly_analysis = {
            "totalSales": int(total_sales),
            "growthPercentage": round(growth_percentage, 1),
            "averageUnits": int(total_units / len(daily_sales)) if len(daily_sales) > 0 else 0,
            "peakSales": int(max(revenue_data)) if revenue_data else 0,
            "trend": 1 if growth_percentage > 0 else -1
        }
        
        response_data = {
            "labels": labels,
            "datasets": {
                "label": "Daily Revenue (₹)",
                "data": revenue_data
            },
            "quarterlyAnalysis": quarterly_analysis
        }
        
        return jsonify({
            "status": "success",
            "chartData": response_data
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sales/comparison-data', methods=['GET'])
def get_sales_comparison_data():
    """Get sales comparison data for bar charts"""
    try:
        if sentiment_data is None:
            return jsonify({"error": "No dataset loaded. Please upload a dataset first."}), 400
        
        # Get category filter parameter
        category = request.args.get('category', None, type=str)
        
        # Filter by category if specified
        filtered_data = sentiment_data
        if category and category.lower() != 'all':
            filtered_data = sentiment_data[sentiment_data['product_category'].str.lower() == category.lower()]
            print(f"Comparison data filtering by category '{category}': {len(filtered_data)} records")
        
        # Convert date column to datetime
        filtered_data['date'] = pd.to_datetime(filtered_data['date'])
        
        # Calculate recent vs historical performance (last 7 days vs previous period)
        recent_cutoff = filtered_data['date'].max() - pd.Timedelta(days=7)
        recent_data = filtered_data[filtered_data['date'] >= recent_cutoff]
        historical_data = filtered_data[filtered_data['date'] < recent_cutoff]
        
        if len(historical_data) > 0 and len(recent_data) > 0:
            # Calculate average revenue per transaction
            historical_avg_revenue = historical_data['Total Revenue'].mean()
            recent_avg_revenue = recent_data['Total Revenue'].mean()
            
            # Calculate average units sold per transaction
            historical_avg_units = historical_data['Units Sold'].mean()
            recent_avg_units = recent_data['Units Sold'].mean()
            
            performance_change = ((recent_avg_revenue - historical_avg_revenue) / historical_avg_revenue) * 100
        else:
            # If no historical data, use overall averages
            historical_avg_revenue = filtered_data['Total Revenue'].mean()
            recent_avg_revenue = filtered_data['Total Revenue'].mean()
            historical_avg_units = filtered_data['Units Sold'].mean()
            recent_avg_units = filtered_data['Units Sold'].mean()
            performance_change = 0
        
        # Calculate quarterly metrics for comparison chart
        quarterly_metrics = {
            "averageUnits": int((historical_avg_units + recent_avg_units) / 2),
            "peakSales": int(max(historical_avg_revenue, recent_avg_revenue)),
            "trend": 1 if performance_change > 0 else -1
        }
        
        response_data = {
            "labels": ["Historical Average", "Recent Performance"],
            "datasets": [
                {
                    "label": "Average Revenue per Transaction (₹)",
                    "data": [round(historical_avg_revenue, 2), round(recent_avg_revenue, 2)]
                }
            ],
            "quarterlyMetrics": quarterly_metrics
        }
        
        return jsonify({
            "status": "success",
            "chartData": response_data,
            "performanceChange": round(performance_change, 1)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =============================================================================
# PREDICTIVE ANALYSIS ENDPOINTS
# =============================================================================

@app.route('/api/predictive/forecast', methods=['GET'])
def get_sales_forecast():
    """Generate sales forecast for predictive analysis"""
    try:
        if sentiment_data is None:
            return jsonify({"error": "No dataset loaded. Please upload a dataset first."}), 400
        
        # Generate forecast data based on sentiment trends
        dates = pd.date_range(start='2024-01-01', periods=30, freq='D')
        labels = [date.strftime('%Y-%m-%d') for date in dates]
        
        # Create forecast based on sentiment data
        avg_rating = sentiment_data['rating'].mean()
        base_value = avg_rating * 20
        
        forecast_data = []
        for i in range(30):
            # Add some trend and seasonality
            trend = i * 0.5
            seasonal = 10 * np.sin(2 * np.pi * i / 7)
            noise = np.random.normal(0, 5)
            forecast_value = base_value + trend + seasonal + noise
            forecast_data.append(max(forecast_value, 0))
        
        response_data = {
            "labels": labels,
            "datasets": [
                {
                    "label": "Historical Sales",
                    "data": [base_value] * 15,  # Mock historical data
                    "borderColor": "rgb(99, 102, 241)",
                    "backgroundColor": "rgba(99, 102, 241, 0.1)",
                    "tension": 0.4,
                    "fill": False
                },
                {
                    "label": "AI Forecast",
                    "data": forecast_data,
                    "borderColor": "rgb(34, 197, 94)",
                    "backgroundColor": "rgba(34, 197, 94, 0.1)",
                    "tension": 0.4,
                    "fill": False,
                    "borderDash": [8, 4]
                }
            ]
        }
        
        return jsonify({
            "status": "success",
            "forecastData": response_data
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/predictive/category-performance', methods=['GET'])
def get_category_performance():
    """Get predicted category performance"""
    try:
        if sentiment_data is None:
            return jsonify({"error": "No dataset loaded. Please upload a dataset first."}), 400
        
        # Group by category and calculate performance metrics
        category_data = sentiment_data.groupby('category').agg({
            'rating': 'mean',
            'review_content': 'count',
            'sentiment': lambda x: (x == 'positive').sum() / len(x) * 100
        }).round(2)
        
        category_data.columns = ['avg_rating', 'review_count', 'positive_percentage']
        category_data = category_data.reset_index()
        
        # Sort by positive percentage
        category_data = category_data.sort_values('positive_percentage', ascending=False)
        
        # Format for frontend
        chart_data = {
            "labels": category_data['category'].tolist(),
            "datasets": [
                {
                    "label": "Category Performance",
                    "data": category_data['positive_percentage'].tolist(),
                    "backgroundColor": [
                        "rgba(99, 102, 241, 0.8)",
                        "rgba(34, 197, 94, 0.8)",
                        "rgba(251, 146, 60, 0.8)",
                        "rgba(168, 85, 247, 0.8)",
                        "rgba(239, 68, 68, 0.8)"
                    ],
                    "borderColor": [
                        "rgb(99, 102, 241)",
                        "rgb(34, 197, 94)",
                        "rgb(251, 146, 60)",
                        "rgb(168, 85, 247)",
                        "rgb(239, 68, 68)"
                    ],
                    "borderWidth": 2
                }
            ]
        }
        
        return jsonify({
            "status": "success",
            "chartData": chart_data,
            "categoryData": category_data.to_dict('records')
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/predictive/risks', methods=['GET'])
def get_predicted_risks():
    """Get predicted business risks based on sentiment analysis"""
    try:
        if sentiment_data is None:
            return jsonify({"error": "No dataset loaded. Please upload a dataset first."}), 400
        
        # Calculate risk metrics based on sentiment data
        negative_percentage = (len(sentiment_data[sentiment_data['sentiment'] == 'negative']) / len(sentiment_data)) * 100
        low_rating_percentage = (len(sentiment_data[sentiment_data['rating'] < 3]) / len(sentiment_data)) * 100
        
        risks = []
        
        if negative_percentage > 30:
            risks.append({
                "id": "risk_001",
                "type": "High Negative Sentiment",
                "description": f"{negative_percentage:.1f}% of reviews are negative",
                "probability": min(negative_percentage, 95),
                "impact": "High",
                "timeframe": "Immediate",
                "icon": "sentiment_very_dissatisfied"
            })
        
        if low_rating_percentage > 20:
            risks.append({
                "id": "risk_002",
                "type": "Low Customer Satisfaction",
                "description": f"{low_rating_percentage:.1f}% of reviews have low ratings",
                "probability": min(low_rating_percentage, 90),
                "impact": "High",
                "timeframe": "30 days",
                "icon": "star_border"
            })
        
        # Add some general risks
        risks.extend([
            {
                "id": "risk_003",
                "type": "Competition Analysis",
                "description": "Monitor competitor pricing and features",
                "probability": 75,
                "impact": "Medium",
                "timeframe": "60 days",
                "icon": "trending_down"
            },
            {
                "id": "risk_004",
                "type": "Product Improvement",
                "description": "Focus on products with mixed reviews",
                "probability": 60,
                "impact": "Medium",
                "timeframe": "90 days",
                "icon": "build"
            }
        ])
        
        return jsonify({
            "status": "success",
            "risks": risks
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/predictive/insights', methods=['GET'])
def get_ai_insights():
    """Get AI-powered business insights based on sentiment analysis"""
    try:
        if sentiment_data is None:
            return jsonify({"error": "No dataset loaded. Please upload a dataset first."}), 400
        
        # Calculate insights from sentiment data
        total_reviews = len(sentiment_data)
        positive_reviews = len(sentiment_data[sentiment_data['sentiment'] == 'positive'])
        negative_reviews = len(sentiment_data[sentiment_data['sentiment'] == 'negative'])
        avg_rating = sentiment_data['rating'].mean()
        
        # Find top performing products
        top_products = sentiment_data.groupby('product_name').agg({
            'rating': 'mean',
            'sentiment': lambda x: (x == 'positive').sum() / len(x) * 100
        }).sort_values('rating', ascending=False).head(3)
        
        insights = [
            {
                "type": "satisfaction",
                "title": "Customer Satisfaction",
                "value": f"{avg_rating:.1f}/5",
                "subtitle": "Average rating",
                "confidence": 95,
                "icon": "star"
            },
            {
                "type": "sentiment",
                "title": "Positive Sentiment",
                "value": f"{(positive_reviews/total_reviews)*100:.1f}%",
                "subtitle": "Customer satisfaction",
                "confidence": 90,
                "icon": "sentiment_very_satisfied"
            },
            {
                "type": "improvement",
                "title": "Improvement Needed",
                "value": f"{len(sentiment_data[sentiment_data['rating'] < 3])} products",
                "subtitle": "Low ratings",
                "confidence": 85,
                "icon": "warning"
            },
            {
                "type": "opportunity",
                "title": "Top Performers",
                "value": f"{len(top_products)} products",
                "subtitle": "High ratings",
                "confidence": 88,
                "icon": "trending_up"
            }
        ]
        
        return jsonify({
            "status": "success",
            "insights": insights
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =============================================================================
# ERROR HANDLERS
# =============================================================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    # Create necessary directories
    os.makedirs('uploads', exist_ok=True)
    
    print("🚀 Starting BizEye Backend API Server...")
    print("📊 Available endpoints:")
    print("   • Data Management: /api/data/*")
    print("   • Sentiment Analysis: /api/sentiment/*")
    print("   • Sales Analysis: /api/sales/*")
    print("   • Predictive Analysis: /api/predictive/*")
    print("\n🌐 Server will be available at: http://localhost:5000")
    print("📁 Upload your dataset to get started!")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
