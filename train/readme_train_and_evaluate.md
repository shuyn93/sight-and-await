# **📘 README – Module `train_and_evaluate.py`**

Module `train_and_evaluate.py` dùng để **huấn luyện (train)** và **đánh giá (evaluation)** mô hình YOLOv8x-pose trên tập dữ liệu sân bóng \+ keypoints sau khi đã hợp nhất.

---

# **🧩 1\. Chức năng chính**

Module này thực hiện:

### **✅ 1\. Huấn luyện mô hình YOLOv8x-pose**

* Sử dụng CLI của Ultralytics YOLO

* Cho phép cấu hình:

  * batch size

  * epochs

  * learning rate

  * weight decay

  * kích thước ảnh

  * AMP (FP16 để tăng tốc)

### **✅ 2\. Phân tích kết quả huấn luyện**

* Đọc file `results.csv`

* Tìm **epoch tốt nhất** theo chỉ số:  
   ✔ `metrics/mAP50(P)` (Pose mAP50)

### **✅ 3\. Đánh giá mô hình trên tập test**

* Tự động load `best.pt`

* Tính:

  * Box mAP50

  * Pose mAP50

---

# **⚙️ 2\. Yêu cầu hệ thống**

## **📌 Phần mềm:**

* Python ≥ 3.9

* pip ≥ 21

* Ultralytics YOLO ≥ 8.0

* CUDA Toolkit 11.7+ (nếu dùng GPU)

## **📌 Phần cứng:**

* GPU NVIDIA 8GB+ (khuyến nghị)

* VRAM tối thiểu: **8–12GB** đối với YOLOv8x-pose

---

# **📂 3\. Chuẩn bị dữ liệu**

Module này **yêu cầu bạn đã chạy xong bước hợp nhất dữ liệu** bằng file:

`concat_datasets.py`

hoặc giải nén file zip từ đường link trong data/image.

Sau đó, thư mục phải có cấu trúc:

`datasets/`  
`└── YOLO_Datasets/`  
    `└── merged/`  
        `├── images/`  
        `│   ├── train/`  
        `│   ├── val/`  
        `│   └── test/`  
        `│`  
        `├── labels/`  
        `│   ├── train/`  
        `│   ├── val/`  
        `│   └── test/`  
        `│`  
        `└── data.yaml`

Đảm bảo file `data.yaml` mô tả đúng đường dẫn.

---

# **📦 4\. Cài đặt môi trường**

## **Bước 1 — Tạo venv**

`python -m venv venv`  
`source venv/bin/activate     # Mac/Linux`  
`venv\Scripts\activate        # Windows`

## **Bước 2 — Cài ultralytics và dependencies**

`pip install ultralytics`  
`pip install pandas`  
`pip install matplotlib`  
`pip install opencv-python`

## **Kiểm tra YOLO**

`yolo`

Nếu hiện menu CLI → cài đặt thành công.

---

# **▶️ 5\. Cách chạy module `train_and_evaluate.py`**

## **🔥 Lệnh chạy**

`python train_and_evaluate.py`

Không cần truyền tham số, vì đường dẫn đã được cấu hình trong code:

`data_path = "datasets/YOLO_Datasets/merged/data.yaml"`  
`model_path = "yolov8x-pose.pt"`

---

# **🚀 6\. Quá trình chạy gồm 3 giai đoạn**

## **(1) Giải phóng GPU (clear memory)**

Tránh lỗi CUDA OOM.

## **(2) Huấn luyện YOLOv8x-pose**

Chạy bằng câu lệnh:

`yolo`   
`task=pose`   
`mode=train`   
`model=yolov8x-pose.pt`   
`data=...`   
`batch=16`   
`epochs=150`   
`imgsz=640 ...`

Trên GPU các thông số mặc định:

* Batch size: **16**

* Epochs: **150**

* Image size: **640**

* Mosaic: **off**

* FP16: **ON (amp=True)**

### **📁 Kết quả huấn luyện được lưu tại:**

`runs/pose/train/`

---

## **(3) Tìm epoch tốt nhất**

Code tự động tìm:

* Epoch có `Pose mAP50` cao nhất

* In ra Console

---

## **(4) Đánh giá mô hình tốt nhất**

File:

`runs/pose/train/weights/best.pt`

Được đánh giá trên `test` set:

Xuất ra:

`Box mAP50`  
`Pose mAP50`

---

# **📊 7\. Kết quả output**

Sau khi chạy xong, bạn sẽ có:

| File/Folder | Ý nghĩa |
| ----- | ----- |
| `runs/pose/train/weights/best.pt` | Checkpoint tốt nhất |
| `runs/pose/train/results.csv` | Log huấn luyện (mAP, loss…) |
| `runs/pose/train/confusion_matrix.png` | (nếu bật plot=True) |
| `Pose mAP50` | Độ chính xác keypoints |
| `Box mAP50` | Độ chính xác bounding box |

---

# **🧪 8\. Troubleshooting**

### **❌ CUDA Out of Memory**

Giải pháp:

* Giảm batch size → `batch=8`

* Chạy FP16 → mặc định đã `amp=True`

Tắt augmentation mosaic:

 `mosaic=0.0`

* 

---

### **❌ Không tìm thấy `data.yaml`**

Kiểm tra lại đường dẫn trong code:

`data_path = "datasets/YOLO_Datasets/merged/data.yaml"`

---

### **❌ YOLO không chạy**

Cài lại ultralytics:

`pip install --upgrade ultralytics`

---

# **🎉 9\. Kết luận**

`train_and_evaluate.py` là module trung tâm của dự án, đảm nhiệm:

* Huấn luyện YOLOv8x-pose

* Lưu checkpoint

* Chọn epoch tốt nhất

* Đánh giá mAP

* Chuẩn bị model để đưa vào hệ thống demo video

Dùng file này sau khi dữ liệu đã sẵn sàng và trước khi chạy inference video.

