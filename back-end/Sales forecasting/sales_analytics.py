import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import plotly.graph_objects as go
import plotly.express as px
from datetime import datetime, timedelta
import json
from typing import Dict, Tuple, Optional
import warnings
warnings.filterwarnings('ignore')

class ProductPerformanceAnalyzer:
    """
    A comprehensive Product Performance Analysis module for analyzing sales data
    and generating insights with visualizations.
    """

    def __init__(self):
        self.df = None
        self.historical_avg = None
        self.recent_sales = None
        self.performance_change = None

    def read_dataset(self, data_source, data_type='csv'):
        """
        Read dataset from CSV file, JSON file, or direct data

        Args:
            data_source: File path (str) or data (list/dict)
            data_type: 'csv', 'json', or 'data'
        """
        try:
            if data_type == 'csv':
                self.df = pd.read_csv(data_source)
            elif data_type == 'json':
                if isinstance(data_source, str):
                    # File path
                    with open(data_source, 'r') as f:
                        data = json.load(f)
                    self.df = pd.DataFrame(data)
                else:
                    # Direct data
                    self.df = pd.DataFrame(data_source)
            elif data_type == 'data':
                self.df = pd.DataFrame(data_source)

            # Convert date column to datetime
            if 'date' in self.df.columns:
                self.df['date'] = pd.to_datetime(self.df['date'])
                self.df = self.df.sort_values('date').reset_index(drop=True)

            print(f"Dataset loaded successfully with {len(self.df)} records")
            return True

        except Exception as e:
            print(f"Error loading dataset: {e}")
            return False

    def generate_sample_data(self, product_name="Product A", days=90):
        """
        Generate sample sales data for demonstration

        Args:
            product_name: Name of the product
            days: Number of days of historical data
        """
        # Generate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days-1)
        dates = pd.date_range(start=start_date, end=end_date, freq='D')

        # Generate realistic sales data with trend and seasonality
        np.random.seed(42)
        base_sales = 100
        trend = np.linspace(0, 20, len(dates))  # Slight upward trend
        seasonality = 10 * np.sin(2 * np.pi * np.arange(len(dates)) / 7)  # Weekly pattern
        noise = np.random.normal(0, 15, len(dates))

        # Recent performance change (last 7 days different)
        sales = base_sales + trend + seasonality + noise

        # Simulate recent performance change (last 7 days)
        recent_change = -20  # 20% decrease for demo
        sales[-7:] = sales[-7:] + recent_change

        # Ensure no negative sales
        sales = np.maximum(sales, 10)

        # Create DataFrame
        self.df = pd.DataFrame({
            'date': dates,
            'sales': sales,
            'product_name': product_name
        })

        print(f"Generated sample data for {product_name} with {len(self.df)} days of sales data")
        return self.df

    def generate_sales_from_catalog(self, catalog_data, days=90):
        """
        Generate historical sales data based on product catalog information

        Args:
            catalog_data: List of product dictionaries with product information
            days: Number of days of historical sales data to generate
        """
        all_sales_data = []

        for product in catalog_data:
            product_id = product.get('product_id', 'Unknown')
            product_name = product.get('product_name', 'Unknown Product')
            rating = product.get('rating', 4.0)
            rating_count = product.get('rating_count', 1000)
            discount_percentage = product.get('discount_percentage', 0)
            discounted_price = product.get('discounted_price', 500)

            # Calculate base sales influenced by product characteristics
            # Higher rating and more reviews generally mean more sales
            rating_factor = (rating / 5.0) * 1.5  # Rating influence
            popularity_factor = min(np.log10(rating_count) / 4, 2.0)  # Review count influence (capped)
            discount_factor = 1 + (discount_percentage / 100) * 0.5  # Discount boost
            price_factor = max(0.3, 1000 / discounted_price)  # Lower price = higher sales

            base_daily_sales = int(20 * rating_factor * popularity_factor * discount_factor * price_factor)

            # Generate date range
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days-1)
            dates = pd.date_range(start=start_date, end=end_date, freq='D')

            # Use product_id as seed for consistent but different patterns
            np.random.seed(hash(product_id) % 2**32)
            # Generate realistic sales patterns
            trend = np.linspace(0, base_daily_sales * 0.2, len(dates))  # Growth trend
            seasonality = base_daily_sales * 0.3 * np.sin(2 * np.pi * np.arange(len(dates)) / 7)  # Weekly pattern
            monthly_cycle = base_daily_sales * 0.2 * np.sin(2 * np.pi * np.arange(len(dates)) / 30)  # Monthly pattern
            noise = np.random.normal(0, base_daily_sales * 0.25, len(dates))

            sales = base_daily_sales + trend + seasonality + monthly_cycle + noise

            # Add some random performance changes in recent days
            recent_change_factor = np.random.uniform(-0.3, 0.3)  # -30% to +30% change
            sales[-7:] = sales[-7:] * (1 + recent_change_factor)

            # Ensure no negative sales
            sales = np.maximum(sales, 1)

            # Create sales records for this product
            for date, daily_sales in zip(dates, sales):
                all_sales_data.append({
                    'date': date,
                    'sales': int(daily_sales),
                    'product_id': product_id,
                    'product_name': product_name,
                    'category_main': product.get('category', {}).get('main', 'Unknown'),
                    'category_sub': product.get('category', {}).get('sub', 'Unknown'),
                    'rating': rating,
                    'price': discounted_price
                })

        # Convert to DataFrame
        self.df = pd.DataFrame(all_sales_data)
        self.df['date'] = pd.to_datetime(self.df['date'])
        self.df = self.df.sort_values(['product_id', 'date']).reset_index(drop=True)

        print(f"Generated sales data for {len(catalog_data)} products over {days} days")
        print(f"Total records: {len(self.df)}")
        return self.df

    def calculate_metrics(self, recent_days=7, product_id=None):
        """
        Calculate performance metrics for a specific product or all products

        Args:
            recent_days: Number of recent days to compare against historical average
            product_id: Specific product ID to analyze (if None, analyzes all data)
        """
        if self.df is None or 'sales' not in self.df.columns:
            raise ValueError("Dataset not loaded or missing 'sales' column")

        # Filter for specific product if provided
        if product_id:
            product_data = self.df[self.df['product_id'] == product_id].copy()
            if product_data.empty:
                raise ValueError(f"No data found for product_id: {product_id}")
        else:
            product_data = self.df.copy()

        # Calculate historical average (excluding recent days)
        historical_data = product_data.iloc[:-recent_days] if len(product_data) > recent_days else product_data.iloc[:-1]
        self.historical_avg = historical_data['sales'].mean()

        # Calculate recent sales (average of last N days)
        recent_data = product_data.tail(recent_days)
        self.recent_sales = recent_data['sales'].mean()

        # Calculate performance change percentage
        if self.historical_avg > 0:
            self.performance_change = ((self.recent_sales - self.historical_avg) / self.historical_avg) * 100
        else:
            self.performance_change = 0

        return {
            'historical_avg': round(self.historical_avg, 2),
            'recent_sales': round(self.recent_sales, 2),
            'performance_change': round(self.performance_change, 2)
        }

    def create_line_chart(self, save_path=None, use_plotly=True, product_id=None):
        """
        Create line chart showing sales over time

        Args:
            save_path: Optional path to save the chart
            use_plotly: Use Plotly (True) or Matplotlib (False)
            product_id: Specific product ID to visualize (if None, shows all data)
        """
        # Filter for specific product if provided
        plot_data = self.df[self.df['product_id'] == product_id] if product_id else self.df

        if use_plotly:
            return self._create_plotly_line_chart(save_path, plot_data)
        else:
            return self._create_matplotlib_line_chart(save_path, plot_data)

    def _create_plotly_line_chart(self, save_path=None, data=None):
        """Create interactive line chart with Plotly"""
        if data is None:
            data = self.df

        fig = go.Figure()

        # If multiple products, show them separately
        if 'product_id' in data.columns and data['product_id'].nunique() > 1:
            for product_id in data['product_id'].unique():
                product_data = data[data['product_id'] == product_id]
                product_name = product_data['product_name'].iloc[0] if 'product_name' in product_data else product_id

                fig.add_trace(go.Scatter(
                    x=product_data['date'],
                    y=product_data['sales'],
                    mode='lines',
                    name=f'{product_name} ({product_id})',
                    line=dict(width=2)
                ))
        else:
            # Single product or aggregated view
            # Historical data (excluding last 7 days)
            historical_data = data.iloc[:-7] if len(data) > 7 else data.iloc[:-1]
            recent_data = data.tail(7)

            # Add historical sales line
            fig.add_trace(go.Scatter(
                x=historical_data['date'],
                y=historical_data['sales'],
                mode='lines',
                name='Historical Sales',
                line=dict(color='blue', width=2)
            ))

            # Add recent sales line (highlighted)
            fig.add_trace(go.Scatter(
                x=recent_data['date'],
                y=recent_data['sales'],
                mode='lines+markers',
                name='Recent Sales (Last 7 Days)',
                line=dict(color='red' if self.performance_change < 0 else 'green', width=3),
                marker=dict(size=6)
            ))

            # Add historical average line
            if hasattr(self, 'historical_avg') and self.historical_avg:
                fig.add_hline(
                    y=self.historical_avg,
                    line_dash="dash",
                    line_color="orange",
                    annotation_text=f"Historical Avg: {self.historical_avg:.0f}"
                )

        product_name = data['product_name'].iloc[0] if 'product_name' in data and len(data) > 0 else "Products"
        fig.update_layout(
            title=f"Sales Performance Over Time - {product_name}",
            xaxis_title="Date",
            yaxis_title="Sales Units",
            hovermode='x unified',
            showlegend=True,
            height=500
        )

        if save_path:
            fig.write_html(save_path)

        fig.show()
        return fig

    def _create_matplotlib_line_chart(self, save_path=None):
        """Create line chart with Matplotlib"""
        plt.figure(figsize=(12, 6))

        # Plot all sales data
        plt.plot(self.df['date'], self.df['sales'], color='blue', alpha=0.7, label='Sales')

        # Highlight recent data
        recent_data = self.df.tail(7)
        color = 'red' if self.performance_change < 0 else 'green'
        plt.plot(recent_data['date'], recent_data['sales'], color=color, linewidth=3,
                label='Recent Sales (Last 7 Days)')

        # Add historical average line
        plt.axhline(y=self.historical_avg, color='orange', linestyle='--',
                   label=f'Historical Average: {self.historical_avg:.0f}')

        plt.title('Sales Performance Over Time', fontsize=16, fontweight='bold')
        plt.xlabel('Date', fontsize=12)
        plt.ylabel('Sales Units', fontsize=12)
        plt.legend()
        plt.grid(True, alpha=0.3)
        plt.xticks(rotation=45)
        plt.tight_layout()

        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')

        plt.show()
        return plt.gcf()

    def create_comparison_bar_chart(self, save_path=None, use_plotly=True):
        """
        Create bar chart comparing historical average vs recent sales

        Args:
            save_path: Optional path to save the chart
            use_plotly: Use Plotly (True) or Matplotlib (False)
        """
        if use_plotly:
            return self._create_plotly_bar_chart(save_path)
        else:
            return self._create_matplotlib_bar_chart(save_path)

    def _create_plotly_bar_chart(self, save_path=None):
        """Create interactive bar chart with Plotly"""
        categories = ['Historical Average', 'Recent Sales (Last 7 Days)']
        values = [self.historical_avg, self.recent_sales]
        colors = ['lightblue', 'red' if self.performance_change < 0 else 'green']

        fig = go.Figure(data=[
            go.Bar(x=categories, y=values, marker_color=colors, text=values, texttemplate='%{text:.0f}')
        ])

        fig.update_layout(
            title=f"Sales Performance Comparison<br><sub>Change: {self.performance_change:+.1f}%</sub>",
            yaxis_title="Average Sales Units",
            showlegend=False,
            height=400
        )

        # Add percentage change annotation
        fig.add_annotation(
            x=1, y=self.recent_sales,
            text=f"{self.performance_change:+.1f}%",
            showarrow=True,
            arrowhead=2,
            arrowcolor="black",
            font=dict(size=14, color="black")
        )

        if save_path:
            fig.write_html(save_path)

        fig.show()
        return fig

    def _create_matplotlib_bar_chart(self, save_path=None):
        """Create bar chart with Matplotlib"""
        categories = ['Historical\nAverage', 'Recent Sales\n(Last 7 Days)']
        values = [self.historical_avg, self.recent_sales]
        colors = ['lightblue', 'red' if self.performance_change < 0 else 'lightgreen']

        plt.figure(figsize=(8, 6))
        bars = plt.bar(categories, values, color=colors, edgecolor='black', linewidth=1)

        # Add value labels on bars
        for bar, value in zip(bars, values):
            plt.text(bar.get_x() + bar.get_width()/2, bar.get_height() + max(values)*0.01,
                    f'{value:.0f}', ha='center', va='bottom', fontweight='bold')

        # Add percentage change annotation
        plt.annotate(f'{self.performance_change:+.1f}%',
                    xy=(1, self.recent_sales), xytext=(1.2, self.recent_sales),
                    arrowprops=dict(arrowstyle='->', color='black'),
                    fontsize=12, fontweight='bold')

        plt.title(f'Sales Performance Comparison\nChange: {self.performance_change:+.1f}%',
                 fontsize=14, fontweight='bold')
        plt.ylabel('Average Sales Units', fontsize=12)
        plt.ylim(0, max(values) * 1.2)
        plt.tight_layout()

        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')

        plt.show()
        return plt.gcf()

    def generate_insights(self, product_name="Product A"):
        """
        Generate text insights based on performance analysis

        Args:
            product_name: Name of the product for insights
        """
        if self.performance_change is None:
            return "No analysis performed yet. Please run calculate_metrics() first."

        # Determine performance direction and magnitude
        if abs(self.performance_change) < 2:
            change_desc = "remained stable"
            magnitude = ""
        elif self.performance_change > 0:
            if self.performance_change > 20:
                magnitude = "significantly"
            elif self.performance_change > 10:
                magnitude = "substantially"
            elif self.performance_change > 5:
                magnitude = "moderately"
            else:
                magnitude = "slightly"
            change_desc = f"{magnitude} increased"
        else:
            perf_abs = abs(self.performance_change)
            if perf_abs > 20:
                magnitude = "significantly"
            elif perf_abs > 10:
                magnitude = "substantially"
            elif perf_abs > 5:
                magnitude = "moderately"
            else:
                magnitude = "slightly"
            change_desc = f"{magnitude} decreased"

        # Generate main insight
        if abs(self.performance_change) < 2:
            insight = f"{product_name} sales have {change_desc} compared to historical average."
        else:
            insight = f"{product_name} sales have {change_desc} by {abs(self.performance_change):.1f}% compared to historical average."

        # Additional context
        context = []
        context.append(f"Historical average: {self.historical_avg:.0f} units per day")
        context.append(f"Recent average (last 7 days): {self.recent_sales:.0f} units per day")

        if self.performance_change > 10:
            context.append("This represents a strong positive trend that warrants attention.")
        elif self.performance_change > 5:
            context.append("This shows a positive trend worth monitoring.")
        elif self.performance_change < -10:
            context.append("This decline requires immediate investigation and action.")
        elif self.performance_change < -5:
            context.append("This downward trend should be monitored closely.")
        else:
            context.append("Performance is within normal variation range.")

        full_insight = insight + " " + " ".join(context)
        return full_insight

    def export_json(self, filepath=None):
        """
        Export performance metrics to JSON format for integration with other modules

        Args:
            filepath: Optional path to save JSON file
        """
        if self.performance_change is None:
            raise ValueError("No analysis performed yet. Please run calculate_metrics() first.")

        output_data = {
            "historical_avg": round(self.historical_avg, 2),
            "recent_sales": round(self.recent_sales, 2),
            "performance_change": round(self.performance_change, 2),
            "analysis_date": datetime.now().isoformat(),
            "recent_period_days": 7
        }

        if filepath:
            with open(filepath, 'w') as f:
                json.dump(output_data, f, indent=2)
            print(f"Analysis exported to {filepath}")

        return output_data

    def run_complete_analysis(self, data_source=None, product_name="Product A",
                            recent_days=7, save_charts=False, use_plotly=True, product_id=None):
        """
        Run complete analysis pipeline

        Args:
            data_source: Data source (file path, data, or None for sample data)
            product_name: Product name for analysis
            recent_days: Number of recent days to analyze
            save_charts: Whether to save charts to files
            use_plotly: Use Plotly for interactive charts
            product_id: Specific product ID to analyze (for multi-product datasets)
        """
        print("="*60)
        print("PRODUCT PERFORMANCE ANALYSIS")
        print("="*60)

        # Load or generate data
        if data_source is None:
          if self.df is None or self.df.empty:
            print("\n1. No data loaded. Generating new sample data...")
            self.generate_sample_data(product_name)
          else:
            print("\n1. Using previously loaded data for analysis...")
        else:
            print("\n1. Loading/processing dataset...")
            if isinstance(data_source, str):
                if data_source.endswith('.csv'):
                    self.read_dataset(data_source, 'csv')
                else:
                    self.read_dataset(data_source, 'json')
            else:
                # Check if this is catalog data (has product_id, product_name, etc.)
                if isinstance(data_source, list) and len(data_source) > 0:
                    first_item = data_source[0]
                    if 'product_id' in first_item and 'sales' not in first_item:
                        print("   Detected product catalog data - generating sales history...")
                        self.generate_sales_from_catalog(data_source)
                    else:
                        self.read_dataset(data_source, 'data')
                else:
                    self.read_dataset(data_source, 'data')

        # Calculate metrics
        print("\n2. Calculating performance metrics...")
        metrics = self.calculate_metrics(recent_days, product_id)
        print(f"   Historical Average: {metrics['historical_avg']}")
        print(f"   Recent Sales: {metrics['recent_sales']}")
        print(f"   Performance Change: {metrics['performance_change']}%")

        # Generate insights
        print("\n3. Generating insights...")
        analysis_product_name = product_name
        if product_id and 'product_name' in self.df.columns:
            product_data = self.df[self.df['product_id'] == product_id]
            if not product_data.empty:
                analysis_product_name = product_data['product_name'].iloc[0]

        insights = self.generate_insights(analysis_product_name)
        print(f"   {insights}")

        # Create visualizations
        print("\n4. Creating visualizations...")
        if save_charts:
            line_path = f"{analysis_product_name.lower().replace(' ', '_')}_line_chart.html" if use_plotly else f"{analysis_product_name.lower().replace(' ', '_')}_line_chart.png"
            bar_path = f"{analysis_product_name.lower().replace(' ', '_')}_bar_chart.html" if use_plotly else f"{analysis_product_name.lower().replace(' ', '_')}_bar_chart.png"
        else:
            line_path = bar_path = None

        self.create_line_chart(line_path, use_plotly, product_id)
        self.create_comparison_bar_chart(bar_path, use_plotly)

        # Export JSON
        print("\n5. Exporting analysis results...")
        json_output = self.export_json()

        print("\n" + "="*60)
        print("ANALYSIS COMPLETE")
        print("="*60)

        return {
            'metrics': metrics,
            'insights': insights,
            'json_output': json_output
        }

    def analyze_all_products(self, recent_days=7):
        """
        Analyze performance for all products in the dataset

        Args:
            recent_days: Number of recent days to analyze
        """
        if 'product_id' not in self.df.columns:
            print("No product_id column found. Running single product analysis...")
            return self.calculate_metrics(recent_days)

        results = {}
        product_ids = self.df['product_id'].unique()

        print(f"Analyzing {len(product_ids)} products...")

        for product_id in product_ids:
            try:
                metrics = self.calculate_metrics(recent_days, product_id)
                product_name = self.df[self.df['product_id'] == product_id]['product_name'].iloc[0]
                insights = self.generate_insights(product_name)

                results[product_id] = {
                    'product_name': product_name,
                    'metrics': metrics,
                    'insights': insights
                }

                print(f"✓ {product_name}: {metrics['performance_change']:+.1f}%")

            except Exception as e:
                print(f"✗ Error analyzing {product_id}: {e}")

        return results


# Example usage and demonstration
if __name__ == "__main__":
    # Your actual product catalog data
    catalog_data = [
        {
            "product_id": "B07JW9H4J1",
            "product_name": "Wayona Nylon Braided USB to Lightning Cable",
            "category": {
                "main": "Computers & Accessories",
                "sub": "Cables",
                "type": "USB Cables"
            },
            "discounted_price": 399,
            "actual_price": 1099,
            "discount_percentage": 64,
            "rating": 4.2,
            "rating_count": 24269,
            "reviews": [
                {"sentiment": "Positive", "content": "Looks durable Charging is fine too. No complains"},
                {"sentiment": "Positive", "content": "Charging is really fast, good product."}
            ],
            "product_link": "https://www.amazon.in/Wayona-Braided-WN3LG1-Syncing-Charging/dp/B07JW9H4J1/"
        },
        {
            "product_id": "B08N5WRWNW",
            "product_name": "AmazonBasics USB Type-C to USB-A 2.0 Male Cable",
            "category": {
                "main": "Computers & Accessories",
                "sub": "Cables",
                "type": "USB Cables"
            },
            "discounted_price": 249,
            "actual_price": 599,
            "discount_percentage": 58,
            "rating": 4.1,
            "rating_count": 17850,
            "reviews": [
                {"sentiment": "Positive", "content": "Good build quality and works as expected"},
                {"sentiment": "Negative", "content": "Stopped working after a month"}
            ],
            "product_link": "https://www.amazon.in/AmazonBasics-Type-C-USB-Male-Cable/dp/B08N5WRWNW/"
        }
    ]

    # Create analyzer instance
    analyzer = ProductPerformanceAnalyzer()

    # Run analysis with your catalog data (will generate sales history)
    print("Running analysis with your product catalog data...")
    results = analyzer.run_complete_analysis(
        data_source=catalog_data,
        product_name="USB Cables",
        recent_days=7,
        save_charts=False,
        use_plotly=True
    )

    print("\nJSON Output for Integration:")
    print(json.dumps(results['json_output'], indent=2))

    # Analyze individual products
    print("\n" + "="*60)
    print("INDIVIDUAL PRODUCT ANALYSIS")
    print("="*60)

    all_results = analyzer.analyze_all_products(recent_days=7)

    # Example: Analyze specific product
    print("\nAnalyzing specific product (Wayona Cable):")
    wayona_results = analyzer.run_complete_analysis(
        data_source=None,  # Data already loaded
        product_name="Wayona Cable",
        product_id="B07JW9H4J1",
        recent_days=7,
        use_plotly=True
    )

    # Example of how to use with actual sales data
    print("\n" + "="*60)
    print("EXAMPLE: How to use with your sales data")
    print("="*60)

    example_sales_data = [
        {"date": "2024-01-01", "sales": 120, "product_name": "Product A"},
        {"date": "2024-01-02", "sales": 115, "product_name": "Product A"},
        {"date": "2024-01-03", "sales": 130, "product_name": "Product A"},
        # ... more data
    ]

    print("""
To use with your actual sales data:

1. Ensure your data has 'date' and 'sales' columns
2. Use one of these methods:

# From CSV file:
analyzer.read_dataset('sales_data.csv', 'csv')

# From JSON file:
analyzer.read_dataset('sales_data.json', 'json')

# From Python data structure:
analyzer.read_dataset(your_sales_data, 'data')

# Then run analysis:
metrics = analyzer.calculate_metrics(recent_days=7)
insights = analyzer.generate_insights("Your Product Name")
analyzer.create_line_chart(use_plotly=True)
analyzer.create_comparison_bar_chart(use_plotly=True)
json_output = analyzer.export_json("analysis_results.json")
""")
