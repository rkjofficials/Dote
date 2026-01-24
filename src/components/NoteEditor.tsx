import { useState, useRef, useEffect } from 'react';
import { Note, DrawingData } from '@/types/note';
import { DrawingCanvas, DrawingCanvasHandle } from './DrawingCanvas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Download, PenTool, Save, ImagePlus } from 'lucide-react';
import { toast } from 'sonner';

interface NoteEditorProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => void;
  onExportPdf: (note: Note, drawings: Map<string, string>) => Promise<void>;
}

export function NoteEditor({ note, onUpdate, onExportPdf }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [drawings, setDrawings] = useState<DrawingData[]>(note.drawings);
  const [isExporting, setIsExporting] = useState(false);
  const canvasRefs = useRef<Map<string, DrawingCanvasHandle>>(new Map());

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setDrawings(note.drawings);
  }, [note.id, note.title, note.content, note.drawings]);

  const handleSave = async () => {
    const updatedDrawings: DrawingData[] = [];

    for (const drawing of drawings) {
      const canvas = canvasRefs.current.get(drawing.id);
      if (canvas) {
        const paths = await canvas.exportPaths();
        updatedDrawings.push({
          ...drawing,
          paths,
        });
      }
    }

    onUpdate(note.id, {
      title,
      content,
      drawings: updatedDrawings,
    });
    toast.success('Note saved!');
  };

  const handleAddDrawing = () => {
    const newDrawing: DrawingData = {
      id: crypto.randomUUID(),
      paths: '[]',
      width: 600,
      height: 300,
    };
    setDrawings([...drawings, newDrawing]);
  };

  const handleRemoveDrawing = (id: string) => {
    setDrawings(drawings.filter((d) => d.id !== id));
    canvasRefs.current.delete(id);
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      const drawingImages = new Map<string, string>();

      for (const drawing of drawings) {
        const canvas = canvasRefs.current.get(drawing.id);
        if (canvas) {
          const image = await canvas.exportImage();
          drawingImages.set(drawing.id, image);
        }
      }

      await onExportPdf(
        { ...note, title, content, drawings },
        drawingImages
      );
      toast.success('PDF downloaded!');
    } catch (error) {
      console.error('Export failed', error);
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="flex items-center justify-between p-4 border-b border-border bg-card">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-handwritten font-bold bg-transparent border-none shadow-none focus-visible:ring-0 max-w-md"
          placeholder="Note title..."
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleAddDrawing}
            className="gap-2 font-notes"
          >
            <ImagePlus className="w-4 h-4" />
            Add Drawing
          </Button>
          <Button onClick={handleSave} className="gap-2 font-notes">
            <Save className="w-4 h-4" />
            Save
          </Button>
          <Button
            variant="secondary"
            onClick={handleExportPdf}
            disabled={isExporting}
            className="gap-2 font-notes"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <div className="paper-texture rounded-lg p-6 min-h-[200px]">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[200px] bg-transparent border-none shadow-none focus-visible:ring-0 font-notes text-lg leading-8 resize-none text-ink placeholder:text-pencil"
              placeholder="Start writing your notes here..."
            />
          </div>

          {drawings.map((drawing, index) => (
            <div key={drawing.id} className="space-y-2 animate-slide-in">
              <div className="flex items-center justify-between">
                <h3 className="font-notes text-lg text-muted-foreground flex items-center gap-2">
                  <PenTool className="w-4 h-4" />
                  Drawing {index + 1}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveDrawing(drawing.id)}
                  className="text-destructive hover:text-destructive"
                >
                  Remove
                </Button>
              </div>
              <DrawingCanvas
                ref={(handle) => {
                  if (handle) {
                    canvasRefs.current.set(drawing.id, handle);
                    if (drawing.paths && drawing.paths !== '[]') {
                      setTimeout(() => handle.loadPaths(drawing.paths), 100);
                    }
                  }
                }}
                width={drawing.width}
                height={drawing.height}
              />
            </div>
          ))}

          {drawings.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
              <PenTool className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="font-notes text-muted-foreground">
                No diagrams yet. Click "Add Drawing" to create one!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
