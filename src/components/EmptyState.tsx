import { BookOpen, PenTool, FileText, Download, Search, Palette, Keyboard } from 'lucide-react';

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

        <div className="grid gap-3 text-left">
          <div className="paper-card p-4 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-highlight-yellow flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h3 className="font-notes text-lg font-medium">Create Notes</h3>
              <p className="text-sm text-muted-foreground">
                Write notes with handwritten fonts & text formatting
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
                Add hand-drawn diagrams with pen, colors & eraser
              </p>
            </div>
          </div>

          <div className="paper-card p-4 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-highlight-blue flex items-center justify-center shrink-0">
              <Search className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h3 className="font-notes text-lg font-medium">Search & Organize</h3>
              <p className="text-sm text-muted-foreground">
                Find notes instantly with search & color labels
              </p>
            </div>
          </div>

          <div className="paper-card p-4 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-highlight-green flex items-center justify-center shrink-0">
              <Download className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h3 className="font-notes text-lg font-medium">Export to PDF</h3>
              <p className="text-sm text-muted-foreground">
                Download notes as PDF for offline studying
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
          <h4 className="font-notes text-sm font-medium flex items-center gap-2 mb-2">
            <Keyboard className="w-4 h-4" />
            Keyboard Shortcuts
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <span><kbd className="px-1.5 py-0.5 bg-background rounded text-foreground">Ctrl+S</kbd> Save note</span>
            <span><kbd className="px-1.5 py-0.5 bg-background rounded text-foreground">Ctrl+B</kbd> Bold text</span>
            <span><kbd className="px-1.5 py-0.5 bg-background rounded text-foreground">Ctrl+I</kbd> Italic text</span>
            <span><kbd className="px-1.5 py-0.5 bg-background rounded text-foreground">Ctrl+U</kbd> Underline</span>
          </div>
        </div>

        <p className="font-notes text-muted-foreground mt-6">
          Select a note or create a new one to get started →
        </p>
      </div>
    </div>
  );
}
