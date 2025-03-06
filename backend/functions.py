import cv2
import numpy as np
from tensorflow.keras.models import load_model
import os
from mtcnn import MTCNN
import uuid

model = load_model('C:/Users/Gaurav Ghadi/Desktop/citychain/backend/deepfake_model_balanced.h5')  # Updated model
detector = MTCNN()

# Ensure temp_files directory exists
TEMP_DIR = "temp_files"
os.makedirs(TEMP_DIR, exist_ok=True)

def detect_deepfake(video_path):
    frames = extract_frames(video_path, num_frames=2)
    if len(frames) == 0:
        return 0.5, "Unknown", 0
    
    frame_uint8 = (frames[0] * 255).astype(np.uint8)
    frame_rgb = cv2.cvtColor(frame_uint8, cv2.COLOR_BGR2RGB)
    faces = detector.detect_faces(frame_rgb)
    face_count = len(faces)

    predictions = model.predict(frames)
    score = float(np.mean(predictions))
    label = "Fake" if score > 0.5 else "Real"  # Back to 0.5 with balanced model
    print(f"Video: {video_path}, Predictions: {predictions}, Mean Score: {score}, Label: {label}, Faces: {face_count}")
    return score, label, face_count

def extract_frames(video_path, num_frames=2):
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if total_frames == 0:
        return np.array([])
    step = max(1, total_frames // num_frames)
    frames = []
    for i in range(0, total_frames, step):
        cap.set(cv2.CAP_PROP_POS_FRAMES, i)
        ret, frame = cap.read()
        if ret:
            frame = cv2.resize(frame, (224, 224))
            frames.append(frame)
        if len(frames) >= num_frames:
            break
    cap.release()
    return np.array(frames) / 255.0

def generate_report(video_path, score, label, face_count):
    # Gather video metadata
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    duration = total_frames / fps if fps > 0 else 0
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    cap.release()

    report = f"""
    Deepfake Detection Report
    ------------------------
    Video: {os.path.basename(video_path)}
    Face Analysis Score: {score:.2f} (0 = Real, 1 = Fake)
    Detected Status: {label}
    Faces Detected: {face_count}
    Frame Count: {total_frames}
    Frames Analyzed: 2
    Video Duration: {duration:.2f} seconds
    Resolution: {width}x{height}
    Frame Rate: {fps:.2f} FPS
    Recommendations: {'Review by moderator' if 0.4 <= score <= 0.6 else 'Likely ' + label.lower()}
    """
    # Save report in temp_files folder
    report_path = os.path.join(TEMP_DIR, f"report_{uuid.uuid4()}.txt")
    with open(report_path, "w") as f:
        f.write(report)
    return report, report_path