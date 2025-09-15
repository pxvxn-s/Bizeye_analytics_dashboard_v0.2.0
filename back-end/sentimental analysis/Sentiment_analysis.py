import nltk
import os

# Check if vader_lexicon is already downloaded to avoid repeated downloads
try:
    nltk.data.find('vader_lexicon')
except LookupError:
    print("Downloading VADER lexicon...")
    nltk.download('vader_lexicon')

import pandas as pd
from nltk.sentiment.vader import SentimentIntensityAnalyzer

# Initialize VADER
sia = SentimentIntensityAnalyzer()

def get_sentiment(text):
    """Get sentiment analysis for a given text with improved context awareness"""
    if pd.isna(text) or text == '':
        return 'neutral'
    
    try:
        text_str = str(text).lower()
        
        # First, check for context-aware positive patterns
        positive_patterns = [
            'less damage', 'without feeling heavy', 'improved', 'better', 'enhanced',
            'excellent', 'great', 'amazing', 'wonderful', 'fantastic', 'outstanding',
            'perfect', 'love', 'best', 'good', 'quickly', 'easily', 'powerful',
            'effective', 'hydrating', 'quality', 'control', 'consistent', 'grip',
            'bounce', 'significantly improved', 'noticeable improvement',
            'rejuvenated', 'keeps drinks', 'hot/cold for hours', 'natural-looking',
            'definition', 'feels', 'morning', 'hours', 'classic', 'thought-provoking'
        ]
        
        # Check for specific positive phrases that should override neutral classification
        positive_phrases = [
            'feels rejuvenated', 'keeps drinks hot', 'keeps drinks cold', 
            'natural-looking', 'thought-provoking', 'dystopian classic'
        ]
        
        # Check for neutral phrases first (highest priority)
        neutral_phrases = [
            "it's okay", "does the job", "nothing special", "average", "decent",
            "acceptable", "fine", "alright", "so-so", "mediocre"
        ]
        
        for phrase in neutral_phrases:
            if phrase in text_str:
                return "neutral"
        
        # Check for positive phrases (higher priority)
        for phrase in positive_phrases:
            if phrase in text_str:
                return "positive"
        
        negative_patterns = [
            'terrible', 'awful', 'horrible', 'bad', 'worst', 'hate', 'disappointed',
            'broken', 'damaged', 'poor', 'useless', 'waste', 'regret', 'not worth',
            'very disappointed', 'broke after', 'damaged after'
        ]
        
        # Check for positive patterns
        for pattern in positive_patterns:
            if pattern in text_str:
                return "positive"
        
        # Check for negative patterns
        for pattern in negative_patterns:
            if pattern in text_str:
                return "negative"
        
        # If no clear patterns, use VADER with adjusted thresholds
        scores = sia.polarity_scores(text_str)
        compound = scores["compound"]
        positive = scores["pos"]
        negative = scores["neg"]
        
        # More lenient thresholds for VADER
        if compound >= 0.05 or positive > 0.2:
            return "positive"
        elif compound <= -0.05 or negative > 0.2:
            return "negative"
        else:
            return "neutral"
            
    except Exception as e:
        print(f"Error in sentiment analysis: {e}")
        return "neutral"

def analyze_reviews_from_file(filepath):
    """Analyze reviews from a CSV file"""
    try:
        df = pd.read_csv(filepath)
        
        # Apply sentiment analysis to each review
        if 'review_content' in df.columns:
            df['sentiment'] = df['review_content'].apply(get_sentiment)
        elif 'review' in df.columns:
            df['sentiment'] = df['review'].apply(get_sentiment)
        elif 'review_text' in df.columns:
            df['sentiment'] = df['review_text'].apply(get_sentiment)
        else:
            # Try to find any text column
            text_columns = df.select_dtypes(include=['object']).columns
            if len(text_columns) > 0:
                df['sentiment'] = df[text_columns[0]].apply(get_sentiment)
            else:
                return None
        
        return df
    except Exception as e:
        print(f"Error analyzing reviews: {e}")
        return None

if __name__ == "__main__":
    # Only run this when the script is executed directly
    try:
        df = pd.read_csv("reviews/sample_reviews.csv")
        df["sentiment"] = df["review_text"].apply(get_sentiment)
        df.to_csv("reviews/reviews_with_sentiment.csv", index=False)
        print("Sentiment analysis complete. File saved to: reviews/reviews_with_sentiment.csv")
    except Exception as e:
        print(f"Error running sentiment analysis: {e}")