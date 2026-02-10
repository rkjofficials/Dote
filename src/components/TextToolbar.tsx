import { Bold, Italic, Underline, Highlighter, List, ListOrdered, Heading1, Heading2, Heading3, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

interface TextToolbarProps {
  onFormat: (format: string) => void;
}

const TOOLS = [
  {
    group: 'Headings',
    items: [
      { icon: Heading1, format: '# ', label: 'Heading 1', shortcut: 'Ctrl+1' },
      { icon: Heading2, format: '## ', label: 'Heading 2', shortcut: 'Ctrl+2' },
      { icon: Heading3, format: '### ', label: 'Heading 3', shortcut: 'Ctrl+3' },
    ]
  },
  {
    group: 'Styling',
    items: [
      { icon: Bold, format: '**', label: 'Bold', shortcut: 'Ctrl+B' },
      { icon: Italic, format: '*', label: 'Italic', shortcut: 'Ctrl+I' },
      { icon: Underline, format: '__', label: 'Underline', shortcut: 'Ctrl+U' },
      { icon: Highlighter, format: '==', label: 'Highlight', shortcut: 'Ctrl+H' },
    ]
  },
  {
    group: 'Lists',
    items: [
      { icon: List, format: '- ', label: 'Bullet List', shortcut: 'Ctrl+L' },
      { icon: ListOrdered, format: '1. ', label: 'Numbered List', shortcut: 'Ctrl+O' },
      { icon: Quote, format: '> ', label: 'Quote', shortcut: 'Ctrl+Q' },
    ]
  }
];

export function TextToolbar({ onFormat }: TextToolbarProps) {
  return (
    <div className="flex items-center gap-0 p-1 bg-secondary/30 rounded-lg border border-border flex-wrap">
      {TOOLS.map((group, groupIndex) => (
        <div key={group.group} className="flex items-center">
          {groupIndex > 0 && <Separator orientation="vertical" className="h-6 mx-1" />}
          <div className="flex items-center gap-1">
            {group.items.map((tool) => (
              <Tooltip key={tool.label}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFormat(tool.format)}
                    className="h-8 w-8 p-0 hover:bg-secondary"
                    title={tool.label}
                  >
                    <tool.icon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="font-medium">{tool.label}</p>
                  <p className="text-xs text-muted-foreground">{tool.shortcut}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
