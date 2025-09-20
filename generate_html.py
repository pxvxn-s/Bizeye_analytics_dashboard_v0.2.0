#!/usr/bin/env python3
"""
HTML Generator for BizEye Project Documentation
Creates a styled HTML version that can be easily converted to PDF
"""

import markdown
from pathlib import Path

def markdown_to_html(markdown_file, output_file):
    """Convert Markdown file to styled HTML"""
    
    # Read the markdown file
    with open(markdown_file, 'r', encoding='utf-8') as f:
        markdown_content = f.read()
    
    # Convert markdown to HTML
    html_content = markdown.markdown(
        markdown_content,
        extensions=[
            'markdown.extensions.tables',
            'markdown.extensions.fenced_code',
            'markdown.extensions.codehilite',
            'markdown.extensions.toc'
        ]
    )
    
    # Create styled HTML document
    styled_html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BizEye Analytics Dashboard v2.0 - Technical Documentation</title>
        <style>
            * {{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }}
            
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 40px;
                color: #333;
                background-color: #fff;
                max-width: 1200px;
                margin: 0 auto;
            }}
            
            .document-header {{
                text-align: center;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 20px;
                margin: -40px -40px 40px -40px;
                border-radius: 0 0 20px 20px;
            }}
            
            .document-header h1 {{
                font-size: 2.5em;
                margin-bottom: 10px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }}
            
            .document-header p {{
                font-size: 1.2em;
                opacity: 0.9;
            }}
            
            .document-meta {{
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
                margin-bottom: 30px;
                border-left: 5px solid #3498db;
            }}
            
            .document-meta h2 {{
                color: #2c3e50;
                margin-bottom: 15px;
            }}
            
            .meta-grid {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
            }}
            
            .meta-item {{
                background: white;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }}
            
            .meta-item strong {{
                color: #3498db;
                display: block;
                margin-bottom: 5px;
            }}
            
            h1 {{
                color: #2c3e50;
                border-bottom: 3px solid #3498db;
                padding-bottom: 10px;
                margin-top: 40px;
                margin-bottom: 20px;
                font-size: 2em;
            }}
            
            h1:first-of-type {{
                margin-top: 0;
            }}
            
            h2 {{
                color: #34495e;
                border-bottom: 2px solid #ecf0f1;
                padding-bottom: 5px;
                margin-top: 30px;
                margin-bottom: 15px;
                font-size: 1.5em;
            }}
            
            h3 {{
                color: #7f8c8d;
                margin-top: 25px;
                margin-bottom: 10px;
                font-size: 1.3em;
            }}
            
            h4 {{
                color: #95a5a6;
                margin-top: 20px;
                margin-bottom: 10px;
                font-size: 1.1em;
            }}
            
            p {{
                margin-bottom: 15px;
                text-align: justify;
            }}
            
            code {{
                background-color: #f8f9fa;
                padding: 3px 6px;
                border-radius: 4px;
                font-family: 'Courier New', monospace;
                color: #e74c3c;
                font-size: 0.9em;
                border: 1px solid #e9ecef;
            }}
            
            pre {{
                background-color: #2c3e50;
                color: #ecf0f1;
                padding: 20px;
                border-radius: 8px;
                overflow-x: auto;
                margin: 20px 0;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }}
            
            pre code {{
                background-color: transparent;
                color: #ecf0f1;
                padding: 0;
                border: none;
                font-size: 0.9em;
            }}
            
            table {{
                border-collapse: collapse;
                width: 100%;
                margin: 20px 0;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                border-radius: 8px;
                overflow: hidden;
            }}
            
            th, td {{
                border: 1px solid #bdc3c7;
                padding: 12px 15px;
                text-align: left;
            }}
            
            th {{
                background-color: #3498db;
                color: white;
                font-weight: bold;
                text-transform: uppercase;
                font-size: 0.9em;
                letter-spacing: 0.5px;
            }}
            
            tr:nth-child(even) {{
                background-color: #f8f9fa;
            }}
            
            tr:hover {{
                background-color: #e3f2fd;
            }}
            
            blockquote {{
                border-left: 4px solid #3498db;
                margin: 20px 0;
                padding: 15px 25px;
                background-color: #f8f9fa;
                font-style: italic;
                border-radius: 0 8px 8px 0;
            }}
            
            ul, ol {{
                margin: 15px 0;
                padding-left: 30px;
            }}
            
            li {{
                margin: 8px 0;
            }}
            
            .tech-stack {{
                background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%);
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
                border-left: 5px solid #27ae60;
            }}
            
            .performance-metrics {{
                background: linear-gradient(135deg, #fff3cd 0%, #fff8e1 100%);
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
                border-left: 5px solid #f39c12;
            }}
            
            .api-endpoint {{
                background-color: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                margin: 10px 0;
                border-left: 4px solid #6c757d;
                font-family: 'Courier New', monospace;
            }}
            
            .feature-highlight {{
                background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
                border-left: 5px solid #9c27b0;
            }}
            
            .conclusion-box {{
                background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%);
                padding: 30px;
                border-radius: 15px;
                margin: 30px 0;
                border: 2px solid #27ae60;
                text-align: center;
            }}
            
            .conclusion-box h2 {{
                color: #27ae60;
                border: none;
                margin-bottom: 20px;
            }}
            
            .footer {{
                text-align: center;
                margin-top: 50px;
                padding: 20px;
                background-color: #f8f9fa;
                border-radius: 10px;
                color: #6c757d;
            }}
            
            @media print {{
                body {{
                    margin: 20px;
                    max-width: none;
                }}
                
                .document-header {{
                    margin: -20px -20px 20px -20px;
                }}
                
                h1 {{
                    page-break-before: always;
                }}
                
                h1:first-of-type {{
                    page-break-before: avoid;
                }}
                
                pre, table, .tech-stack, .performance-metrics {{
                    page-break-inside: avoid;
                }}
            }}
            
            @media (max-width: 768px) {{
                body {{
                    padding: 20px;
                }}
                
                .document-header h1 {{
                    font-size: 2em;
                }}
                
                .meta-grid {{
                    grid-template-columns: 1fr;
                }}
                
                table {{
                    font-size: 0.9em;
                }}
                
                th, td {{
                    padding: 8px 10px;
                }}
            }}
        </style>
    </head>
    <body>
        <div class="document-header">
            <h1>BizEye Analytics Dashboard v2.0</h1>
            <p>Comprehensive Technical Documentation & Project Report</p>
        </div>
        
        <div class="document-meta">
            <h2>📋 Project Information</h2>
            <div class="meta-grid">
                <div class="meta-item">
                    <strong>Project Name:</strong>
                    BizEye Analytics Dashboard v2.0
                </div>
                <div class="meta-item">
                    <strong>Version:</strong>
                    2.0
                </div>
                <div class="meta-item">
                    <strong>Documentation Date:</strong>
                    September 20, 2025
                </div>
                <div class="meta-item">
                    <strong>Project Type:</strong>
                    AI-Powered Business Intelligence Platform
                </div>
                <div class="meta-item">
                    <strong>Technology Stack:</strong>
                    Full-Stack Web Application
                </div>
                <div class="meta-item">
                    <strong>Status:</strong>
                    Production Ready
                </div>
            </div>
        </div>
        
        {html_content}
        
        <div class="footer">
            <p><strong>Document Prepared By:</strong> AI Development Team</p>
            <p><strong>Review Date:</strong> September 20, 2025 | <strong>Version:</strong> 1.0 | <strong>Status:</strong> Final</p>
            <p><em>This document serves as comprehensive technical documentation for the BizEye Analytics Dashboard v2.0 project.</em></p>
        </div>
    </body>
    </html>
    """
    
    # Write HTML file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(styled_html)
    
    print(f"✅ HTML documentation generated successfully: {output_file}")
    return True

def main():
    """Main function to generate HTML documentation"""
    
    # File paths
    markdown_file = "BizEye_Project_Documentation.md"
    output_file = "BizEye_Project_Documentation.html"
    
    # Check if markdown file exists
    if not Path(markdown_file).exists():
        print(f"❌ Markdown file not found: {markdown_file}")
        return
    
    print("🚀 Generating BizEye Project Documentation HTML...")
    print(f"📄 Source: {markdown_file}")
    print(f"📋 Output: {output_file}")
    
    # Generate HTML
    success = markdown_to_html(markdown_file, output_file)
    
    if success:
        file_size = Path(output_file).stat().st_size
        print(f"📊 File size: {file_size / 1024:.1f} KB")
        print(f"🎉 Documentation HTML ready!")
        print(f"📁 Location: {Path(output_file).absolute()}")
        print(f"🌐 Open in browser: file://{Path(output_file).absolute()}")
        print(f"📄 To convert to PDF: Open in browser and use 'Print to PDF'")

if __name__ == "__main__":
    main()
