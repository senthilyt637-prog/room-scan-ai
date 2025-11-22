import { useState } from "react";
import { CameraView } from "@/components/CameraView";
import { WallVisualization } from "@/components/WallVisualization";
import { TextureSelector } from "@/components/TextureSelector";
import { ScanStats } from "@/components/ScanStats";
import { Scan, Info } from "lucide-react";

interface Detection {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

const Index = () => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedTexture, setSelectedTexture] = useState("paint");

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center">
            <Scan className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-mono text-foreground tracking-tight">
              WALL SCANNER
            </h1>
            <p className="text-sm text-muted-foreground font-mono">
              AI-Powered Room Modeling System
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-2 bg-primary/5 border border-primary/30 rounded p-3 mt-4">
          <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            Point your camera at walls and objects. The AI will detect elements in real-time 
            and create a 3D visualization. Use the texture selector to preview different materials.
          </p>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Left Column - Camera + Stats */}
        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-video">
            <CameraView 
              onDetection={setDetections}
              isScanning={isScanning}
              setIsScanning={setIsScanning}
            />
          </div>
          
          <ScanStats detections={detections} isScanning={isScanning} />
        </div>

        {/* Right Column - 3D View + Textures */}
        <div className="space-y-4">
          <div className="aspect-square">
            <WallVisualization 
              detections={detections}
              selectedTexture={selectedTexture}
            />
          </div>
          
          <TextureSelector 
            selectedTexture={selectedTexture}
            onTextureChange={setSelectedTexture}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-6 text-center">
        <p className="text-xs text-muted-foreground font-mono">
          v1.0.0 | Real-time object detection powered by TensorFlow.js
        </p>
      </footer>
    </div>
  );
};

export default Index;
