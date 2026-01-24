import { Check } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

const COLORS = [
  { value: 'default', label: 'Default', class: 'bg-paper' },
  { value: 'yellow', label: 'Yellow', class: 'bg-highlight-yellow' },
  { value: 'pink', label: 'Pink', class: 'bg-highlight-pink' },
  { value: 'blue', label: 'Blue', class: 'bg-highlight-blue' },
  { value: 'green', label: 'Green', class: 'bg-highlight-green' },
] as const;

interface ColorPickerProps {
  value: string;
  onChange: (color: 'default' | 'yellow' | 'pink' | 'blue' | 'green') => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const currentColor = COLORS.find((c) => c.value === value) || COLORS[0];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <div className={`w-4 h-4 rounded-full border border-border ${currentColor.class}`} />
          <span className="text-xs">Color</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <div className="flex gap-2">
          {COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => onChange(color.value)}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform hover:scale-110 ${color.class} ${
                value === color.value ? 'border-primary' : 'border-transparent'
              }`}
              title={color.label}
            >
              {value === color.value && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
