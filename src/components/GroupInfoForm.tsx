
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GroupData } from '@/pages/Index';

interface GroupInfoFormProps {
  groupData: GroupData;
  onUpdate: (data: GroupData) => void;
}

export const GroupInfoForm = ({ groupData, onUpdate }: GroupInfoFormProps) => {
  const handleChange = (field: keyof GroupData, value: string) => {
    onUpdate({ ...groupData, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="groupNumber">Número do Grupo *</Label>
          <Input
            id="groupNumber"
            value={groupData.groupNumber}
            onChange={(e) => handleChange('groupNumber', e.target.value)}
            placeholder="Ex: Grupo 5"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="sprint">Sprint/Fase *</Label>
          <Input
            id="sprint"
            value={groupData.sprint}
            onChange={(e) => handleChange('sprint', e.target.value)}
            placeholder="Ex: Sprint 2"
            className="mt-1"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="projectName">Nome do Projeto</Label>
        <Input
          id="projectName"
          value={groupData.projectName}
          onChange={(e) => handleChange('projectName', e.target.value)}
          placeholder="Sistema de Gestão Escolar"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="date">Data do Relatório</Label>
        <Input
          id="date"
          type="date"
          value={groupData.date}
          onChange={(e) => handleChange('date', e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  );
};
