import pandas as pd
from transformers import pipeline

# Load sentiment-reviewed data
df = pd.read_csv("reviews/reviews_with_sentiment.csv")

# Join all review texts into one big paragraph
all_reviews = " ".join(df["review_text"].astype(str).tolist())

# Initialize summarization model
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# Split the big text if it's too long for the model
max_chunk = 1024  # max tokens for BART
review_chunks = [all_reviews[i:i+max_chunk] for i in range(0, len(all_reviews), max_chunk)]

# Summarize each chunk and join the results
summaries = [summarizer(chunk, max_length=130, min_length=30, do_sample=False)[0]['summary_text'] for chunk in review_chunks]
final_summary = " ".join(summaries)

# Save the summary
with open("reviews/review_summary.txt", "w", encoding="utf-8") as f:
    f.write(final_summary)

print(" Summary saved to: reviews/review_summary.txt")
