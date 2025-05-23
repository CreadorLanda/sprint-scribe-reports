
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { Task } from '@/pages/Index';

interface TasksFormProps {
  tasks: Task[];
  onUpdate: (tasks: Task[]) => void;
  placeholder: string;
}

export const TasksForm = ({ tasks, onUpdate, placeholder }: TasksFormProps) => {
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        description: newTask.trim(),
        completed: true
      };
      onUpdate([...tasks, task]);
      setNewTask('');
    }
  };

  const removeTask = (id: string) => {
    onUpdate(tasks.filter(task => task.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button onClick={addTask} size="icon" className="shrink-0">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <span className="flex-1 text-sm">{task.description}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => removeTask(task.id)}
              className="shrink-0 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        
        {tasks.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            Nenhuma tarefa adicionada ainda
          </p>
        )}
      </div>
    </div>
  );
};
