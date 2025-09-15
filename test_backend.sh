#!/bin/bash

echo "🚀 Starting BizEye Backend Test..."

# Kill any existing processes
pkill -f "python3 app.py" 2>/dev/null || true
sleep 2

# Start backend
cd "/home/racoon/Desktop/bizeye project/back-end"
python3 app.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Test the API
echo "Testing API..."
if curl -s http://localhost:5002 > /dev/null; then
    echo "✅ Backend is running on port 5002"
    
    # Load default dataset
    echo "Loading default dataset..."
    curl -s -X POST http://localhost:5002/api/data/load-default
    
    echo "✅ Backend setup complete!"
    echo "🌐 Backend: http://localhost:5002"
    echo "🎨 Frontend: http://localhost:3000"
    echo "📊 Dashboard: http://localhost:3000/dashboard"
    
    # Keep backend running
    wait $BACKEND_PID
else
    echo "❌ Backend failed to start"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi





