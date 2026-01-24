import { FileText, Type, Clock } from 'lucide-react';

interface WordCountProps {
  content: string;
}

export function WordCount({ content }: WordCountProps) {
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const characters = content.length;
  const readingTime = Math.ceil(words / 200); // Average reading speed

  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground font-notes">
      <span className="flex items-center gap-1">
        <Type className="w-3 h-3" />
        {words} words
      </span>
      <span className="flex items-center gap-1">
        <FileText className="w-3 h-3" />
        {characters} chars
      </span>
      <span className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        {readingTime} min read
      </span>
    </div>
  );
}
