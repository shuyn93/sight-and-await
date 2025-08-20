from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import shutil
import os
from pathlib import Path
from inference import process_image, process_video

app = FastAPI()

# Cho phép truy cập từ frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ["http://localhost:5173"] nếu cần giới hạn
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lấy đường dẫn tuyệt đối đến thư mục 'results'
BASE_DIR = Path(__file__).resolve().parent
results_dir = BASE_DIR / "results"

# Mount thư mục kết quả
app.mount("/backend/results", StaticFiles(directory=results_dir), name="results")

@app.post("/process")
async def process(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[1]
    temp_path = BASE_DIR / f"temp_{file.filename}"

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = (
        process_video(temp_path)
        if ext.lower() in [".mp4", ".mov"]
        else process_image(temp_path)
    )

    os.remove(temp_path)

    # Nếu là dict (image), lấy các thông tin
    if isinstance(result, dict):
        filename = os.path.basename(result["output_path"])
        return JSONResponse(content={
            "output_url": f"/backend/results/{filename}",
            "download_url": f"/download/{filename}",
            "processing_time": result["processing_time_ms"],
            "counts": result["counts"],
            "confidence_avg": result["confidence_avg"],
            "detections": result["detections"],  # Thêm từ inference.py
            "keypoints": result["keypoints"]     # Thêm từ inference.py
        })

    # Nếu là video
    filename = os.path.basename(result)
    return JSONResponse(content={
        "output_url": f"/backend/results/{filename}",
        "download_url": f"/download/{filename}"
    })

from fastapi.responses import FileResponse

@app.get("/download/{filename}")
def download_file(filename: str):
    filepath = results_dir / filename
    return FileResponse(filepath, media_type="application/octet-stream", filename=filename)