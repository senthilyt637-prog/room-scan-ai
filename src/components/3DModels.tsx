import { Box, RoundedBox, Cylinder, Sphere } from "@react-three/drei";
import * as THREE from "three";

interface ObjectModelProps {
  detection: {
    bbox: [number, number, number, number];
    class: string;
    score: number;
  };
  position: [number, number, number];
  color: string;
}

export const ObjectModel = ({ detection, position, color }: ObjectModelProps) => {
  const className = detection.class;
  
  // Calculate size based on bbox
  const width = Math.max(0.4, (detection.bbox[2] / 640) * 4);
  const height = Math.max(0.4, (detection.bbox[3] / 480) * 4);
  
  // Render different 3D models based on object type
  switch (className) {
    case "laptop":
      return (
        <group position={position}>
          {/* Laptop base */}
          <RoundedBox args={[width, 0.1, width * 0.8]} radius={0.02} position={[0, 0, 0]}>
            <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
          </RoundedBox>
          {/* Laptop screen */}
          <RoundedBox 
            args={[width, height * 0.8, 0.05]} 
            radius={0.02} 
            position={[0, height * 0.4, -width * 0.3]}
            rotation={[-Math.PI * 0.15, 0, 0]}
          >
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
          </RoundedBox>
          {/* Screen glow */}
          <mesh position={[0, height * 0.4, -width * 0.28]} rotation={[-Math.PI * 0.15, 0, 0]}>
            <planeGeometry args={[width * 0.9, height * 0.7]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
          </mesh>
          <pointLight color={color} intensity={3} distance={4} />
        </group>
      );
      
    case "cell phone":
    case "phone":
      return (
        <group position={position}>
          <RoundedBox args={[width * 0.5, height, 0.1]} radius={0.05}>
            <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
          </RoundedBox>
          {/* Screen */}
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[width * 0.45, height * 0.9]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
          </mesh>
          <pointLight color={color} intensity={2} distance={3} />
        </group>
      );
      
    case "keyboard":
      return (
        <group position={position}>
          <RoundedBox args={[width, 0.15, width * 0.4]} radius={0.02}>
            <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
          </RoundedBox>
          {/* Keys */}
          {Array.from({ length: 8 }).map((_, i) => (
            <RoundedBox 
              key={i} 
              args={[0.08, 0.05, 0.08]} 
              radius={0.01}
              position={[(i - 3.5) * 0.12, 0.1, 0]}
            >
              <meshStandardMaterial color="#2a2a2a" />
            </RoundedBox>
          ))}
          <pointLight color={color} intensity={2} distance={3} />
        </group>
      );
      
    case "mouse":
      return (
        <group position={position}>
          <Sphere args={[width * 0.6, 16, 16]} scale={[1, 0.6, 1.2]}>
            <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
          </Sphere>
          {/* Mouse buttons */}
          <Box args={[width * 0.5, 0.02, width * 0.3]} position={[0, width * 0.35, 0]}>
            <meshStandardMaterial color="#1a1a1a" />
          </Box>
          <pointLight color={color} intensity={2} distance={3} />
        </group>
      );
      
    case "monitor":
    case "tv":
      return (
        <group position={position}>
          {/* Screen frame */}
          <RoundedBox args={[width, height, 0.1]} radius={0.03}>
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
          </RoundedBox>
          {/* Screen display */}
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[width * 0.9, height * 0.9]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
          </mesh>
          {/* Stand */}
          <Cylinder args={[0.1, 0.15, height * 0.3]} position={[0, -height * 0.65, 0]}>
            <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
          </Cylinder>
          <pointLight color={color} intensity={3} distance={4} />
        </group>
      );
      
    case "cup":
    case "bottle":
      return (
        <group position={position}>
          <Cylinder args={[width * 0.3, width * 0.35, height, 16]}>
            <meshStandardMaterial 
              color={color} 
              metalness={0.9} 
              roughness={0.1}
              transparent
              opacity={0.8}
            />
          </Cylinder>
          {/* Lid/cap */}
          <Cylinder args={[width * 0.3, width * 0.25, 0.1]} position={[0, height * 0.55, 0]}>
            <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} />
          </Cylinder>
          <pointLight color={color} intensity={2} distance={3} />
        </group>
      );
      
    case "book":
      return (
        <group position={position}>
          <RoundedBox args={[width, 0.15, width * 0.7]} radius={0.02}>
            <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
          </RoundedBox>
          {/* Pages */}
          <Box args={[width * 0.95, 0.12, width * 0.65]} position={[width * 0.02, 0, 0]}>
            <meshStandardMaterial color="#f5f5f5" />
          </Box>
          <pointLight color={color} intensity={1.5} distance={3} />
        </group>
      );
      
    case "clock":
      return (
        <group position={position}>
          <Cylinder args={[width * 0.5, width * 0.5, 0.15, 32]}>
            <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
          </Cylinder>
          {/* Clock face */}
          <Cylinder args={[width * 0.48, width * 0.48, 0.02, 32]} position={[0, 0, 0.09]}>
            <meshStandardMaterial color="#ffffff" />
          </Cylinder>
          {/* Clock hands */}
          <Box args={[0.02, width * 0.3, 0.02]} position={[0, 0, 0.11]}>
            <meshStandardMaterial color="#1a1a1a" />
          </Box>
          <Box args={[width * 0.25, 0.02, 0.02]} position={[0, 0, 0.11]}>
            <meshStandardMaterial color="#1a1a1a" />
          </Box>
          <pointLight color={color} intensity={2} distance={3} />
        </group>
      );
      
    case "chair":
      return (
        <group position={position}>
          {/* Seat */}
          <RoundedBox args={[width, 0.1, width]} radius={0.02}>
            <meshStandardMaterial color={color} roughness={0.6} metalness={0.2} />
          </RoundedBox>
          {/* Backrest */}
          <RoundedBox 
            args={[width, height * 0.6, 0.1]} 
            radius={0.02}
            position={[0, height * 0.35, -width * 0.45]}
          >
            <meshStandardMaterial color={color} roughness={0.6} metalness={0.2} />
          </RoundedBox>
          {/* Legs */}
          {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map((pos, i) => (
            <Cylinder 
              key={i}
              args={[0.05, 0.05, height * 0.4]} 
              position={[pos[0] * width * 0.4, -height * 0.25, pos[1] * width * 0.4]}
            >
              <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
            </Cylinder>
          ))}
          <pointLight color={color} intensity={2} distance={3} />
        </group>
      );
      
    case "potted plant":
    case "vase":
      return (
        <group position={position}>
          {/* Pot */}
          <Cylinder args={[width * 0.35, width * 0.45, height * 0.5, 16]}>
            <meshStandardMaterial color="#8b4513" roughness={0.8} metalness={0.1} />
          </Cylinder>
          {/* Plant/flowers */}
          <Sphere args={[width * 0.5, 8, 8]} position={[0, height * 0.4, 0]}>
            <meshStandardMaterial color={color} roughness={0.9} metalness={0.1} />
          </Sphere>
          <pointLight color={color} intensity={2} distance={3} />
        </group>
      );
      
    default:
      // Fallback to rounded box with enhanced visuals
      return (
        <group position={position}>
          <RoundedBox args={[width, height, 0.3]} radius={0.05}>
            <meshStandardMaterial 
              color={color}
              emissive={color}
              emissiveIntensity={0.5}
              metalness={0.6}
              roughness={0.3}
            />
          </RoundedBox>
          <pointLight color={color} intensity={2} distance={3} />
        </group>
      );
  }
};
