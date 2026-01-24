export interface Note {
  id: string;
  title: string;
  content: string;
  drawings: DrawingData[];
  createdAt: Date;
  updatedAt: Date;
  color: 'yellow' | 'pink' | 'blue' | 'green' | 'default';
}

export interface DrawingData {
  id: string;
  paths: string;
  width: number;
  height: number;
}
