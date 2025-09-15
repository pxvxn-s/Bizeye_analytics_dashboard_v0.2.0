#!/bin/bash

# BizEye Project Startup Script
# This script starts both the backend and frontend servers

echo "🚀 Starting BizEye Project..."
echo "================================"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python3 first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use. Please stop the service using this port first."
        return 1
    fi
    return 0
}

# Check if ports are available
echo "🔍 Checking port availability..."
if ! check_port 5000; then
    echo "Backend port 5000 is busy. Please stop the service using this port."
    exit 1
fi

if ! check_port 3000; then
    echo "Frontend port 3000 is busy. Please stop the service using this port."
    exit 1
fi

# Install Python dependencies
echo "📦 Installing Python dependencies..."
cd back-end
if [ -f requirements.txt ]; then
    pip3 install -r requirements.txt
else
    echo "⚠️  requirements.txt not found. Installing basic dependencies..."
    pip3 install flask flask-cors pandas numpy nltk
fi

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
cd ../front-end
if [ -f package.json ]; then
    npm install
else
    echo "❌ package.json not found in front-end directory."
    exit 1
fi

# Start backend server
echo "🔧 Starting backend server..."
cd ../back-end
python3 app.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 5

# Start frontend server
echo "🎨 Starting frontend server..."
cd ../front-end
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ BizEye Project is starting up!"
echo "================================"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5002"
echo "📊 Dashboard: http://localhost:3000/dashboard"
echo ""
echo "📁 To upload your dataset:"
echo "   1. Go to the dashboard"
echo "   2. Click 'Import dataset' button in the top right"
echo "   3. Upload your CSV file with product reviews"
echo ""
echo "🛑 To stop the servers, press Ctrl+C"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped successfully!"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for processes
wait