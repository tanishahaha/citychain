import cv2
import numpy as np
from tensorflow.keras.models import load_model
import os

# Load the deepfake model
model = load_model('C:/Users/Gaurav Ghadi/Desktop/citychain/backend/deepfake_model_balanced.h5')   # Update path if needed

def classify_image(image_path):
    # Load and preprocess image
    img = cv2.imread(image_path)
    if img is None:
        return 0.5, "Unknown"
    img_resized = cv2.resize(img, (224, 224))  # Match model input size
    img_normalized = np.array([img_resized]) / 255.0  # Normalize to [0, 1]
    
    # Predict with the deepfake model
    prediction = model.predict(img_normalized)
    score = float(prediction[0][0])  # Single image, single prediction
    label = "Fake" if score > 0.5 else "Real"  # Use 0.5 threshold
    print(f"Image: {image_path}, Prediction: {prediction}, Score: {score}, Label: {label}")
    return score, label