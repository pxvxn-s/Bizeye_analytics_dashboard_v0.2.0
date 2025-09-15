import pandas as pd
import torch
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, f1_score
from datasets import Dataset
from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification, Trainer, TrainingArguments

# Step 1: Load your labeled dataset
df = pd.read_csv("cleaned_reviews.csv")

# Step 2: Encode labels (Positive=2, Neutral=1, Negative=0)
label_encoder = LabelEncoder()
df["label"] = label_encoder.fit_transform(df["sentiment_label"])

# Optional: Save label mapping for inference later
label_map = dict(zip(label_encoder.classes_, label_encoder.transform(label_encoder.classes_)))
print(" Label Mapping:", label_map)

# Step 3: Convert to HuggingFace dataset
dataset = Dataset.from_pandas(df[["review_content", "label"]])

# Step 4: Tokenize reviews
tokenizer = DistilBertTokenizerFast.from_pretrained("distilbert-base-uncased")

def tokenize(example):
    return tokenizer(example["review_content"], truncation=True, padding="max_length", max_length=128)

dataset = dataset.map(tokenize, batched=True)
dataset = dataset.rename_column("label", "labels")
dataset.set_format(type="torch", columns=["input_ids", "attention_mask", "labels"])

# Step 5: Train-test split
dataset = dataset.train_test_split(test_size=0.2)
train_dataset = dataset["train"]
eval_dataset = dataset["test"]

# Step 6: Load pre-trained DistilBERT
model = DistilBertForSequenceClassification.from_pretrained("distilbert-base-uncased", num_labels=3)

# Step 7: Define training settings
training_args = TrainingArguments(
    output_dir="./sentiment_model",
    evaluation_strategy="epoch",
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=4,
    learning_rate=2e-5,
    save_strategy="epoch",
    load_best_model_at_end=True,
    logging_dir="./logs",
    logging_steps=10,
    report_to="none"  # Avoid needing wandb
)

# Step 8: Evaluation metrics
def compute_metrics(pred):
    labels = pred.label_ids
    preds = pred.predictions.argmax(-1)
    return {
        "accuracy": accuracy_score(labels, preds),
        "f1": f1_score(labels, preds, average="weighted")
    }

# Step 9: Train the model
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    compute_metrics=compute_metrics,
    tokenizer=tokenizer
)

trainer.train()

# Step 10: Save model and tokenizer
model.save_pretrained("sentiment_model")
tokenizer.save_pretrained("sentiment_model")

print(" Training complete. Model saved to ./sentiment_model")
