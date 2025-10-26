#!/bin/bash

# BizEye Analytics Dashboard v0.2.0 - Linux/Mac Setup Script
# This script sets up the complete development environment

echo "🚀 BizEye Analytics Dashboard v0.2.0 - Setup Script"
echo "=================================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    echo "   Visit: https://www.python.org/downloads/"
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"
echo ""

# Navigate to backend directory
echo "📁 Setting up backend environment..."
cd back-end

# Create virtual environment
echo "🔧 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "⚡ Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "📦 Upgrading pip..."
pip install --upgrade pip

# Install requirements
echo "📥 Installing required packages..."
echo "   This may take a few minutes for first-time setup..."
pip install -r requirements.txt

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "🎯 Next steps:"
echo "   1. Run: ./start.sh"
echo "   2. Open: http://localhost:3000 (Frontend)"
echo "   3. Backend API: http://localhost:5000"
echo ""
echo "📚 For detailed instructions, see README.md"
echo "📄 For technical documentation, see BizEye_Complete_Technical_Guide_v0.2.0.pdf"
echo ""
echo "🎉 Welcome to BizEye Analytics Dashboard!"
