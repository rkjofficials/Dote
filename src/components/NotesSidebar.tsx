import { Note } from '@/types/note';
import { Plus, FileText, Trash2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SearchBar } from '@/components/SearchBar';
import { formatDistanceToNow } from 'date-fns';
import { useState, useMemo } from 'react';

interface NotesSidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: string) => void;
}

const COLOR_CLASSES = {
  default: 'border-l-muted',
  yellow: 'border-l-highlight-yellow',
  pink: 'border-l-highlight-pink',
  blue: 'border-l-highlight-blue',
  green: 'border-l-highlight-green',
};

export function NotesSidebar({
  notes,
  activeNoteId,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
}: NotesSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const query = searchQuery.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );
  }, [notes, searchQuery]);

  return (
    <aside className="w-72 border-r border-border bg-card flex flex-col h-full">
      <div className="p-4 border-b border-border space-y-3">
        <h1 className="font-handwritten text-3xl text-primary font-bold">
          StudyNotes
        </h1>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
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
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="font-notes">
                {searchQuery ? 'No notes found' : 'No notes yet'}
              </p>
              <p className="text-sm">
                {searchQuery ? 'Try a different search' : 'Create your first note!'}
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 border-l-4 ${
                  COLOR_CLASSES[note.color]
                } ${
                  activeNoteId === note.id
                    ? 'bg-primary/10'
                    : 'hover:bg-secondary/50'
                }`}
                onClick={() => onSelectNote(note.id)}
              >
                <div className="pr-8">
                  <h3 className="font-notes text-lg font-medium truncate text-foreground">
                    {note.title || 'Untitled'}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span>{formatDistanceToNow(note.updatedAt, { addSuffix: true })}</span>
                    {note.drawings.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {note.drawings.length} drawing{note.drawings.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
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

      <div className="p-3 border-t border-border text-center">
        <p className="text-xs text-muted-foreground font-notes">
          {notes.length} note{notes.length !== 1 ? 's' : ''} total
        </p>
      </div>
    </aside>
  );
}
