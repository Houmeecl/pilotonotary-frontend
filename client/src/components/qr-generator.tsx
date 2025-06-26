import { useEffect, useRef } from "react";

interface QrGeneratorProps {
  value: string;
  size?: number;
  className?: string;
}

export default function QrGenerator({ value, size = 200, className = "" }: QrGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Generate a simple QR-like pattern for demo purposes
    // In production, use a proper QR code library like 'qrcode'
    const moduleSize = size / 25;
    ctx.fillStyle = '#000000';

    // Create a simple pattern based on the value
    const hash = value.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    // Draw finder patterns (corners)
    const drawFinderPattern = (x: number, y: number) => {
      // Outer square
      ctx.fillRect(x * moduleSize, y * moduleSize, 7 * moduleSize, 7 * moduleSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect((x + 1) * moduleSize, (y + 1) * moduleSize, 5 * moduleSize, 5 * moduleSize);
      ctx.fillStyle = '#000000';
      ctx.fillRect((x + 2) * moduleSize, (y + 2) * moduleSize, 3 * moduleSize, 3 * moduleSize);
    };

    // Draw corner patterns
    drawFinderPattern(0, 0);
    drawFinderPattern(18, 0);
    drawFinderPattern(0, 18);

    // Draw data modules based on hash
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        // Skip finder pattern areas
        if ((i < 9 && j < 9) || (i < 9 && j > 15) || (i > 15 && j < 9)) continue;

        const shouldFill = (hash + i * j) % 3 === 0;
        if (shouldFill) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
        }
      }
    }

    // Add timing patterns
    ctx.fillStyle = '#000000';
    for (let i = 8; i < 17; i++) {
      if (i % 2 === 0) {
        ctx.fillRect(i * moduleSize, 6 * moduleSize, moduleSize, moduleSize);
        ctx.fillRect(6 * moduleSize, i * moduleSize, moduleSize, moduleSize);
      }
    }

  }, [value, size]);

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <canvas
        ref={canvasRef}
        className="border border-gray-300 rounded-lg shadow-sm"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700">Código QR de Verificación</p>
        <p className="text-xs text-gray-500 font-mono break-all max-w-xs">
          {value}
        </p>
      </div>
    </div>
  );
}
