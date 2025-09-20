# Step 1: Install required libraries (only run once)
# pip install transformers torch

# Step 2: Import necessary library
from transformers import pipeline
import pandas as pd
import warnings
warnings.filterwarnings("ignore")

# Step 3: Load the sentiment analysis pipeline using a pre-trained model
print("Loading Hugging Face pre-trained sentiment analysis model...")
print("This may take a few minutes for first-time download...")

try:
    sentiment_pipeline = pipeline("sentiment-analysis")
    print("✅ Hugging Face pre-trained model loaded successfully!")
    print("✅ Ready for sentiment analysis on dataset reviews")
except Exception as e:
    print(f"❌ Error loading Hugging Face model: {e}")
    sentiment_pipeline = None

def get_sentiment(text):
    """Get sentiment analysis using your exact Hugging Face code"""
    if pd.isna(text) or text == '' or str(text).strip() == '':
        return 'neutral'
    
    try:
        text_str = str(text).strip()
        
        # Use your exact Hugging Face pipeline
        if sentiment_pipeline is not None:
            try:
                # Perform sentiment analysis using the pre-trained pipeline
                result = sentiment_pipeline(text_str)
                
                # Extract the predicted sentiment and confidence score
                predicted_sentiment = result[0]['label']
                confidence_score = result[0]['score']
                
                # Map the model labels to our labels
                # The default model uses 'POSITIVE' and 'NEGATIVE' labels
                if 'POSITIVE' in predicted_sentiment:
                    return 'positive'
                elif 'NEGATIVE' in predicted_sentiment:
                    return 'negative'
                else:
                    return 'neutral'
                    
            except Exception as e:
                print(f"Error with Hugging Face model: {e}")
                return "neutral"
        else:
            print("Hugging Face model not available")
            return "neutral"
            
    except Exception as e:
        print(f"Error in sentiment analysis: {e}")
        return "neutral"

def analyze_reviews_from_file(filepath):
    """Analyze reviews from a CSV file using your exact Hugging Face code"""
    try:
        df = pd.read_csv(filepath)
        
        # Apply sentiment analysis to each review using the pre-trained model
        if 'review_content' in df.columns:
            df['sentiment'] = df['review_content'].apply(get_sentiment)
        elif 'review' in df.columns:
            df['sentiment'] = df['review'].apply(get_sentiment)
        elif 'review_text' in df.columns:
            df['sentiment'] = df['review_text'].apply(get_sentiment)
        elif 'Reviews' in df.columns:
            df['sentiment'] = df['Reviews'].apply(get_sentiment)
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

def test_sentiment_analysis():
    """Test the sentiment analysis with your exact sample sentences"""
    if sentiment_pipeline is None:
        print("❌ Sentiment pipeline not available")
        return
    
    # Step 4: Define input sentences (your exact code)
    input_sentences = [
        "The new phone I bought is absolutely amazing!",
        "Worst customer service ever. I'm never coming back.",
        "The experience was average, nothing special.",
        "Fast delivery and the packaging was perfect.",
        "The product broke within two days. Very disappointed."
    ]
    
    # Step 5: Perform sentiment analysis (your exact code)
    results = sentiment_pipeline(input_sentences)
    
    # Step 6: Display the results (your exact code)
    print("Sentiment Analysis Results:\n")
    for sentence, result in zip(input_sentences, results):
        print(f"Input Sentence: {sentence}")
        print(f"Predicted Sentiment: {result['label']}, Confidence Score: {result['score']:.2f}\n")

if __name__ == "__main__":
    # Test the sentiment analysis with your exact sample sentences
    print("Testing Hugging Face Pre-trained Sentiment Analysis Model...")
    test_sentiment_analysis()
    
    # Also test with dataset if available
    try:
        df = pd.read_csv("reviews/sample_reviews.csv")
        df["sentiment"] = df["review_text"].apply(get_sentiment)
        df.to_csv("reviews/reviews_with_sentiment.csv", index=False)
        print("Sentiment analysis complete. File saved to: reviews/reviews_with_sentiment.csv")
    except Exception as e:
        print(f"Error running sentiment analysis on dataset: {e}")
