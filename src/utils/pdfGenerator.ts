
import { GroupData, Task, Participant } from '@/pages/Index';

interface ReportData {
  groupData: GroupData;
  completedTasks: Task[];
  plannedTasks: Task[];
  participants: Participant[];
}

export const generatePDF = async (data: ReportData) => {
  // Simulando geração de PDF
  // Em uma implementação real, você usaria uma biblioteca como jsPDF ou html2pdf
  
  const { groupData, completedTasks, plannedTasks, participants } = data;
  
  // Criar o conteúdo HTML para o PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Relatório TLP - ${groupData.groupNumber}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 20px;
          line-height: 1.6;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #3b82f6;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #1e40af;
          margin: 0;
          font-size: 28px;
        }
        .header .subtitle {
          color: #6b7280;
          font-size: 16px;
          margin-top: 10px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }
        .info-item {
          background: #f8fafc;
          padding: 15px;
          border-left: 4px solid #3b82f6;
          border-radius: 4px;
        }
        .info-label {
          font-weight: bold;
          color: #1e40af;
          font-size: 14px;
        }
        .info-value {
          margin-top: 5px;
          font-size: 16px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          color: white;
          padding: 12px 20px;
          margin: 0 0 15px 0;
          border-radius: 6px;
          font-size: 18px;
          font-weight: bold;
        }
        .task-list {
          list-style: none;
          padding: 0;
        }
        .task-item {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 12px 15px;
          margin-bottom: 8px;
          border-left: 4px solid #10b981;
        }
        .planned-task {
          border-left-color: #3b82f6;
        }
        .participants-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        .participant {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 15px;
          text-align: center;
        }
        .participant-name {
          font-weight: bold;
          margin-bottom: 8px;
          color: #1e40af;
        }
        .participant-percentage {
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: bold;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 12px;
        }
        .statistics {
          background: #f1f5f9;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          text-align: center;
        }
        .stat-item {
          background: white;
          padding: 15px;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }
        .stat-number {
          font-size: 24px;
          font-weight: bold;
          color: #1e40af;
        }
        .stat-label {
          font-size: 12px;
          color: #6b7280;
          margin-top: 5px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Relatório de Progresso TLP</h1>
        <div class="subtitle">${groupData.projectName}</div>
      </div>

      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Grupo</div>
          <div class="info-value">${groupData.groupNumber}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Sprint/Fase</div>
          <div class="info-value">${groupData.sprint}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Data do Relatório</div>
          <div class="info-value">${groupData.date ? new Date(groupData.date).toLocaleDateString('pt-BR') : 'Não definida'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Equipe</div>
          <div class="info-value">${participants.length} participante(s)</div>
        </div>
      </div>

      <div class="statistics">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">${completedTasks.length}</div>
            <div class="stat-label">Tarefas Concluídas</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${plannedTasks.length}</div>
            <div class="stat-label">Tarefas Planejadas</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${participants.length}</div>
            <div class="stat-label">Membros da Equipe</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">📋 Tarefas Concluídas (${completedTasks.length})</h2>
        ${completedTasks.length > 0 ? `
          <ul class="task-list">
            ${completedTasks.map(task => `
              <li class="task-item">${task.description}</li>
            `).join('')}
          </ul>
        ` : '<p style="color: #6b7280; font-style: italic;">Nenhuma tarefa concluída nesta sprint.</p>'}
      </div>

      <div class="section">
        <h2 class="section-title">🎯 Próximas Tarefas (${plannedTasks.length})</h2>
        ${plannedTasks.length > 0 ? `
          <ul class="task-list">
            ${plannedTasks.map(task => `
              <li class="task-item planned-task">${task.description}</li>
            `).join('')}
          </ul>
        ` : '<p style="color: #6b7280; font-style: italic;">Nenhuma tarefa planejada para a próxima sprint.</p>'}
      </div>

      <div class="section">
        <h2 class="section-title">👥 Participação da Equipe</h2>
        ${participants.length > 0 ? `
          <div class="participants-grid">
            ${participants.map(participant => `
              <div class="participant">
                <div class="participant-name">${participant.name}</div>
                <div class="participant-percentage">${participant.participation}%</div>
              </div>
            `).join('')}
          </div>
        ` : '<p style="color: #6b7280; font-style: italic;">Nenhum participante registrado.</p>'}
      </div>

      <div class="footer">
        <p>Relatório gerado automaticamente pelo Sistema de Gestão TLP</p>
        <p>Data de geração: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
      </div>
    </body>
    </html>
  `;

  // Criar um blob com o conteúdo HTML
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Criar um link para download
  const link = document.createElement('a');
  link.href = url;
  link.download = `relatorio-tlp-${groupData.groupNumber}-${groupData.sprint || 'sprint'}.html`;
  
  // Simular o clique para baixar
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Limpar a URL
  URL.revokeObjectURL(url);

  // Log para debugging
  console.log('Relatório gerado:', {
    grupo: groupData.groupNumber,
    sprint: groupData.sprint,
    tarefasConcluidas: completedTasks.length,
    tarefasPlanejadas: plannedTasks.length,
    participantes: participants.length
  });
};
