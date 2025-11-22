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
  const position: [number, number, number] = [
    (detection.bbox[0] / 200) - 2,
    2 - (detection.bbox[1] / 200),
    -1.8
  ];

  const getColor = (className: string) => {
    const colorMap: { [key: string]: string } = {
      clock: "#00ffff",
      tv: "#ff00ff",
      laptop: "#00ff00",
      default: "#00ffff"
    };
    return colorMap[className] || colorMap.default;
  };

  return (
    <group position={position}>
      <Box args={[0.3, 0.3, 0.1]}>
        <meshStandardMaterial 
          color={getColor(detection.class)}
          emissive={getColor(detection.class)}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </Box>
      {/* Glow effect */}
      <pointLight 
        color={getColor(detection.class)} 
        intensity={1} 
        distance={2}
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
