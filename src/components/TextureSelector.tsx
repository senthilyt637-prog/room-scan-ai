import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface TextureSelectorProps {
  selectedTexture: string;
  onTextureChange: (texture: string) => void;
}

const textures = [
  { id: "paint", name: "Paint", color: "#1a2332" },
  { id: "brick", name: "Brick", color: "#8b4513" },
  { id: "wallpaper", name: "Wallpaper", color: "#4a5568" },
  { id: "concrete", name: "Concrete", color: "#6b7280" },
];

export const TextureSelector = ({ selectedTexture, onTextureChange }: TextureSelectorProps) => {
  return (
    <Card className="bg-card border-border p-4">
      <div className="mb-3">
        <h3 className="text-sm font-mono text-primary uppercase tracking-wider">
          Material Library
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Select wall texture
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {textures.map((texture) => (
          <button
            key={texture.id}
            onClick={() => onTextureChange(texture.id)}
            className={`
              relative overflow-hidden rounded border-2 transition-all h-20
              ${selectedTexture === texture.id 
                ? "border-primary shadow-[0_0_15px_hsl(var(--primary)/0.5)]" 
                : "border-border hover:border-primary/50"
              }
            `}
          >
            <div 
              className="absolute inset-0" 
              style={{ backgroundColor: texture.color }}
            />
            {selectedTexture === texture.id && (
              <div className="absolute inset-0 bg-primary/10" />
            )}
            <div className="relative z-10 h-full flex items-center justify-center">
              <span className={`
                text-xs font-mono uppercase tracking-wider
                ${selectedTexture === texture.id ? "text-primary" : "text-foreground"}
              `}>
                {texture.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};
