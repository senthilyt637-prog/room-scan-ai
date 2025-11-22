import { Card } from "@/components/ui/card";
import { Activity, Box, Cpu } from "lucide-react";

interface Detection {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

interface ScanStatsProps {
  detections: Detection[];
  isScanning: boolean;
}

export const ScanStats = ({ detections, isScanning }: ScanStatsProps) => {
  const avgConfidence = detections.length > 0
    ? (detections.reduce((sum, d) => sum + d.score, 0) / detections.length * 100).toFixed(1)
    : "0.0";

  const detectionTypes = [...new Set(detections.map(d => d.class))];

  return (
    <Card className="bg-card border-border p-4">
      <div className="mb-3">
        <h3 className="text-sm font-mono text-primary uppercase tracking-wider">
          Scan Analytics
        </h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
            <Activity className={`w-5 h-5 text-primary ${isScanning ? 'pulse-glow' : ''}`} />
          </div>
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">Status</div>
            <div className="text-sm font-mono text-foreground">
              {isScanning ? "ACTIVE" : "IDLE"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-scan-detected/10 flex items-center justify-center">
            <Box className="w-5 h-5 text-scan-detected" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">Objects</div>
            <div className="text-sm font-mono text-foreground">
              {detections.length} detected
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-accent/10 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">Confidence</div>
            <div className="text-sm font-mono text-foreground">
              {avgConfidence}%
            </div>
          </div>
        </div>
      </div>

      {detectionTypes.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground mb-2">Detected Types:</div>
          <div className="flex flex-wrap gap-2">
            {detectionTypes.map((type, i) => (
              <span
                key={i}
                className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded border border-primary/30"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
