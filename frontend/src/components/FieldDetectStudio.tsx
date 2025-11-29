import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Play, Cpu, Sparkles, Camera, Download } from "lucide-react";
import axios from "axios";
import { VideoPlayer } from "./VideoPlayer"; // chỉnh path nếu khác

interface DetectionResult {
  label: string;
  confidence: number;
  bbox: { x: number; y: number; width: number; height: number };
  color: number[];
}

interface Keypoint {
  x: number;
  y: number;
  index: number;
}

export const FieldDetectStudio = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleUploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validImageTypes = ["image/jpeg", "image/png", "image/bmp", "image/gif"];
      const validVideoTypes = ["video/mp4", "video/mov"];
      if (!validImageTypes.includes(file.type) && !validVideoTypes.includes(file.type)) {
        alert("Vui lòng tải ảnh (JPG, PNG, BMP, GIF) hoặc video (MP4, MOV)!");
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setStats(null);
      setDownloadUrl(null);
    }
  };

  const handleProcessImage = async () => {
    if (!uploadedImage) return;
    setIsProcessing(true);
    setStats(null);
    setDownloadUrl(null);

    const fileInput = document.getElementById("imageUpload") as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/process", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { download_url, processing_time, counts, confidence_avg } = response.data;

      // Lưu stats và link tải xuống
      setStats({ counts, confidence_avg, processing_time });
      setDownloadUrl(download_url);

      // Dùng luôn ảnh xử lý từ backend hiển thị
      const resultBlob = await fetch(`http://localhost:8000${download_url}`).then(res => res.blob());
      const imageUrl = URL.createObjectURL(resultBlob);
      setUploadedImage(imageUrl);

    } catch (error) {
      console.error("Lỗi khi xử lý file:", error);
      alert("Có lỗi xảy ra khi xử lý file!");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadImage = () => {
    if (downloadUrl) {
      window.open(`http://localhost:8000${downloadUrl}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 rounded-xl bg-gradient-ai shadow-glow">
              <Cpu className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-ai bg-clip-text text-transparent">
                AI Sports Vision
              </h1>
              <p className="text-muted-foreground">
                Hệ thống nhận diện thông minh: sân bóng, bóng và cầu thủ
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <Button
              className="bg-ai-primary hover:bg-ai-primary/90 text-white shadow-glow"
              onClick={() => document.getElementById("imageUpload")?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Tải file lên
            </Button>
            <input
              id="imageUpload"
              type="file"
              accept="image/jpeg,image/png,image/bmp,image/gif,video/mp4,video/mov"
              className="hidden"
              onChange={handleUploadImage}
            />

            <Button
              onClick={handleProcessImage}
              disabled={isProcessing || !uploadedImage}
              className="bg-ai-primary hover:bg-ai-primary/90 text-white shadow-glow"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Bắt đầu
                </>
              )}
            </Button>

            <Button
              onClick={handleDownloadImage}
              disabled={!downloadUrl}
              className="bg-ai-primary hover:bg-ai-primary/90 text-white shadow-glow"
            >
              <Download className="h-4 w-4 mr-2" />
              Tải xuống
            </Button>

            <Badge variant="secondary" className="px-4 py-2 bg-ai-primary hover:bg-ai-primary/90 text-white shadow-glow">
              Mô hình: YOLOv8-Architecture
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="p-6 bg-card border-border shadow-card">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Kết quả dự đoán
                </h2>
                <div className="w-full max-h-[400px] bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  {uploadedImage ? (
                    <img
                      src={uploadedImage}
                      alt="Result"
                      className="w-full h-auto object-contain"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Camera className="h-12 w-12 mx-auto mb-2" />
                      <div>Chưa có file nào, hãy tải file lên</div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border shadow-card">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Thống kê kết quả
                </h3>
                {stats ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-foreground">Tổng số đối tượng:</span>
                      <span className="text-ai-primary font-bold text-xl">
                        {Object.values(stats.counts).reduce((a: any, b: any) => a + b, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-foreground">Độ tin cậy trung bình:</span>
                      <span className="text-ai-secondary font-bold text-xl">
                        {(stats.confidence_avg * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-foreground">
                        Phân loại theo đối tượng:
                      </h4>
                      {Object.entries(stats.counts).map(([label, count]) => (
                        <div
                          key={label}
                          className="flex justify-between items-center p-2 bg-muted/50 rounded"
                        >
                          <span className="text-sm text-foreground">{label}:</span>
                          <Badge variant="secondary">{count as number}</Badge>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-foreground">Thời gian xử lý (ms):</span>
                      <span className="text-ai-secondary font-bold text-xl">
                        {stats.processing_time}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <div className="text-sm">Chưa có kết quả dự đoán</div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <Card className="p-6 bg-card border-border shadow-card">
            <VideoPlayer isWaiting={isProcessing} />
          </Card>
        </div>

        <Card className="p-4 bg-ai-surface border-border shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm text-muted-foreground">System Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <Cpu className="h-4 w-4 text-ai-primary" />
                <span className="text-sm text-muted-foreground">GPU Accelerated</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
