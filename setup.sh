#!/bin/bash

# BIZEYE Setup Script
# This script sets up the BIZEYE development environment

echo "🚀 Setting up BIZEYE Development Environment..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Python and Node.js are installed"

# Setup Backend
echo "📦 Setting up backend dependencies..."
cd back-end
pip3 install -r requirements.txt
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Setup Frontend
echo "📦 Setting up frontend dependencies..."
cd ../front-end
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed successfully"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

echo ""
echo "🎉 BIZEYE setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start the backend: cd back-end && python3 app.py"
echo "2. Start the frontend: cd front-end && npm start"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For more information, see README.md"
