import { useRef, useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface CircularDialProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  unit?: string;
  label?: string;
  /** Pass 'fahrenheit' to display temperatures in °F while keeping internal values in °C */
  temperatureUnit?: 'celsius' | 'fahrenheit';
  /** Arc color (default: #7C5CFF) */
  arcColor?: string;
  /** Preset values in Celsius to show as quick-select chips below the dial */
  presets?: number[];
}

// Conversion helpers
const cToF = (c: number) => Math.round(c * 9 / 5 + 32);
const fToC = (f: number) => Math.round((f - 32) * 5 / 9);

export function CircularDial({
  value,
  min,
  max,
  onChange,
  unit = '°',
  label,
  temperatureUnit = 'celsius',
  arcColor = '#7C5CFF',
  presets,
}: CircularDialProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showInputDialog, setShowInputDialog] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const cx = 150;
  const cy = 140;
  const r = 100;
  // Semi-circle arc from 180° (left) to 0° (right) = π to 0
  // We use angles in degrees: start = 180, end = 0 going clockwise through bottom
  // Actually for a semi-circle opening upward: start at left (210°) to right (330°) through bottom
  // Let's do: arc from 200° to 340° (going clockwise), that's a ~140° gap at top
  // Better: classic semi-circle = arc from 180° to 360° (bottom half)
  // For a nice semi-arc: start angle = 210, end angle = 330 (sweeping 240° through bottom)
  // Let's use start=200, end=340, sweep=140° clean semi-arc going through bottom

  // Semi-circular arc: left end = min, right end = max
  // Arc goes from startAngle (left) clockwise to endAngle (right)
  const startAngle = 210; // left end (min)
  const endAngle = 330;   // right end (max)  
  const totalSweep = endAngle - startAngle; // 120° — too small
  
  // Better: use a wider arc. Start at 150° (lower-left), end at 30° (lower-right), sweeping 240° through bottom
  const arcStart = 150; // degrees, left side
  const arcEnd = 30;    // degrees, right side  
  const arcSweep = 360 - arcStart + arcEnd; // 240°

  const degToRad = (d: number) => (d * Math.PI) / 180;

  const polarToCart = (angleDeg: number) => {
    const rad = degToRad(angleDeg);
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  // Background arc path (full track)
  const arcPath = (startDeg: number, sweepDeg: number) => {
    const start = polarToCart(startDeg);
    const endDeg = startDeg + sweepDeg;
    const end = polarToCart(endDeg);
    const largeArc = sweepDeg > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  };

  const percentage = (value - min) / (max - min);
  const activeSweep = percentage * arcSweep;
  const handleAngle = arcStart + activeSweep;
  const handlePos = polarToCart(handleAngle);

  const angleFromPoint = useCallback(
    (clientX: number, clientY: number) => {
      if (!svgRef.current) return null;
      const rect = svgRef.current.getBoundingClientRect();
      const scaleX = 300 / rect.width;
      const scaleY = 280 / rect.height;
      const svgX = (clientX - rect.left) * scaleX;
      const svgY = (clientY - rect.top) * scaleY;
      let angle = (Math.atan2(svgY - cy, svgX - cx) * 180) / Math.PI;
      if (angle < 0) angle += 360;
      return angle;
    },
    []
  );

  const angleToValue = useCallback(
    (angle: number) => {
      // Normalize angle relative to arcStart
      let rel = angle - arcStart;
      if (rel < 0) rel += 360;
      // If angle is in the dead zone (top), clamp
      if (rel > arcSweep + 30) {
        // Closer to start
        return min;
      }
      if (rel > arcSweep) {
        return max;
      }
      const pct = Math.max(0, Math.min(1, rel / arcSweep));
      return Math.round(min + pct * (max - min));
    },
    [min, max, arcSweep]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    (e.target as SVGElement).closest('svg')?.setPointerCapture?.(e.pointerId);
    try { (e.target as Element).setPointerCapture(e.pointerId); } catch {}
    const angle = angleFromPoint(e.clientX, e.clientY);
    if (angle !== null) onChange(angleToValue(angle));
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const angle = angleFromPoint(e.clientX, e.clientY);
    if (angle !== null) onChange(angleToValue(angle));
  };

  const handlePointerUp = () => setIsDragging(false);

  const handleTemperatureClick = () => {
    if (!isDragging) {
      // Show value in the currently selected display unit
      const isFahrenheit = temperatureUnit === 'fahrenheit';
      setInputValue(isFahrenheit ? cToF(value).toString() : value.toString());
      setShowInputDialog(true);
    }
  };

  const handleInputSubmit = () => {
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      // If fahrenheit, convert input back to Celsius before passing to onChange
      const isFahrenheit = temperatureUnit === 'fahrenheit';
      const celsiusValue = isFahrenheit ? fToC(numValue) : Math.round(numValue);
      const clampedValue = Math.max(min, Math.min(max, celsiusValue));
      onChange(clampedValue);
    }
    setShowInputDialog(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
    }
  };

  const trackPath = arcPath(arcStart, arcSweep);
  const activePath = activeSweep > 0.5 ? arcPath(arcStart, activeSweep) : '';

  // Min/Max label positions
  const minLabelPos = polarToCart(arcStart);
  const maxLabelPos = polarToCart(arcStart + arcSweep);

  // --- Derived display values (convert C→F when needed) ---
  const isFahrenheit = temperatureUnit === 'fahrenheit';
  const displayValue = isFahrenheit ? cToF(value) : value;
  const displayMin   = isFahrenheit ? cToF(min)   : min;
  const displayMax   = isFahrenheit ? cToF(max)   : max;
  const displayUnit  = isFahrenheit ? '°F' : (unit === '°' ? '°C' : unit);

  return (
    <div
      className="p-4 mb-3"
      style={{
        backgroundColor: 'var(--card)',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
      }}
    >
      {label && (
        <p className="text-white mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
          {label}
        </p>
      )}
      <div className="flex justify-center items-center" style={{ paddingTop: '8px', paddingBottom: '0' }}>
        <svg
          ref={svgRef}
          viewBox="0 0 300 220"
          style={{ width: '260px', height: 'auto', touchAction: 'none', userSelect: 'none' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <defs>
            <linearGradient id="dialGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={arcColor} />
              <stop offset="100%" stopColor={arcColor} stopOpacity="0.8" />
            </linearGradient>
            <filter id="handleGlow">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={arcColor} floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Inactive track */}
          <path
            d={trackPath}
            fill="none"
            stroke="var(--background)"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Active arc */}
          {activePath && (
            <path
              d={activePath}
              fill="none"
              stroke="url(#dialGradient)"
              strokeWidth="14"
              strokeLinecap="round"
              style={{ transition: isDragging ? 'none' : 'd 150ms ease' }}
            />
          )}

          {/* Knob handle */}
          <circle
            cx={handlePos.x}
            cy={handlePos.y}
            r="12"
            fill="#FFFFFF"
            filter="url(#handleGlow)"
            style={{
              transition: isDragging ? 'none' : 'cx 150ms ease, cy 150ms ease',
              cursor: 'grab',
            }}
          />
          <circle
            cx={handlePos.x}
            cy={handlePos.y}
            r="5"
            fill={arcColor}
            style={{
              transition: isDragging ? 'none' : 'cx 150ms ease, cy 150ms ease',
            }}
          />

          {/* Center value */}
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            fill="#FFFFFF"
            style={{
              fontSize: '48px',
              fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
              cursor: 'pointer',
            }}
            onClick={handleTemperatureClick}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {displayValue}{displayUnit}
          </text>
        </svg>
      </div>

      {/* Preset chips + +/- buttons */}
      {presets && presets.length > 0 && (
        <div className="mt-1">
          {/* Preset chips */}
          <div className="flex justify-center gap-2 mb-4">
            {presets.map((preset) => {
              const displayPreset = isFahrenheit ? cToF(preset) : preset;
              const isActive = value === preset;
              return (
                <button
                  key={preset}
                  onClick={() => onChange(preset)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: 500,
                    backgroundColor: isActive ? arcColor : 'var(--muted)',
                    color: isActive ? '#FFFFFF' : '#B8B8C2',
                    border: 'none',
                    transition: 'all 150ms ease',
                  }}
                >
                  {displayPreset}{displayUnit}
                </button>
              );
            })}
          </div>
          {/* +/- buttons */}
          <div className="flex justify-center gap-6">
            <button
              onClick={() => onChange(Math.max(min, value - 5))}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--muted)',
                color: '#FFFFFF',
                fontSize: '22px',
                fontWeight: 400,
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              −
            </button>
            <button
              onClick={() => onChange(Math.min(max, value + 5))}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: arcColor,
                color: '#FFFFFF',
                fontSize: '22px',
                fontWeight: 400,
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Temperature Input Dialog */}
      <Dialog open={showInputDialog} onOpenChange={setShowInputDialog}>
        <DialogContent
          style={{
            backgroundColor: 'var(--card)',
            border: 'none',
            borderRadius: '12px',
            maxWidth: '320px',
          }}
        >
          <DialogHeader>
            <DialogTitle
              style={{
                color: '#FFFFFF',
                fontSize: '18px',
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Set Temperature
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-2">
              <label
                style={{
                  color: '#B8B8C2',
                  fontSize: '13px',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Enter temperature ({displayMin}{displayUnit} – {displayMax}{displayUnit})
              </label>
              <input
                type="number"
                inputMode="numeric"
                min={displayMin}
                max={displayMax}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleInputKeyDown}
                autoFocus
                style={{
                  backgroundColor: '#1E1E22',
                  border: '1px solid #3A3A44',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontFamily: "'Inter', sans-serif",
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#7C5CFF';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#3A3A44';
                }}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowInputDialog(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#3A3A44',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: "'Inter', sans-serif",
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleInputSubmit}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'linear-gradient(135deg, #7C5CFF, #6B4FE0)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: "'Inter', sans-serif",
                  cursor: 'pointer',
                }}
              >
                Set
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}