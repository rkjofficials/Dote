import { useNotes } from '@/hooks/useNotes';
import { NotesSidebar } from '@/components/NotesSidebar';
import { NoteEditor } from '@/components/NoteEditor';
import { EmptyState } from '@/components/EmptyState';
import { exportNoteToPdf } from '@/utils/pdfExport.tsx';
import { Note } from '@/types/note';

const Index = () => {
  const {
    notes,
    activeNote,
    activeNoteId,
    setActiveNoteId,
    createNote,
    updateNote,
    deleteNote,
  } = useNotes();

  const handleExportPdf = async (
    note: Note,
    drawingImages: Map<string, string>
  ) => {
    await exportNoteToPdf(note, drawingImages);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background">
      <div className="flex flex-1 overflow-hidden">
        <NotesSidebar
          notes={notes}
          activeNoteId={activeNoteId}
          onSelectNote={setActiveNoteId}
          onCreateNote={createNote}
          onDeleteNote={deleteNote}
        />

        {activeNote ? (
          <NoteEditor
            note={activeNote}
            onUpdate={updateNote}
            onExportPdf={handleExportPdf}
          />
        ) : (
          <EmptyState />
        )}
      </div>
      
      <footer className="border-t border-border bg-card px-4 py-3 text-center">
        <p className="font-notes text-sm text-muted-foreground">
          Built with <span className="text-primary">♥</span> by Rahul Kumar Jagat
        </p>
      </footer>
    </div>
  );
};

export default Index;
