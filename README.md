# Bizeye Analytics Dashboard v1.0

A comprehensive business analytics dashboard built with React and Flask, featuring sales performance analysis, sentiment analysis, and predictive analytics.

## 🚀 Features

### 📊 Sales Performance Analysis
- Interactive line charts showing sales trends over time
- Bar charts for sales comparison across categories
- Quarterly performance metrics with growth percentages
- Category-based filtering for detailed analysis

### 💭 Sentiment Analysis
- Real-time sentiment analysis of product reviews
- Interactive pie charts showing sentiment distribution
- Comprehensive review analysis table with sorting and filtering
- Category-specific sentiment insights

### 🔮 Predictive Analytics
- AI-powered sales forecasting
- Risk analysis and insights
- Category performance predictions
- Interactive charts and visualizations

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Material-UI** - Professional UI components
- **Chart.js** - Interactive data visualization
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Flask** - Python web framework
- **Pandas** - Data manipulation and analysis
- **NLTK** - Natural language processing for sentiment analysis
- **NumPy** - Numerical computing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
bizeye-project/
├── front-end/                 # React frontend application
│   ├── src/
│   │   ├── layouts/          # Page layouts and components
│   │   ├── examples/         # Reusable UI components
│   │   ├── services/         # API service layer
│   │   └── utils/            # Utility functions
│   └── package.json
├── back-end/                  # Flask backend application
│   ├── app.py                 # Main Flask application
│   ├── requirements.txt      # Python dependencies
│   ├── Sales forecasting/    # Sales analytics modules
│   └── sentimental analysis/ # Sentiment analysis modules
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bizeye-analytics-dashboard.git
   cd bizeye-analytics-dashboard
   ```

2. **Backend Setup**
   ```bash
   cd back-end
   pip install -r requirements.txt
   python app.py
   ```
   The backend will run on `http://localhost:5000`

3. **Frontend Setup**
   ```bash
   cd front-end
   npm install
   npm start
   ```
   The frontend will run on `http://localhost:3001`

### Quick Start Script
```bash
# Run both frontend and backend
./start.sh
```

## 📊 API Endpoints

### Sales Analysis
- `GET /api/sales/analysis` - Get sales analysis data
- `GET /api/sales/charts` - Get chart data
- `GET /api/sales/comparison` - Get sales comparison data

### Sentiment Analysis
- `GET /api/sentiment/reviews` - Get sentiment reviews
- `GET /api/sentiment/categories` - Get available categories
- `POST /api/sentiment/analyze` - Analyze sentiment

### Data Management
- `POST /api/upload` - Upload dataset
- `GET /api/data/status` - Check data status
- `DELETE /api/data/clear` - Clear dataset

## 🎯 Key Features

### Interactive Dashboard
- Real-time data visualization
- Category-based filtering
- Responsive design for all devices
- Modern Material Design UI

### Data Processing
- Automatic sentiment analysis using NLTK VADER
- Sales forecasting with machine learning
- Real-time data updates
- Comprehensive error handling

### User Experience
- Intuitive navigation
- Loading states and error handling
- Snackbar notifications
- Smooth animations and transitions

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend directory:
```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

### Backend Configuration
The Flask app runs on port 5000 by default. Modify `app.py` to change the port.

## 📈 Usage

1. **Upload Dataset**: Use the "Import Dataset" button to upload your sales and review data
2. **View Analytics**: Navigate through different sections to see various analytics
3. **Filter Data**: Use category dropdowns to filter data by specific categories
4. **Export Data**: Use the export functionality to download analysis results

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Material Dashboard for React components
- Chart.js for data visualization
- NLTK for sentiment analysis
- Flask community for backend framework

## 📞 Support

For support, email support@bizeye.com or create an issue in the repository.

---

**Bizeye Analytics Dashboard** - Making data-driven decisions easier! 📊✨