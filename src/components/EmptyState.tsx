import { BookOpen, PenTool, FileText, Download } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-lg animate-fade-in">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
          <BookOpen className="w-12 h-12 text-primary" />
        </div>
        <h2 className="font-handwritten text-4xl text-foreground mb-4">
          Welcome to StudyNotes
        </h2>
        <p className="font-notes text-lg text-muted-foreground mb-8">
          Create beautiful notes with hand-drawn diagrams, perfect for studying!
        </p>

        <div className="grid gap-4 text-left">
          <div className="paper-card p-4 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-highlight-yellow flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h3 className="font-notes text-lg font-medium">Create Notes</h3>
              <p className="text-sm text-muted-foreground">
                Write your notes with beautiful handwritten-style fonts
              </p>
            </div>
          </div>

          <div className="paper-card p-4 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-highlight-pink flex items-center justify-center shrink-0">
              <PenTool className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h3 className="font-notes text-lg font-medium">Draw Diagrams</h3>
              <p className="text-sm text-muted-foreground">
                Add hand-drawn diagrams and sketches to your notes
              </p>
            </div>
          </div>

          <div className="paper-card p-4 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-highlight-blue flex items-center justify-center shrink-0">
              <Download className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h3 className="font-notes text-lg font-medium">Export to PDF</h3>
              <p className="text-sm text-muted-foreground">
                Download your notes as PDF files for offline studying
              </p>
            </div>
          </div>
        </div>

        <p className="font-notes text-muted-foreground mt-8">
          Select a note or create a new one to get started →
        </p>
      </div>
    </div>
  );
}
