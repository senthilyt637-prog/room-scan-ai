import { Canvas } from "@react-three/fiber";
import { OrbitControls, Plane, Box } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

interface Detection {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

interface WallVisualizationProps {
  detections: Detection[];
  selectedTexture: string;
}

const Wall = ({ texture }: { texture: string }) => {
  const textureMap: { [key: string]: string } = {
    paint: "#1a2332",
    brick: "#8b4513",
    wallpaper: "#4a5568",
    concrete: "#6b7280",
  };

  return (
    <Plane args={[8, 6]} position={[0, 0, -2]}>
      <meshStandardMaterial 
        color={textureMap[texture] || "#1a2332"} 
        roughness={0.8}
        metalness={0.2}
      />
    </Plane>
  );
};

const DetectedObject = ({ detection, index }: { detection: Detection; index: number }) => {
  // Normalize bbox coordinates to fit on the wall (assuming typical camera resolution)
  // Center the detection on the wall which spans from -4 to 4 (width 8)
  const normalizedX = ((detection.bbox[0] + detection.bbox[2] / 2) / 640) * 8 - 4;
  const normalizedY = (1 - (detection.bbox[1] + detection.bbox[3] / 2) / 480) * 6 - 3;
  
  const position: [number, number, number] = [
    normalizedX,
    normalizedY,
    -1.5  // In front of the wall
  ];

  // Size based on bbox
  const size: [number, number, number] = [
    Math.max(0.3, (detection.bbox[2] / 640) * 4),
    Math.max(0.3, (detection.bbox[3] / 480) * 4),
    0.2
  ];

  const getColor = (className: string) => {
    const colorMap: { [key: string]: string } = {
      clock: "#00ffff",
      tv: "#ff00ff",
      laptop: "#00ff00",
      mouse: "#ffff00",
      keyboard: "#ff8800",
      "cell phone": "#ff0080",
      book: "#8000ff",
      vase: "#00ff80",
      "potted plant": "#80ff00",
      default: "#00ffff"
    };
    return colorMap[className] || colorMap.default;
  };

  return (
    <group position={position}>
      <Box args={size}>
        <meshStandardMaterial 
          color={getColor(detection.class)}
          emissive={getColor(detection.class)}
          emissiveIntensity={0.7}
          transparent
          opacity={0.9}
        />
      </Box>
      {/* Glow effect */}
      <pointLight 
        color={getColor(detection.class)} 
        intensity={2} 
        distance={3}
      />
    </group>
  );
};

export const WallVisualization = ({ detections, selectedTexture }: WallVisualizationProps) => {
  return (
    <div className="relative w-full h-full bg-card border border-border rounded-lg overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
      
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <pointLight position={[0, 0, 3]} intensity={0.5} color="#00ffff" />
        
        <Wall texture={selectedTexture} />
        
        {detections.map((detection, index) => (
          <DetectedObject key={index} detection={detection} index={index} />
        ))}
        
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          maxDistance={10}
          minDistance={2}
        />
      </Canvas>

      <div className="absolute top-4 left-4 bg-card/80 backdrop-blur-sm border border-primary/30 rounded px-3 py-2">
        <div className="text-xs text-primary font-mono">
          3D PREVIEW
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {detections.length} objects detected
        </div>
      </div>
    </div>
  );
};
