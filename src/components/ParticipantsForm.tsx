
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Plus, Trash2, User } from 'lucide-react';
import { Participant } from '@/pages/Index';

interface ParticipantsFormProps {
  participants: Participant[];
  onUpdate: (participants: Participant[]) => void;
}

export const ParticipantsForm = ({ participants, onUpdate }: ParticipantsFormProps) => {
  const [newParticipantName, setNewParticipantName] = useState('');

  const addParticipant = () => {
    if (newParticipantName.trim()) {
      const participant: Participant = {
        id: Date.now().toString(),
        name: newParticipantName.trim(),
        participation: 25
      };
      onUpdate([...participants, participant]);
      setNewParticipantName('');
    }
  };

  const removeParticipant = (id: string) => {
    onUpdate(participants.filter(p => p.id !== id));
  };

  const updateParticipation = (id: string, participation: number) => {
    onUpdate(participants.map(p => 
      p.id === id ? { ...p, participation } : p
    ));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addParticipant();
    }
  };

  const totalParticipation = participants.reduce((sum, p) => sum + p.participation, 0);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newParticipantName}
          onChange={(e) => setNewParticipantName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nome do participante"
          className="flex-1"
        />
        <Button onClick={addParticipant} size="icon" className="shrink-0">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {totalParticipation !== 100 && participants.length > 0 && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">
            ⚠️ Total de participação: {totalParticipation}% (deveria ser 100%)
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        {participants.map((participant) => (
          <div key={participant.id} className="p-4 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium">{participant.name}</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => removeParticipant(participant.id)}
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm text-gray-600">
                  Nível de Participação
                </Label>
                <span className="text-sm font-medium text-blue-600">
                  {participant.participation}%
                </span>
              </div>
              <Slider
                value={[participant.participation]}
                onValueChange={([value]) => updateParticipation(participant.id, value)}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        ))}
        
        {participants.length === 0 && (
          <p className="text-gray-500 text-center py-6">
            Adicione participantes para calcular a participação
          </p>
        )}
      </div>
    </div>
  );
};
