import { Bold, Italic, Underline, Highlighter, List, ListOrdered, Heading1, Heading2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface TextToolbarProps {
  onFormat: (format: string) => void;
}

const TOOLS = [
  { icon: Heading1, format: '# ', label: 'Heading 1', shortcut: 'Ctrl+1' },
  { icon: Heading2, format: '## ', label: 'Heading 2', shortcut: 'Ctrl+2' },
  { icon: Bold, format: '**', label: 'Bold', shortcut: 'Ctrl+B' },
  { icon: Italic, format: '*', label: 'Italic', shortcut: 'Ctrl+I' },
  { icon: Underline, format: '__', label: 'Underline', shortcut: 'Ctrl+U' },
  { icon: Highlighter, format: '==', label: 'Highlight', shortcut: 'Ctrl+H' },
  { icon: List, format: '- ', label: 'Bullet List', shortcut: 'Ctrl+L' },
  { icon: ListOrdered, format: '1. ', label: 'Numbered List', shortcut: 'Ctrl+O' },
];

export function TextToolbar({ onFormat }: TextToolbarProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-secondary/30 rounded-lg border border-border">
      {TOOLS.map((tool, index) => (
        <Tooltip key={tool.label}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFormat(tool.format)}
              className="h-8 w-8 p-0"
            >
              <tool.icon className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tool.label}</p>
            <p className="text-xs text-muted-foreground">{tool.shortcut}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
