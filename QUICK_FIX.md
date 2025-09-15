# 🚀 BizEye - Quick Start Instructions

## The Issue You're Seeing
The frontend is running but the backend isn't connected, so you're getting:
- "No dataset available" warning
- "Failed to load sentiment analysis data" error
- Import dataset button not working

## Quick Fix (2 steps):

### Step 1: Start Backend
Open a new terminal and run:
```bash
cd "/home/racoon/Desktop/bizeye project/back-end"
python3 app.py
```

You should see:
```
🚀 Starting BizEye Backend API Server...
🌐 Server will be available at: http://localhost:5002
```

### Step 2: Load Dataset
In another terminal, run:
```bash
curl -X POST http://localhost:5002/api/data/load-default
```

## What This Fixes:
✅ Backend API will be running on port 5002
✅ Default dataset will be loaded automatically
✅ Frontend will connect to backend
✅ Sentiment analysis will work
✅ Import dataset button will work

## Alternative: Use the Startup Script
```bash
cd "/home/raon/Desktop/bizeye project"
./start.sh
```

## After Backend is Running:
1. Refresh your browser at http://localhost:3000/dashboard
2. The warning messages should disappear
3. You'll see real sentiment analysis data
4. Import dataset button will work

## Troubleshooting:
- If port 5002 is busy, the backend will show "Address already in use"
- Kill any existing Python processes: `pkill -f python3`
- Then restart the backend

The backend needs to be running for the frontend to work properly!





