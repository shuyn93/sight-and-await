import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Camera, Cpu, Sparkles } from "lucide-react";
import { ResultsPanel } from "./ResultsPanel";
import { VideoPlayer } from "./VideoPlayer";

interface DetectionResult {
  id: string;
  label: string;
  confidence: number;
  bbox: { x: number; y: number; width: number; height: number };
}

export const FieldDetectStudio = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<DetectionResult[]>([]);

  // Simulate AI processing
  const handleProcessImage = () => {
    setIsProcessing(true);
    setResults([]);

    // Simulate processing time
    setTimeout(() => {
      const mockResults: DetectionResult[] = [
        {
          id: "1",
          label: "Crop Field",
          confidence: 0.95,
          bbox: { x: 10, y: 15, width: 200, height: 150 }
        },
        {
          id: "2", 
          label: "Irrigation System",
          confidence: 0.87,
          bbox: { x: 250, y: 80, width: 120, height: 90 }
        },
        {
          id: "3",
          label: "Farm Equipment",
          confidence: 0.92,
          bbox: { x: 400, y: 120, width: 180, height: 100 }
        },
        {
          id: "4",
          label: "Livestock Area",
          confidence: 0.78,
          bbox: { x: 50, y: 300, width: 150, height: 120 }
        }
      ];

      setResults(mockResults);
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 rounded-xl bg-gradient-ai shadow-glow">
              <Cpu className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-ai bg-clip-text text-transparent">
                Field Detect Studio
              </h1>
              <p className="text-muted-foreground">AI-powered agricultural field analysis</p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              onClick={handleProcessImage}
              disabled={isProcessing}
              className="bg-ai-primary hover:bg-ai-primary/90 text-white shadow-glow"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Start Detection
                </>
              )}
            </Button>
            
            <Button variant="outline" className="border-border">
              <Camera className="h-4 w-4 mr-2" />
              Camera Input
            </Button>

            <Badge variant="secondary" className="px-4 py-2">
              Model: YOLOv8-Agriculture
            </Badge>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[800px]">
          {/* Results Panel - Left Side */}
          <Card className="p-6 bg-card border-border shadow-card">
            <ResultsPanel isProcessing={isProcessing} results={results} />
          </Card>

          {/* Video Player - Right Side */}
          <Card className="p-6 bg-card border-border shadow-card">
            <VideoPlayer isWaiting={isProcessing} />
          </Card>
        </div>

        {/* Status Footer */}
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