import { useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { Eraser, Pen, Undo, Redo, Trash2, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';

const COLORS = [
  '#1a1a1a',
  '#374151',
  '#991b1b',
  '#166534',
  '#1e40af',
  '#7c2d12',
  '#581c87',
  '#0f766e',
];

export interface DrawingCanvasHandle {
  exportImage: () => Promise<string>;
  exportPaths: () => Promise<string>;
  loadPaths: (paths: string) => void;
  clearCanvas: () => void;
}

interface DrawingCanvasProps {
  width?: number;
  height?: number;
}

export const DrawingCanvas = forwardRef<DrawingCanvasHandle, DrawingCanvasProps>(
  ({ width = 600, height = 300 }, ref) => {
    const canvasRef = useRef<ReactSketchCanvasRef>(null);
    const [strokeColor, setStrokeColor] = useState('#1a1a1a');
    const [strokeWidth, setStrokeWidth] = useState(3);
    const [isEraser, setIsEraser] = useState(false);

    useImperativeHandle(ref, () => ({
      exportImage: async () => {
        if (canvasRef.current) {
          return await canvasRef.current.exportImage('png');
        }
        return '';
      },
      exportPaths: async () => {
        if (canvasRef.current) {
          const paths = await canvasRef.current.exportPaths();
          return JSON.stringify(paths);
        }
        return '[]';
      },
      loadPaths: (pathsJson: string) => {
        if (canvasRef.current && pathsJson) {
          try {
            const paths = JSON.parse(pathsJson);
            canvasRef.current.loadPaths(paths);
          } catch (e) {
            console.error('Failed to load paths', e);
          }
        }
      },
      clearCanvas: () => {
        if (canvasRef.current) {
          canvasRef.current.clearCanvas();
        }
      },
    }));

    const handleUndo = () => canvasRef.current?.undo();
    const handleRedo = () => canvasRef.current?.redo();
    const handleClear = () => canvasRef.current?.clearCanvas();

    return (
      <div className="bg-paper rounded-lg border border-border overflow-hidden">
        <div className="flex items-center gap-2 p-2 border-b border-border bg-secondary/30">
          <Button
            variant={!isEraser ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsEraser(false)}
            className="gap-1"
          >
            <Pen className="w-4 h-4" />
            Pen
          </Button>
          <Button
            variant={isEraser ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsEraser(true)}
            className="gap-1"
          >
            <Eraser className="w-4 h-4" />
            Eraser
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <div
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: strokeColor }}
                />
                <Palette className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3">
              <div className="flex gap-2 flex-wrap max-w-[150px]">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                      strokeColor === color ? 'border-primary scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setStrokeColor(color)}
                  />
                ))}
              </div>
              <div className="mt-3">
                <label className="text-xs text-muted-foreground mb-1 block">
                  Size: {strokeWidth}px
                </label>
                <Slider
                  value={[strokeWidth]}
                  onValueChange={([v]) => setStrokeWidth(v)}
                  min={1}
                  max={20}
                  step={1}
                  className="w-full"
                />
              </div>
            </PopoverContent>
          </Popover>

          <div className="w-px h-6 bg-border mx-1" />

          <Button variant="ghost" size="sm" onClick={handleUndo}>
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleRedo}>
            <Redo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClear}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <ReactSketchCanvas
          ref={canvasRef}
          width={`${width}px`}
          height={`${height}px`}
          strokeWidth={isEraser ? strokeWidth * 3 : strokeWidth}
          strokeColor={isEraser ? '#ffffff' : strokeColor}
          canvasColor="transparent"
          style={{
            border: 'none',
            borderRadius: 0,
          }}
        />
      </div>
    );
  }
);

DrawingCanvas.displayName = 'DrawingCanvas';
