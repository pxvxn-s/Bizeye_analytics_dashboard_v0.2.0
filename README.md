# Bizeye Project - Sales Performance & Sentiment Analysis Dashboard

A comprehensive dashboard for analyzing sales performance and customer sentiment from product reviews.

## Features

### Sales Performance
- **Sales Performance Over Time**: Line chart showing historical sales trends
- **Sales Performance Comparison**: Bar chart comparing historical vs recent performance
- **Quarterly Analysis**: Detailed quarterly breakdown with growth percentages
- **Category Filtering**: Filter data by product categories

### Sentiment Analysis
- **Product Reviews Cards**: Four cards showing Positive, Neutral, Negative, and Total Reviews
- **Interactive Pie Chart**: Beautiful pie chart with category-based filtering
- **Product Review Table**: Detailed table with sorting and filtering capabilities
- **Real-time Updates**: All charts and data update based on selected categories

## Quick Start

### Option 1: Use Startup Scripts (Recommended)
```bash
# Linux/Mac
./start.sh

# Windows
start.bat
```

### Option 2: Manual Setup

#### Prerequisites
- Python 3.8+
- Node.js 16+
- npm

### Backend Setup
```bash
cd back-end
pip install -r requirements.txt
python app.py
```
Backend will run on http://localhost:5000

### Frontend Setup
```bash
cd front-end
npm install
npm start
```
Frontend will run on http://localhost:3000

## Usage

1. **Upload Dataset**: Use the "Import Dataset" button to upload a CSV file
2. **Select Category**: Use the dropdown in the top-right to filter by category
3. **View Analytics**: All charts and data will update automatically
4. **Clear Data**: Use "Remove Dataset" to clear all data

## Dataset Format

Your CSV file should contain these columns:
- `product_id`: Unique product identifier
- `product_name`: Name of the product
- `product_category`: Category (Electronics, Clothing, etc.)
- `review_content`: Customer review text
- `sales_data`: Sales information (for sales charts)

## API Endpoints

- `GET /api/sentiment/categories` - Get available categories
- `GET /api/sentiment/analyze` - Get sentiment analysis results
- `GET /api/sentiment/reviews` - Get detailed review data
- `POST /api/data/upload` - Upload dataset
- `POST /api/data/clear` - Clear dataset

## Troubleshooting

- **Backend not starting**: Check if port 5000 is available
- **Frontend not loading**: Check if port 3000 is available
- **Data not showing**: Ensure dataset is uploaded and backend is running
- **Charts not updating**: Check browser console for errors

## Project Structure

```
bizeye project/
├── front-end/                 # React frontend
│   ├── src/
│   │   └── layouts/dashboard/ # Main dashboard components
│   └── package.json
├── back-end/                  # Flask backend
│   ├── app.py                # Main Flask application
│   ├── sentimental analysis/ # Sentiment analysis module
│   └── requirements.txt
└── README.md                 # This file
```

## Recent Updates

- ✅ Fixed sentiment analysis accuracy ("very low quality" now correctly classified as negative)
- ✅ Enhanced pie chart with bigger size (380x380px)
- ✅ Added professional white backgrounds with greyish-white outer background
- ✅ Improved category filtering and real-time updates
- ✅ Added quarterly analysis with growth percentages
- ✅ Cleaned up unnecessary files and optimized project structure
- ✅ Added startup scripts for easy deployment
- ✅ Enhanced .gitignore for better version control

## Screenshots

The dashboard includes:
- **Sales Performance Charts**: Historical trends and comparisons
- **Quarterly Analysis**: Growth metrics and performance indicators
- **Sentiment Analysis Cards**: Real-time sentiment statistics
- **Interactive Pie Chart**: Beautiful visualization with category filtering
- **Product Review Table**: Comprehensive data with sorting and filtering

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

---

**Note**: Make sure both backend and frontend are running for full functionality!

**Need Help?** Check the troubleshooting section above or create an issue in the repository.# bizeye-analytics-dashboard
