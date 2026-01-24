import { Note } from '@/types/note';
import { Plus, FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

interface NotesSidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: string) => void;
}

export function NotesSidebar({
  notes,
  activeNoteId,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
}: NotesSidebarProps) {
  return (
    <aside className="w-72 border-r border-border bg-card flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h1 className="font-handwritten text-3xl text-primary font-bold mb-4">
          StudyNotes
        </h1>
        <Button
          onClick={onCreateNote}
          className="w-full gap-2 font-notes text-lg"
          size="lg"
        >
          <Plus className="w-5 h-5" />
          New Note
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {notes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="font-notes">No notes yet</p>
              <p className="text-sm">Create your first note!</p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeNoteId === note.id
                    ? 'bg-primary/10 border-l-4 border-primary'
                    : 'hover:bg-secondary/50'
                }`}
                onClick={() => onSelectNote(note.id)}
              >
                <div className="pr-8">
                  <h3 className="font-notes text-lg font-medium truncate text-foreground">
                    {note.title || 'Untitled'}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
                  </p>
                  {note.content && (
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {note.content.substring(0, 50)}...
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNote(note.id);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 hover:bg-destructive/10 rounded-md transition-opacity"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
