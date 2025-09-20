#!/bin/bash

# BizEye Documentation Viewer
# Opens the HTML documentation in the default browser

echo "🚀 Opening BizEye Project Documentation..."
echo "📄 File: BizEye_Project_Documentation.html"
echo ""

# Check if file exists
if [ ! -f "BizEye_Project_Documentation.html" ]; then
    echo "❌ HTML documentation file not found!"
    echo "💡 Run: python3 generate_html.py"
    exit 1
fi

# Get absolute path
DOC_PATH=$(realpath "BizEye_Project_Documentation.html")

echo "📁 Location: $DOC_PATH"
echo "🌐 Opening in browser..."
echo ""

# Try to open in browser
if command -v xdg-open > /dev/null; then
    xdg-open "$DOC_PATH"
elif command -v open > /dev/null; then
    open "$DOC_PATH"
elif command -v start > /dev/null; then
    start "$DOC_PATH"
else
    echo "❌ Could not find a browser command"
    echo "💡 Please open manually: $DOC_PATH"
fi

echo ""
echo "📄 To convert to PDF:"
echo "   1. Open the HTML file in your browser"
echo "   2. Press Ctrl+P (or Cmd+P on Mac)"
echo "   3. Select 'Save as PDF' or 'Print to PDF'"
echo "   4. Choose your desired settings and save"
echo ""
echo "✅ Documentation ready for viewing and PDF conversion!"
