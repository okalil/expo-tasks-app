export interface Task {
  id: number;
  title: string;
  description?: string | null;
  completed: boolean;
}
