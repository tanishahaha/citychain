from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
import uuid
from functions import detect_deepfake, generate_report
from tools import classify_image

app = FastAPI()

# Ensure temp_files directory exists
TEMP_DIR = "temp_files"
os.makedirs(TEMP_DIR, exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process-video")
async def process_video(file: UploadFile = File(...)):
    unique_id = str(uuid.uuid4())
    video_path = os.path.join(TEMP_DIR, f"temp_video_{unique_id}.mp4")
    processed_path = os.path.join(TEMP_DIR, f"processed_video_{unique_id}.mp4")

    with open(video_path, "wb") as f:
        f.write(await file.read())

    score, label, face_count = detect_deepfake(video_path)
    with open(video_path, "rb") as src, open(processed_path, "wb") as dst:
        dst.write(src.read())
    report, report_path = generate_report(video_path, score, label, face_count)

    # # Optionally remove the original temp video to save space (keep processed video and report)
    # os.remove(video_path)
    # return {
    #     "frame_count": 100,  # This is hardcoded; consider calculating it if needed
    #     "face_count": face_count,
    #     "score": score,
    #     "label": label,
    #     "report": report,
    #     "processed_video": processed_path,
    #     "report_file": report_path,
    #     "face_image": "dummy_face_image.jpg"  # Update this if you generate actual face images
    # }

@app.get("/download/{file_name}")
async def download_file(file_name: str):
    # Construct full path in temp_files
    file_path = os.path.join(TEMP_DIR, file_name)
    if os.path.exists(file_path):
        if file_name.endswith('.txt'):
            return FileResponse(file_path, media_type="text/plain", filename=file_name)
        elif file_name.endswith('.mp4'):
            return FileResponse(file_path, media_type="video/mp4", headers={"Accept-Ranges": "bytes"})
    return {"error": "File not found"}

@app.post("/tools/classify-image")
async def tool_classify_image(file: UploadFile = File(...)):
    unique_id = str(uuid.uuid4())
    image_path = os.path.join(TEMP_DIR, f"temp_tool_image_{unique_id}.jpg")
    with open(image_path, "wb") as f:
        f.write(await file.read())
    
    score, label = classify_image(image_path)
    os.remove(image_path)
    return {
        "score": score,
        "label": label
    }