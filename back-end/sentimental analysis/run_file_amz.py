from AmazonDataPreprocessor import AmazonDataPreprocessor

# Initialize and load your data
processor = AmazonDataPreprocessor('amazon.csv')

# Run complete preprocessing pipeline
cleaned_data = processor.run_full_preprocessing(
    remove_outliers=True,
    encode_features=True, 
    normalize=True
)

# Save cleaned dataset
processor.save_cleaned_data('Cleaned_Amazon_Data.csv')

# Get feature importance analysis
correlations = processor.get_feature_importance_analysis()