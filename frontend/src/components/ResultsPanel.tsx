import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Eye, Target, Zap } from "lucide-react";
import { useState, useEffect } from "react";

interface DetectionResult {
  id: string;
  label: string;
  confidence: number;
  bbox: { x: number; y: number; width: number; height: number };
}

interface ResultsPanelProps {
  isProcessing: boolean;
  results: DetectionResult[];
}

export const ResultsPanel = ({ isProcessing, results }: ResultsPanelProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setProgress(prev => prev < 95 ? prev + 5 : prev);
      }, 200);
      return () => clearInterval(interval);
    } else {
      setProgress(100);
    }
  }, [isProcessing]);

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-ai">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Detection Results</h2>
            <p className="text-sm text-muted-foreground">Real-time field analysis</p>
          </div>
        </div>
        {isProcessing && (
          <Badge variant="secondary" className="animate-pulse-glow">
            <Zap className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        )}
      </div>

      {/* Progress Bar */}
      {isProcessing && (
        <Card className="p-4 bg-ai-surface border-border shadow-card">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Model Processing</span>
              <span className="text-ai-primary font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </Card>
      )}

      {/* Results Display */}
      <div className="flex-1 space-y-4">
        {results.length > 0 ? (
          <>
            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 bg-gradient-surface border-border shadow-card">
                <div className="text-center">
                  <div className="text-2xl font-bold text-ai-primary">{results.length}</div>
                  <div className="text-xs text-muted-foreground">Objects Detected</div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-surface border-border shadow-card">
                <div className="text-center">
                  <div className="text-2xl font-bold text-ai-secondary">
                    {Math.round(results.reduce((acc, r) => acc + r.confidence, 0) / results.length)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Avg Confidence</div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-surface border-border shadow-card">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    {results.filter(r => r.confidence > 0.8).length}
                  </div>
                  <div className="text-xs text-muted-foreground">High Confidence</div>
                </div>
              </Card>
            </div>

            {/* Detection List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <Card 
                  key={result.id} 
                  className="p-4 bg-ai-surface hover:bg-ai-surface-hover border-border shadow-card transition-all duration-200 animate-slide-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-ai-primary/10">
                        <Eye className="h-4 w-4 text-ai-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{result.label}</div>
                        <div className="text-sm text-muted-foreground">
                          Position: ({result.bbox.x}, {result.bbox.y})
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={result.confidence > 0.8 ? "default" : "secondary"}
                        className={result.confidence > 0.8 ? "bg-ai-primary" : ""}
                      >
                        {Math.round(result.confidence * 100)}%
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : !isProcessing ? (
          <Card className="p-8 bg-ai-surface border-border shadow-card h-full flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="p-4 rounded-full bg-muted/10 w-fit mx-auto">
                <Target className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">No Results Yet</h3>
                <p className="text-sm text-muted-foreground">Upload an image to start detection</p>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-8 bg-ai-surface border-border shadow-card h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="p-4 rounded-full bg-ai-primary/10 w-fit mx-auto animate-pulse-glow">
                <Zap className="h-8 w-8 text-ai-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Processing Image</h3>
                <p className="text-sm text-muted-foreground">AI model is analyzing your data...</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};