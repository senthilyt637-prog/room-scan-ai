import { useRef, useEffect, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import { Button } from "@/components/ui/button";
import { Camera, StopCircle } from "lucide-react";
import { toast } from "sonner";

interface Detection {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

interface CameraViewProps {
  onDetection: (detections: Detection[]) => void;
  isScanning: boolean;
  setIsScanning: (scanning: boolean) => void;
}

export const CameraView = ({ onDetection, isScanning, setIsScanning }: CameraViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        toast.success("AI Model Loaded", {
          description: "Object detection ready"
        });
      } catch (error) {
        toast.error("Failed to load AI model");
        console.error("Model loading error:", error);
      }
    };
    loadModel();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsScanning(true);
        toast.success("Camera Active", {
          description: "Point at walls to begin scanning"
        });
      }
    } catch (error) {
      toast.error("Camera access denied");
      console.error("Camera error:", error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsScanning(false);
    toast.info("Scanning Stopped");
  };

  const detectObjects = async () => {
    if (!model || !videoRef.current || !canvasRef.current || !isScanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx || video.readyState !== 4) {
      animationRef.current = requestAnimationFrame(detectObjects);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const predictions = await model.detect(video);
    
    // Filter for relevant objects - expanded list
    const relevantClasses = [
      "clock", "tv", "laptop", "mouse", "keyboard", "cell phone", "book", "vase", "potted plant",
      "bottle", "cup", "chair", "couch", "bed", "dining table", "monitor", "remote", "scissors"
    ];
    const filteredPredictions = predictions.filter(pred => 
      relevantClasses.includes(pred.class) && pred.score > 0.4
    );

    console.log("Detections:", filteredPredictions.length, filteredPredictions.map(p => p.class));

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    filteredPredictions.forEach((prediction) => {
      const [x, y, width, height] = prediction.bbox;
      
      // Draw detection box
      ctx.strokeStyle = "#00ffff";
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);
      
      // Draw label background
      ctx.fillStyle = "rgba(0, 255, 255, 0.8)";
      ctx.fillRect(x, y - 25, width, 25);
      
      // Draw label text
      ctx.fillStyle = "#0a0f1a";
      ctx.font = "16px JetBrains Mono";
      ctx.fillText(
        `${prediction.class.toUpperCase()} ${(prediction.score * 100).toFixed(0)}%`,
        x + 5,
        y - 7
      );
    });

    onDetection(filteredPredictions.map(p => ({
      bbox: p.bbox,
      class: p.class,
      score: p.score
    })));

    animationRef.current = requestAnimationFrame(detectObjects);
  };

  useEffect(() => {
    if (isScanning && model) {
      detectObjects();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isScanning, model]);

  return (
    <div className="relative w-full h-full bg-card border border-border rounded-lg overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {isScanning && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary opacity-50 scan-line" />
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
        {!isScanning ? (
          <Button
            onClick={startCamera}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.5)]"
            size="lg"
          >
            <Camera className="mr-2 h-5 w-5" />
            Start Scan
          </Button>
        ) : (
          <Button
            onClick={stopCamera}
            variant="destructive"
            size="lg"
            className="shadow-[0_0_20px_hsl(var(--destructive)/0.5)]"
          >
            <StopCircle className="mr-2 h-5 w-5" />
            Stop Scan
          </Button>
        )}
      </div>

      {!stream && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 pointer-events-none">
          <div className="text-center max-w-md px-4">
            <Camera className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Camera inactive</p>
            <div className="text-xs text-muted-foreground bg-card/50 backdrop-blur-sm border border-border rounded p-3">
              <p className="font-semibold mb-2 text-primary">Detectable Objects:</p>
              <p className="leading-relaxed">laptop, phone, keyboard, mouse, monitor, book, clock, cup, bottle, chair, table, or TV</p>
            </div>
          </div>
        </div>
      )}
      
      {stream && (
        <div className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm border border-primary/30 rounded px-3 py-2 text-xs">
          <div className="text-primary font-mono mb-1">SCANNING ACTIVE</div>
          <div className="text-muted-foreground">Point at: laptop, phone, keyboard, mouse, monitor, book, clock, cup, bottle</div>
        </div>
      )}
    </div>
  );
};
