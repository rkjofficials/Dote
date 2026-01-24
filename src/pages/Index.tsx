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
    <div className="flex h-screen w-full bg-background">
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
  );
};

export default Index;
