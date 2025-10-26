#!/bin/bash

# BizEye Analytics Dashboard v0.2.0 - Linux/Mac Start Script
# This script starts both frontend and backend servers

echo "🚀 Starting BizEye Analytics Dashboard v0.2.0"
echo "=============================================="
echo ""

# Function to kill existing processes
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    pkill -f "python.*app.py" 2>/dev/null
    pkill -f "npm start" 2>/dev/null
    pkill -f "node.*start" 2>/dev/null
    echo "✅ Servers stopped."
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Check if setup was completed
if [ ! -d "back-end/venv" ]; then
    echo "❌ Setup not completed. Please run ./setup.sh first."
    exit 1
fi

# Start backend server
echo "🔧 Starting backend server..."
cd back-end
source venv/bin/activate
python app.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Check if backend is running
if ! curl -s http://localhost:5000/api/data/status > /dev/null; then
    echo "⚠️  Backend server may not be running properly."
    echo "   Check the backend terminal for errors."
fi

# Start frontend server
echo "🎨 Starting frontend server..."
cd front-end

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Servers started successfully!"
echo ""
echo "🌐 Access your dashboard:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo ""
echo "📊 Available API endpoints:"
echo "   • Data Management: /api/data/*"
echo "   • Sentiment Analysis: /api/sentiment/*"
echo "   • Sales Analysis: /api/sales/*"
echo "   • Unified Analysis: /api/unified-analysis"
echo "   • Intelligent Analysis: /api/intelligent/*"
echo ""
echo "🛑 Press Ctrl+C to stop all servers"
echo ""

# Wait for user to stop
wait
