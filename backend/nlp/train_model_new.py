import json
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import cross_val_score, StratifiedKFold
from collections import Counter

from training_data import training_data

# Unzip training data
X, y = zip(*training_data)

# Check data distribution
print(Counter(y))  # Print class distribution

# Define pipeline (same as before)
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(
        lowercase=True,
        stop_words="english",
        ngram_range=(1, 2)
    )),
    ('clf', MultinomialNB())
])

# Use StratifiedKFold to handle imbalanced data
from sklearn.model_selection import StratifiedKFold
cv = StratifiedKFold(n_splits=3)  # 3-fold cross-validation

# Perform cross-validation
scores = cross_val_score(pipeline, X, y, cv=cv)
print(f"Cross-validation Accuracy: {scores.mean():.4f}")

# Train the model on the entire dataset
pipeline.fit(X, y)

# Save the trained model
joblib.dump(pipeline, "domain_classifier.pkl")
print("Model trained and saved as domain_classifier.pkl")
