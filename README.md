# BIZEYE - AI-Powered Business Intelligence Platform

![BIZEYE Logo](front-end/public/images/logo-ct.png)

BIZEYE is a comprehensive AI-powered business intelligence platform that provides predictive analytics, sentiment analysis, and intelligent recommendations for e-commerce businesses. Built with React frontend and Flask backend, it leverages advanced machine learning models to help businesses make data-driven decisions.

## 🚀 Features

### 📊 **Predictive Analytics**
- **Sales Forecasting**: LightGBM-powered sales predictions with category-specific analysis
- **Performance Metrics**: Real-time quarterly performance tracking and growth analysis
- **Trend Analysis**: Advanced growth percentage calculations and trend visualization

### 🤖 **AI Recommendations**
- **BERT-Based Sentiment Analysis**: Advanced customer review analysis using Hugging Face models
- **Intelligent Recommendations**: AI-generated business recommendations based on customer feedback
- **Category-Specific Insights**: Tailored recommendations for different product categories

### 📈 **Dashboard & Analytics**
- **Real-time Dashboard**: Comprehensive business metrics and KPIs
- **Interactive Charts**: Dynamic visualizations with Chart.js
- **Category Filtering**: Filter analysis by product categories
- **Data Import/Export**: Easy dataset management and analysis

### 🎯 **Key Capabilities**
- **Customer Sentiment Analysis**: Analyze customer reviews and feedback
- **Sales Performance Tracking**: Monitor sales trends and performance metrics
- **AI-Powered Insights**: Get intelligent business recommendations
- **Predictive Modeling**: Forecast future sales and business trends
- **Data Visualization**: Interactive charts and graphs for better insights

## 🛠️ Technology Stack

### **Frontend**
- **React 18** - Modern UI framework
- **Material-UI (MUI)** - Component library
- **Chart.js** - Data visualization
- **Axios** - API communication

### **Backend**
- **Flask** - Python web framework
- **Pandas** - Data manipulation and analysis
- **Scikit-learn** - Machine learning algorithms
- **Hugging Face Transformers** - Pre-trained AI models
- **LightGBM** - Gradient boosting for predictions

### **AI/ML Models**
- **DistilBERT** - Sentiment analysis (`distilbert/distilbert-base-uncased-finetuned-sst-2-english`)
- **BERT-Based Analysis** - Customer review analysis
- **Statistical Analysis Engine** - Business recommendations
- **LightGBM** - Sales forecasting

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 16+**
- **npm** or **yarn**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/bizeye.git
cd bizeye
```

### 2. Backend Setup
```bash
cd back-end
pip install -r requirements.txt
python app.py
```

### 3. Frontend Setup
```bash
cd front-end
npm install
npm start
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🪟 Windows Quick Start

### Option 1: Batch File (Recommended)
Double-click `start.bat` to start both servers automatically.

### Option 2: PowerShell Script
Right-click `start.ps1` and select "Run with PowerShell".

### Option 3: Manual Setup
```cmd
# Backend
cd back-end
python app.py

# Frontend (in new terminal)
cd front-end
npm start
```

## 📁 Project Structure

```
bizeye/
├── back-end/                    # Flask backend
│   ├── app.py                  # Main Flask application
│   ├── Sentiment_analysis_original.py  # Hugging Face sentiment analysis
│   ├── requirements.txt        # Python dependencies
│   └── online_sales&reviews_dataset.csv  # Sample dataset
├── front-end/                   # React frontend
│   ├── src/
│   │   ├── layouts/
│   │   │   ├── dashboard/      # Main dashboard
│   │   │   └── predictive-analysis/  # AI analytics
│   │   ├── components/         # Reusable components
│   │   └── services/           # API services
│   ├── public/                 # Static assets
│   └── package.json           # Node.js dependencies
├── start.bat                   # Windows startup script
├── start.ps1                   # Windows PowerShell startup script
└── README.md                   # This file
```

## 🔧 API Endpoints

### **Data Management**
- `POST /api/upload` - Upload dataset
- `GET /api/data/status` - Check dataset status
- `DELETE /api/data/clear` - Clear dataset

### **Analytics**
- `GET /api/sales/chart-data` - Sales chart data
- `GET /api/unified-analysis` - Comprehensive analysis
- `GET /api/sentiment/categories` - Sentiment categories

### **AI Recommendations**
- `GET /api/intelligent/recommendations` - AI recommendations
- `GET /api/ai/recommendations` - Statistical recommendations

### **Predictive Analysis**
- `GET /api/predictions/sales-forecast` - Sales forecasting
- `GET /api/predictive/insights` - AI insights

## 📊 Sample Dataset

The project includes a sample dataset (`online_sales&reviews_dataset.csv`) with the following columns:
- `product_id` - Unique product identifier
- `product_name` - Product name
- `product_category` - Product category
- `review_text` - Customer review text
- `rating` - Customer rating (1-5)
- `date` - Transaction date
- `Total Revenue` - Revenue amount
- `Units Sold` - Number of units sold

## 🎯 Usage Guide

### **1. Upload Dataset**
- Click "Import Dataset" in the header
- Upload a CSV file with the required columns
- Wait for data processing to complete

### **2. View Dashboard**
- Navigate to Dashboard to see sales performance
- Use category filters to analyze specific products
- View quarterly performance and metrics

### **3. Predictive Analysis**
- Go to Predictive Analysis page
- View AI recommendations and insights
- Analyze predicted future sales
- Review customer sentiment analysis

### **4. AI Recommendations**
- View intelligent recommendations based on customer feedback
- See category-specific suggestions
- Track recommendation impact

## 🔒 Environment Variables

Create a `.env` file in the `back-end` directory:

```env
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here
```

## 🧪 Testing

### **Backend Testing**
```bash
cd back-end
python -m pytest tests/
```

### **Frontend Testing**
```bash
cd front-end
npm test
```

## 📈 Performance

- **Dataset Processing**: Handles datasets up to 100K+ records
- **Real-time Analysis**: Sub-second response times for most queries
- **Scalable Architecture**: Modular design for easy scaling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Hugging Face** - For pre-trained sentiment analysis models
- **Material-UI** - For the component library
- **Chart.js** - For data visualization
- **LightGBM** - For gradient boosting algorithms

## 📞 Support

For support, email support@bizeye.com or create an issue in the GitHub repository.

## 🔮 Roadmap

- [ ] Real-time data streaming
- [ ] Advanced ML model integration
- [ ] Multi-language support
- [ ] Mobile application
- [ ] API rate limiting
- [ ] User authentication system

---

**Made with ❤️ by the BIZEYE Team**