import { useState, useRef, useEffect, useCallback } from 'react';
import { Note, DrawingData } from '@/types/note';
import { DrawingCanvas, DrawingCanvasHandle } from './DrawingCanvas';
import { ColorPicker } from './ColorPicker';
import { TextToolbar } from './TextToolbar';
import { WordCount } from './WordCount';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Download, PenTool, Save, ImagePlus, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface NoteEditorProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => void;
  onExportPdf: (note: Note, drawings: Map<string, string>) => Promise<void>;
}

export function NoteEditor({ note, onUpdate, onExportPdf }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [color, setColor] = useState(note.color);
  const [drawings, setDrawings] = useState<DrawingData[]>(note.drawings);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const canvasRefs = useRef<Map<string, DrawingCanvasHandle>>(new Map());
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setColor(note.color);
    setDrawings(note.drawings);
    setIsSaved(true);
  }, [note.id, note.title, note.content, note.color, note.drawings]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    if (!isSaved) {
      autoSaveTimeoutRef.current = setTimeout(() => {
        handleSave(true);
      }, 2000); // Auto-save after 2 seconds of inactivity
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [title, content, color, drawings, isSaved]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && textareaRef.current) {
        const isFocused = document.activeElement === textareaRef.current;

        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'b':
            if (isFocused) {
              e.preventDefault();
              handleFormat('**');
            }
            break;
          case 'i':
            if (isFocused) {
              e.preventDefault();
              handleFormat('*');
            }
            break;
          case 'u':
            if (isFocused) {
              e.preventDefault();
              handleFormat('__');
            }
            break;
          case 'h':
            if (isFocused) {
              e.preventDefault();
              handleFormat('==');
            }
            break;
          case 'l':
            if (isFocused) {
              e.preventDefault();
              handleFormat('- ');
            }
            break;
          case 'o':
            if (isFocused) {
              e.preventDefault();
              handleFormat('1. ');
            }
            break;
          case 'q':
            if (isFocused) {
              e.preventDefault();
              handleFormat('> ');
            }
            break;
          case '1':
            if (isFocused && e.shiftKey === false) {
              e.preventDefault();
              handleFormat('# ');
            }
            break;
          case '2':
            if (isFocused && e.shiftKey === false) {
              e.preventDefault();
              handleFormat('## ');
            }
            break;
          case '3':
            if (isFocused && e.shiftKey === false) {
              e.preventDefault();
              handleFormat('### ');
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content]);

  const markUnsaved = () => {
    setIsSaved(false);
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    markUnsaved();
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    markUnsaved();
  };

  const handleColorChange = (newColor: typeof color) => {
    setColor(newColor);
    markUnsaved();
  };

  const handleSave = useCallback(async (isAutoSave = false) => {
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
      color,
      drawings: updatedDrawings,
    });

    setIsSaved(true);
    setLastSaved(new Date());
    
    if (!isAutoSave) {
      toast.success('Note saved!');
    }
  }, [note.id, title, content, color, drawings, onUpdate]);

  const handleAddDrawing = () => {
    const newDrawing: DrawingData = {
      id: crypto.randomUUID(),
      paths: '[]',
      width: 600,
      height: 300,
    };
    setDrawings([...drawings, newDrawing]);
    markUnsaved();
  };

  const handleRemoveDrawing = (id: string) => {
    setDrawings(drawings.filter((d) => d.id !== id));
    canvasRefs.current.delete(id);
    markUnsaved();
  };

  const handleFormat = (format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let newContent: string;
    let newCursorPos: number;

    if (format.startsWith('#') || format === '- ' || format === '1. ') {
      // Line-based formatting
      const lineStart = content.lastIndexOf('\n', start - 1) + 1;
      newContent = content.substring(0, lineStart) + format + content.substring(lineStart);
      newCursorPos = end + format.length;
    } else {
      // Wrap-based formatting
      newContent = content.substring(0, start) + format + selectedText + format + content.substring(end);
      newCursorPos = end + format.length * 2;
    }

    setContent(newContent);
    markUnsaved();

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      const drawingImages = new Map<string, string>();

      // Export all drawings
      for (const drawing of drawings) {
        const canvas = canvasRefs.current.get(drawing.id);
        if (canvas) {
          try {
            const image = await canvas.exportImage();
            if (image) {
              drawingImages.set(drawing.id, image);
            }
          } catch (drawError) {
            console.warn(`Failed to export drawing ${drawing.id}:`, drawError);
            // Continue with other drawings if one fails
          }
        }
      }

      await onExportPdf(
        { ...note, title, content, color, drawings },
        drawingImages
      );
      toast.success('PDF downloaded!');
    } catch (error) {
      console.error('Export failed', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to export PDF';
      toast.error(errorMsg);
    } finally {
      setIsExporting(false);
    }
  };

  const getColorClass = () => {
    switch (color) {
      case 'yellow': return 'bg-highlight-yellow/30';
      case 'pink': return 'bg-highlight-pink/30';
      case 'blue': return 'bg-highlight-blue/30';
      case 'green': return 'bg-highlight-green/30';
      default: return '';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-2xl font-handwritten font-bold bg-transparent border-none shadow-none focus-visible:ring-0 max-w-md"
            placeholder="Note title..."
          />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {isSaved ? (
              <span className="flex items-center gap-1 text-accent">
                <CheckCircle className="w-3 h-3" />
                Saved
              </span>
            ) : (
              <span>Unsaved changes</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ColorPicker value={color} onChange={handleColorChange} />
          <Button
            variant="outline"
            onClick={handleAddDrawing}
            className="gap-2 font-notes"
          >
            <ImagePlus className="w-4 h-4" />
            Add Drawing
          </Button>
          <Button onClick={() => handleSave()} className="gap-2 font-notes">
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
          <div className="flex items-center justify-between">
            <TextToolbar onFormat={handleFormat} />
            <WordCount content={content} />
          </div>

          <div className={`paper-texture rounded-lg p-6 min-h-[200px] ${getColorClass()}`}>
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
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
