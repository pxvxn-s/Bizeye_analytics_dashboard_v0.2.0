from flask import Flask, render_template
import os

app = Flask(__name__)

@app.route("/")
def dashboard():
    # Read the generated summary
    summary_path = os.path.join("reviews", "review_summary.txt")
    if os.path.exists(summary_path):
        with open(summary_path, "r", encoding="utf-8") as f:
            summary = f.read()
    else:
        summary = "No summary available yet. Please run the summarizer."

    return render_template("index.html", review_summary=summary)

if __name__ == "__main__":
    app.run(debug=True)

