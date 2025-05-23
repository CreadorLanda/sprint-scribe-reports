
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Users, CheckSquare, Calendar } from 'lucide-react';
import { GroupInfoForm } from '@/components/GroupInfoForm';
import { TasksForm } from '@/components/TasksForm';
import { ParticipantsForm } from '@/components/ParticipantsForm';
import { ReportPreview } from '@/components/ReportPreview';
import { generatePDF } from '@/utils/pdfGenerator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export interface GroupData {
  groupNumber: string;
  projectName: string;
  sprint: string;
  date: string;
  reportAuthor: string;  // New field for report author
}

export interface Task {
  id: string;
  description: string;
  completed: boolean;
}

export interface Participant {
  id: string;
  name: string;
  participation: number;
}

const Index = () => {
  const [groupData, setGroupData] = useState<GroupData>({
    groupNumber: '',
    projectName: 'Sistema de Gestão Escolar',
    sprint: '',
    date: '',
    reportAuthor: ''  // Initialize the new field
  });
  
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [plannedTasks, setPlannedTasks] = useState<Task[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const { toast } = useToast();

  const handleGeneratePDF = async () => {
    if (!groupData.groupNumber || !groupData.sprint || participants.length === 0) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      await generatePDF({
        groupData,
        completedTasks,
        plannedTasks,
        participants
      });
      
      toast({
        title: "PDF gerado com sucesso!",
        description: "O relatório foi baixado automaticamente",
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar PDF",
        description: "Tente novamente",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Gerador de Relatórios TLP
          </h1>
          <p className="text-lg text-gray-600">
            Sistema de Gestão Escolar - Relatórios Automáticos
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Tabs defaultValue="group" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="group" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Grupo
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  Concluído
                </TabsTrigger>
                <TabsTrigger value="planned" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Planejado
                </TabsTrigger>
                <TabsTrigger value="participants" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Participantes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="group">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações do Grupo</CardTitle>
                    <CardDescription>
                      Dados básicos do projeto e equipe
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <GroupInfoForm 
                      groupData={groupData} 
                      onUpdate={setGroupData} 
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="completed">
                <Card>
                  <CardHeader>
                    <CardTitle>Tarefas Concluídas</CardTitle>
                    <CardDescription>
                      O que foi realizado nesta sprint
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TasksForm 
                      tasks={completedTasks} 
                      onUpdate={setCompletedTasks}
                      placeholder="Ex: Implementação do login de usuários"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="planned">
                <Card>
                  <CardHeader>
                    <CardTitle>Tarefas Planejadas</CardTitle>
                    <CardDescription>
                      O que será feito na próxima sprint
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TasksForm 
                      tasks={plannedTasks} 
                      onUpdate={setPlannedTasks}
                      placeholder="Ex: Desenvolver sistema de notas"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="participants">
                <Card>
                  <CardHeader>
                    <CardTitle>Participantes</CardTitle>
                    <CardDescription>
                      Membros da equipe e nível de participação
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ParticipantsForm 
                      participants={participants} 
                      onUpdate={setParticipants} 
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Pré-visualização do Relatório
                </CardTitle>
                <CardDescription>
                  Visualize como ficará o seu relatório final
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReportPreview 
                  groupData={groupData}
                  completedTasks={completedTasks}
                  plannedTasks={plannedTasks}
                  participants={participants}
                />
                
                <div className="mt-6">
                  <Button 
                    onClick={handleGeneratePDF}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                    size="lg"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Gerar Relatório PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
