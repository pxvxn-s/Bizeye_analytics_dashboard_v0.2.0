# BizEye - Business Intelligence Dashboard

A comprehensive business intelligence dashboard that provides sentiment analysis, sales analytics, and predictive insights for product reviews and sales data.

## Features

- **Sentiment Analysis**: Analyze customer reviews to understand product sentiment
- **Sales Analytics**: Track sales performance and trends
- **Predictive Analysis**: AI-powered forecasting and risk assessment
- **Data Import**: Upload CSV datasets for analysis
- **Real-time Dashboard**: Interactive charts and visualizations

## Quick Start

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Installation & Running

1. **Clone or download the project**
2. **Run the startup script**:
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

This will automatically:
- Install Python dependencies
- Install Node.js dependencies  
- Start the backend server (port 5000)
- Start the frontend server (port 3000)

### Manual Setup (Alternative)

**Backend Setup:**
```bash
cd back-end
pip install -r requirements.txt
python app.py
```

**Frontend Setup:**
```bash
cd front-end
npm install
npm start
```

## Usage

1. **Access the Dashboard**: Open http://localhost:3000/dashboard
2. **Import Dataset**: Click "Import dataset" button in the top-right corner
3. **Upload CSV**: Upload your sales/reviews CSV file
4. **View Analysis**: The dashboard will automatically analyze your data

## Dataset Format

Your CSV file should contain the following columns:
- `Product ID`: Unique product identifier
- `Product Name`: Name of the product
- `Product Category`: Category of the product
- `Rating`: Customer rating (1-5)
- `Reviews`: Customer review text
- `Date`: Transaction date
- `Region`: Sales region
- `Units Sold`: Number of units sold
- `Unit Price`: Price per unit
- `Total Revenue`: Total revenue for the transaction

## API Endpoints

### Data Management
- `POST /api/data/upload` - Upload dataset
- `POST /api/data/load-default` - Load default dataset
- `GET /api/data/status` - Get data status

### Sentiment Analysis
- `GET /api/sentiment/analyze` - Get sentiment analysis results
- `GET /api/sentiment/reviews` - Get paginated reviews with sentiment

### Sales Analysis
- `GET /api/sales/analyze` - Get sales metrics
- `GET /api/sales/chart-data` - Get sales chart data
- `GET /api/sales/comparison-data` - Get sales comparison data

### Predictive Analysis
- `GET /api/predictive/forecast` - Get sales forecast
- `GET /api/predictive/category-performance` - Get category performance
- `GET /api/predictive/risks` - Get predicted risks
- `GET /api/predictive/insights` - Get AI insights

## Project Structure

```
bizeye-project/
├── back-end/
│   ├── app.py                 # Main Flask application
│   ├── requirements.txt       # Python dependencies
│   ├── Online_Sales&reviews_Data.csv  # Sample dataset
│   ├── Sales forecasting/     # Sales analytics modules
│   └── sentimental analysis/  # Sentiment analysis modules
├── front-end/
│   ├── src/
│   │   ├── layouts/
│   │   │   ├── dashboard/     # Dashboard components
│   │   │   └── predictive-analysis/  # Predictive analysis components
│   │   └── services/
│   │       └── apiService.js  # API service layer
│   └── package.json
├── start.sh                   # Startup script
└── README.md
```

## Technologies Used

**Backend:**
- Flask (Python web framework)
- Pandas (Data manipulation)
- NLTK (Natural language processing)
- VADER Sentiment Analysis

**Frontend:**
- React.js
- Material-UI
- Chart.js
- Axios (HTTP client)

## Troubleshooting

**Port Already in Use:**
- Backend (port 5000): Stop any Flask applications
- Frontend (port 3000): Stop any React development servers

**Python Dependencies:**
```bash
pip install --upgrade pip
pip install -r back-end/requirements.txt
```

**Node Dependencies:**
```bash
cd front-end
npm install --legacy-peer-deps
```

**Dataset Issues:**
- Ensure CSV has proper headers
- Check that Reviews column contains text data
- Verify file encoding is UTF-8

## Support

For issues or questions:
1. Check the console logs for error messages
2. Verify all dependencies are installed
3. Ensure dataset format matches requirements
4. Check network connectivity between frontend and backend

## License

This project is for educational and demonstration purposes.