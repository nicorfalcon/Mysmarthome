import { useRef, useState, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';

interface ColorPickerProps {
  initialColor: string;
  onColorSelect: (color: string) => void;
  onColorConfirm: (color: string) => void; // New: called when user confirms
  onClose: () => void;
}

export function ColorPicker({ initialColor, onColorSelect, onColorConfirm, onClose }: ColorPickerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [isDragging, setIsDragging] = useState(false);
  const [thumbPosition, setThumbPosition] = useState<{ x: number; y: number } | null>(null);

  // Draw color wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw color wheel
    for (let angle = 0; angle < 360; angle += 1) {
      const startAngle = (angle - 90) * Math.PI / 180;
      const endAngle = (angle + 1 - 90) * Math.PI / 180;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, '#FFFFFF');
      gradient.addColorStop(0.7, `hsl(${angle}, 100%, 50%)`);
      gradient.addColorStop(1, `hsl(${angle}, 100%, 40%)`);

      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Draw center white circle for better color selection
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.15, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
  }, []);

  const getColorAndPositionFromEvent = useCallback((clientX: number, clientY: number): { color: string; position: { x: number; y: number } } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const canvasX = clientX - rect.left;
    const canvasY = clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10;

    // Calculate distance from center
    const dx = canvasX - centerX;
    const dy = canvasY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Clamp to circle bounds
    let finalX = canvasX;
    let finalY = canvasY;
    
    if (distance > radius) {
      // Constrain to circle edge
      const angle = Math.atan2(dy, dx);
      finalX = centerX + Math.cos(angle) * radius;
      finalY = centerY + Math.sin(angle) * radius;
    }

    // Recalculate dx, dy with clamped position
    const clampedDx = finalX - centerX;
    const clampedDy = finalY - centerY;
    const clampedDistance = Math.sqrt(clampedDx * clampedDx + clampedDy * clampedDy);

    // Calculate angle
    const angle = Math.atan2(clampedDy, clampedDx) * 180 / Math.PI + 90;
    const normalizedAngle = (angle + 360) % 360;

    // Calculate distance from center
    const normalizedDistance = Math.min(clampedDistance / radius, 1);

    // Calculate saturation and lightness based on distance
    const saturation = Math.round(normalizedDistance * 100);
    const lightness = Math.round(100 - (normalizedDistance * 50));

    const color = `hsl(${Math.round(normalizedAngle)}, ${saturation}%, ${lightness}%)`;

    return {
      color,
      position: { x: finalX, y: finalY }
    };
  }, []);

  const hslToHex = (hsl: string): string => {
    // Parse HSL string
    const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!match) return hsl;

    const h = parseInt(match[1]) / 360;
    const s = parseInt(match[2]) / 100;
    const l = parseInt(match[3]) / 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    const result = getColorAndPositionFromEvent(e.clientX, e.clientY);
    if (result) {
      const hexColor = hslToHex(result.color);
      setSelectedColor(hexColor);
      setThumbPosition(result.position);
      onColorSelect(hexColor); // Live preview only - doesn't save to recent colors
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const result = getColorAndPositionFromEvent(e.clientX, e.clientY);
    if (result) {
      const hexColor = hslToHex(result.color);
      setSelectedColor(hexColor);
      setThumbPosition(result.position);
      onColorSelect(hexColor); // Live preview only - doesn't save to recent colors
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleApply = () => {
    onColorConfirm(selectedColor); // Confirm selection - this will save to recent colors
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
      onClick={onClose}
    >
      <div
        className="relative"
        style={{
          backgroundColor: 'var(--background)',
          borderRadius: '24px',
          padding: '28px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-white"
            style={{ fontSize: '18px', fontWeight: 600 }}
          >
            Select Color
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-full transition-all"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'var(--card)',
            }}
            onMouseDown={(e) => (e.currentTarget.style.backgroundColor = 'var(--muted)')}
            onMouseUp={(e) => (e.currentTarget.style.backgroundColor = 'var(--card)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--card)')}
          >
            <X size={18} color="#B8B8C2" />
          </button>
        </div>

        {/* Color Wheel Canvas */}
        <div className="flex flex-col items-center gap-6">
          <div 
            ref={containerRef}
            style={{ 
              position: 'relative',
              width: '280px',
              height: '280px'
            }}
          >
            <canvas
              ref={canvasRef}
              width={280}
              height={280}
              className="cursor-pointer"
              style={{
                borderRadius: '50%',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            />
            
            {/* Drag Indicator (Thumb) */}
            {thumbPosition && (
              <div
                style={{
                  position: 'absolute',
                  left: `${thumbPosition.x}px`,
                  top: `${thumbPosition.y}px`,
                  width: '24px',
                  height: '24px',
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '50%',
                  border: '3px solid #FFFFFF',
                  backgroundColor: selectedColor,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.1)',
                  pointerEvents: 'none',
                  transition: isDragging ? 'none' : 'all 150ms ease-out',
                }}
              />
            )}
          </div>

          {/* Selected Color Preview */}
          <div className="flex items-center gap-4">
            <div
              className="rounded-xl"
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: selectedColor,
                border: '3px solid #7C5CFF',
                boxShadow: `0 0 20px ${selectedColor}40`,
                transition: 'background-color 150ms ease-out',
              }}
            />
            <div>
              <p
                style={{ color: 'var(--muted-foreground)', fontSize: '12px', marginBottom: '4px' }}
              >
                Selected Color
              </p>
              <p
                className="text-white"
                style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'monospace' }}
              >
                {selectedColor.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleApply}
            className="w-full py-3.5 rounded-xl transition-all"
            style={{
              background: 'linear-gradient(135deg, #7C5CFF, #6B4FE0)',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 600,
              boxShadow: '0 4px 16px rgba(124,92,255,0.4)',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Apply Color
          </button>
        </div>
      </div>
    </div>
  );
}