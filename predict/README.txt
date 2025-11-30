🎯 Thử nghiệm các phương pháp tối ưu trên video


 📌 Mô tả
Dự án này gồm 4 bản test sử dụng mô hình YOLO để phát hiện đối tượng trong video.Mỗi bản tét có cách xử lý khác nhau: chạy bằng fp32, chạy bằng fp16, sử dụng dự đoán thưa bằng cách lặp và nội suy quang lưu

 📌 Yêu cầu hệ thống
- Thư viện:
  - `ultralytics`
  - `opencv-python`
  - `numpy`

📌Bộ dữ liệu
Tiến hành test trên video Test30s.mp4 

📌Mô hình 
Sử dụng mô hình best_n.pt
📌Các file chính
1. fp32.ipynb
* Mục tiêu: Chạy YOLO trên tất cả khung hình của video sử dụng fp32
* Đầu ra:
   * Video: output_full_prediction_fp32.mp4
   * JSON: predictions_full.json
2. fp16.ipynb
* Mục tiêu: Chạy YOLO trên tất cả khung hình của video sử dụng fp16 để giảm dung lượng bộ nhớ và tăng tốc độ
* Đầu ra:
   * Video: output_full_prediction_fp16.mp4
   * JSON: predictions_full_no_interpolation.json
3. Dự_đoán_thưa(Lặp).ipynb
* Mục tiêu:  Chạy YOLO mỗi 5 khung hình, 4 khung hình giữa dùng lại kết quả trước đó nhằm tăng tốc độ xử lý
* Đầu ra:
   * Video: output_repeat5.mp4
   * JSON: predictions_repeat5.json
4. Nội_suy_quang_lưu.ipynb
* Mục tiêu: làm khung hình chạy mượt mà hơn
* Đầu ra:
   * Video: output_detection_optical_flow.mp4 
   * JSON: predictions_sparse.json

Hướng dẫn kết nối Google Drive trên Colab
- Mở notebook trên Colab (File → Open notebook → chọn từ Drive nếu notebook đã lưu trong Drive).
- Bật GPU: Runtime → Change runtime type → Hardware accelerator → GPU.

1) Mount Drive (chạy trong ô code đầu notebook)
from google.colab import drive
drive.mount('/content/drive')

2) Cài phụ thuộc (nên dùng opencv-python-headless trên Colab)
!pip install -U ultralytics opencv-python-headless numpy

3) Thiết lập đường dẫn (ví dụ)
BASE_DIR = "/content/drive/MyDrive/Thử nghiệm tối ưu"
MODEL_PATH = f"{BASE_DIR}/best_n.pt"
VIDEO_PATH = f"{BASE_DIR}/Test30s.mp4"
OUTPUT_DIR = f"{BASE_DIR}/outputs"

4) Tạo thư mục output nếu cần
import os
os.makedirs(OUTPUT_DIR, exist_ok=True)

Ghi chú ngắn:
- Đảm bảo bạn đã upload best_n.pt và Test30s.mp4 vào thư mục trên Drive.
- Sau khi chạy model với save_dir=OUTPUT_DIR, các file .mp4 và .json sẽ nằm trong Drive tại OUTPUT_DIR.