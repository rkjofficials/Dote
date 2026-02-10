import { useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { Eraser, Pen, Undo, Redo, Trash2, Palette, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const COLORS = [
  '#1a1a1a',
  '#374151',
  '#991b1b',
  '#166534',
  '#1e40af',
  '#7c2d12',
  '#581c87',
  '#0f766e',
  '#b91c1c',
  '#ea580c',
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
    const [backgroundColor, setBackgroundColor] = useState('transparent');

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

    const handleDownload = async () => {
      try {
        const image = await canvasRef.current?.exportImage('png');
        if (image) {
          const link = document.createElement('a');
          link.href = image;
          link.download = `drawing-${Date.now()}.png`;
          link.click();
          toast.success('Drawing downloaded!');
        }
      } catch (error) {
        toast.error('Failed to download drawing');
      }
    };

    const handleCopyToClipboard = async () => {
      try {
        const image = await canvasRef.current?.exportImage('png');
        if (image) {
          const blob = await fetch(image).then(r => r.blob());
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          toast.success('Drawing copied to clipboard!');
        }
      } catch (error) {
        toast.error('Failed to copy drawing');
      }
    };

    return (
      <div className="bg-paper rounded-lg border border-border overflow-hidden flex flex-col h-full">
        <div className="flex items-center gap-1 p-2 border-b border-border bg-secondary/30 flex-wrap">
          <div className="flex items-center gap-1">
            <Button
              variant={!isEraser ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsEraser(false)}
              className="gap-1"
              title="Pen tool (draw)"
            >
              <Pen className="w-4 h-4" />
            </Button>
            <Button
              variant={isEraser ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsEraser(true)}
              className="gap-1"
              title="Eraser tool"
            >
              <Eraser className="w-4 h-4" />
            </Button>
          </div>

          <div className="w-px h-6 bg-border" />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1" title="Color and brush size">
                <div
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: strokeColor }}
                />
                <Palette className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3">
              <Tabs defaultValue="colors" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="colors">Colors</TabsTrigger>
                  <TabsTrigger value="size">Size</TabsTrigger>
                </TabsList>
                <TabsContent value="colors" className="mt-3">
                  <div className="flex gap-2 flex-wrap max-w-[160px]">
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
                </TabsContent>
                <TabsContent value="size" className="mt-3">
                  <div className="space-y-3">
                    <label className="text-xs text-muted-foreground block">
                      Brush Size: {strokeWidth}px
                    </label>
                    <Slider
                      value={[strokeWidth]}
                      onValueChange={([v]) => setStrokeWidth(v)}
                      min={1}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex gap-1 pt-2">
                      {[1, 5, 10, 20].map((size) => (
                        <Button
                          key={size}
                          variant={strokeWidth === size ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setStrokeWidth(size)}
                          className="text-xs"
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </PopoverContent>
          </Popover>

          <div className="w-px h-6 bg-border" />

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleUndo} title="Undo (Ctrl+Z)">
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleRedo} title="Redo (Ctrl+Y)">
              <Redo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear} title="Clear canvas">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="w-px h-6 bg-border" />

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyToClipboard}
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              title="Download as PNG"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <ReactSketchCanvas
            ref={canvasRef}
            width={`${width}px`}
            height={`${height}px`}
            strokeWidth={isEraser ? strokeWidth * 3 : strokeWidth}
            strokeColor={isEraser ? '#ffffff' : strokeColor}
            canvasColor={backgroundColor}
            style={{
              border: 'none',
              borderRadius: 0,
              display: 'block',
            }}
          />
        </div>
      </div>
    );
  }
);

DrawingCanvas.displayName = 'DrawingCanvas';
