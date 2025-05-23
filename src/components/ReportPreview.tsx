import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, Clock, Users, User } from 'lucide-react';
import { GroupData, Task, Participant } from '@/pages/Index';

interface ReportPreviewProps {
  groupData: GroupData;
  completedTasks: Task[];
  plannedTasks: Task[];
  participants: Participant[];
}

export const ReportPreview = ({ 
  groupData, 
  completedTasks, 
  plannedTasks, 
  participants 
}: ReportPreviewProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data não definida';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6 space-y-6 max-h-96 overflow-y-auto">
      {/* Header */}
      <div className="text-center border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Relatório TLP - {groupData.projectName}
        </h2>
        <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {groupData.groupNumber || 'Grupo não definido'}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(groupData.date)}
          </span>
          {groupData.reportAuthor && (
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {groupData.reportAuthor}
            </span>
          )}
          {groupData.sprint && (
            <Badge variant="secondary">{groupData.sprint}</Badge>
          )}
        </div>
      </div>

      {/* Tarefas Concluídas */}
      <div>
        <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Tarefas Concluídas ({completedTasks.length})
        </h3>
        {completedTasks.length > 0 ? (
          <ul className="space-y-2">
            {completedTasks.slice(0, 3).map((task) => (
              <li key={task.id} className="flex items-start gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>{task.description}</span>
              </li>
            ))}
            {completedTasks.length > 3 && (
              <p className="text-xs text-gray-500">
                +{completedTasks.length - 3} tarefa(s) adicional(is)
              </p>
            )}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">Nenhuma tarefa concluída</p>
        )}
      </div>

      {/* Tarefas Planejadas */}
      <div>
        <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-blue-600" />
          Próximas Tarefas ({plannedTasks.length})
        </h3>
        {plannedTasks.length > 0 ? (
          <ul className="space-y-2">
            {plannedTasks.slice(0, 3).map((task) => (
              <li key={task.id} className="flex items-start gap-2 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>{task.description}</span>
              </li>
            ))}
            {plannedTasks.length > 3 && (
              <p className="text-xs text-gray-500">
                +{plannedTasks.length - 3} tarefa(s) adicional(is)
              </p>
            )}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">Nenhuma tarefa planejada</p>
        )}
      </div>

      {/* Participantes */}
      <div>
        <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-purple-600" />
          Participação da Equipe
        </h3>
        {participants.length > 0 ? (
          <div className="space-y-2">
            {participants.map((participant) => (
              <div key={participant.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium">{participant.name}</span>
                <Badge variant="outline" className="text-xs">
                  {participant.participation}%
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Nenhum participante adicionado</p>
        )}
      </div>
    </div>
  );
};
