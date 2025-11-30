# **📄 README – Đánh Giá Mô Hình YOLO** 

## **🎯 1\. Mục đích**

Module này được dùng để:

* Kiểm tra số lượng file trong dataset

* Đánh giá (evaluate) nhiều mô hình YOLO cùng lúc:

  * Pitch Nano

  * Pitch Small

  * Players / Ball / Referee

  * Các mô hình pitch tùy chỉnh

Kết quả trả về:

* **Box mAP50**

* **Box mAP50-95**

* **Pose mAP50** (nếu là model Pose)

* **Pose mAP50-95**

---

## **🧩 2\. Yêu cầu hệ thống**

### **Cài đặt thư viện:**

`pip install ultralytics torch pandas opencv-python`

---

## **📂 3\. Cấu trúc dữ liệu cần có**

`/content/data/datasets/YOLO_Datasets/merged/`  
`│`  
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

---

## **🚀 4\. Cách chạy**

### **Trong Notebook hoặc Terminal:**

`python EvaluationModels.py`

### **Hoặc trong Colab:**

`!python TestModelYoloDetection.py`

---

## **📌 5\. Kết quả output**

Mỗi mô hình sẽ in ra:

`==============================`  
`🔍 Đang đánh giá model: /content/best_pitch_s.pt`  
`==============================`  
`📌 Box mAP50      : 0.995`  
`📌 Box mAP50-95   : 0.986`  
`📌 Pose mAP50     : 0.962`  
`📌 Pose mAP50-95  : 0.874`

---

## **⭐ 6\. Tùy chỉnh danh sách mô hình**

Trong file:

`model_paths = [`  
    `"/content/best_pitch_nano.pt",`  
    `"/content/best_pitch_s.pt",`  
    `"/content/pitch_model_3.pt",`  
    `"/content/pitch_model_4.pt",`  
    `"/content/pitch_model_5.pt"`  
`]`

Bạn có thể thêm bớt tùy thích.

