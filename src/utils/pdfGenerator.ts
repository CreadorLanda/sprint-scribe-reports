
import { jsPDF } from 'jspdf';
import { GroupData, Task, Participant } from '@/pages/Index';

interface ReportData {
  groupData: GroupData;
  completedTasks: Task[];
  plannedTasks: Task[];
  participants: Participant[];
}

export const generatePDF = async (data: ReportData) => {
  const { groupData, completedTasks, plannedTasks, participants } = data;
  
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Set up document properties
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const textWidth = pageWidth - (margin * 2);
  
  // Helper function to add centered text
  const addCenteredText = (text: string, y: number, fontSize: number = 12) => {
    doc.setFontSize(fontSize);
    doc.text(text, pageWidth / 2, y, { align: 'center' });
  };
  
  // Helper function to add section headers
  const addSectionHeader = (text: string, y: number) => {
    doc.setFillColor(59, 130, 246); // Blue color
    doc.rect(margin, y - 6, pageWidth - (margin * 2), 10, 'F');
    doc.setTextColor(255, 255, 255); // White text
    doc.setFontSize(12);
    doc.text(text, margin + 5, y);
    doc.setTextColor(0, 0, 0); // Reset to black
    return y + 15; // Return the new y position
  };
  
  // Add header
  doc.setFont('helvetica', 'bold');
  addCenteredText('Relatório de Progresso TLP', 20, 18);
  addCenteredText(groupData.projectName || 'Sistema de Gestão Escolar', 28, 14);
  doc.line(margin, 35, pageWidth - margin, 35);
  
  // Add project info
  let yPos = 45;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Grupo: ${groupData.groupNumber || 'Não definido'}`, margin, yPos);
  yPos += 8;
  doc.text(`Sprint/Fase: ${groupData.sprint || 'Não definida'}`, margin, yPos);
  yPos += 8;
  doc.text(`Data: ${groupData.date ? new Date(groupData.date).toLocaleDateString('pt-BR') : 'Não definida'}`, margin, yPos);
  yPos += 8;
  doc.text(`Equipe: ${participants.length} participante(s)`, margin, yPos);
  yPos += 15;
  
  // Add statistics
  doc.setFillColor(241, 245, 249); // Light gray
  doc.roundedRect(margin, yPos, textWidth, 25, 3, 3, 'F');
  yPos += 8;
  
  const statWidth = textWidth / 3;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`${completedTasks.length}`, margin + (statWidth / 2), yPos, { align: 'center' });
  doc.text(`${plannedTasks.length}`, margin + (statWidth * 1.5), yPos, { align: 'center' });
  doc.text(`${participants.length}`, margin + (statWidth * 2.5), yPos, { align: 'center' });
  
  doc.setFontSize(9);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.text('Tarefas Concluídas', margin + (statWidth / 2), yPos, { align: 'center' });
  doc.text('Tarefas Planejadas', margin + (statWidth * 1.5), yPos, { align: 'center' });
  doc.text('Membros da Equipe', margin + (statWidth * 2.5), yPos, { align: 'center' });
  yPos += 15;
  
  // Add completed tasks
  yPos = addSectionHeader('📋 Tarefas Concluídas', yPos);
  
  if (completedTasks.length > 0) {
    doc.setFont('helvetica', 'normal');
    completedTasks.forEach(task => {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(10);
      doc.text(`• ${task.description}`, margin + 5, yPos);
      yPos += 8;
    });
  } else {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Nenhuma tarefa concluída nesta sprint.', margin + 5, yPos);
    yPos += 10;
  }
  yPos += 5;
  
  // Add planned tasks
  yPos = addSectionHeader('🎯 Próximas Tarefas', yPos);
  
  if (plannedTasks.length > 0) {
    doc.setFont('helvetica', 'normal');
    plannedTasks.forEach(task => {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(10);
      doc.text(`• ${task.description}`, margin + 5, yPos);
      yPos += 8;
    });
  } else {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Nenhuma tarefa planejada para a próxima sprint.', margin + 5, yPos);
    yPos += 10;
  }
  yPos += 5;
  
  // Check if we need a new page for participants
  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }
  
  // Add participants
  yPos = addSectionHeader('👥 Participação da Equipe', yPos);
  
  if (participants.length > 0) {
    let xPos = margin;
    const participantWidth = textWidth / 2;
    let initialYPos = yPos;
    let count = 0;
    
    participants.forEach(participant => {
      // Check if we need to move to the next row
      if (count % 2 === 0 && count > 0) {
        xPos = margin;
        initialYPos = yPos + 20;
      }
      
      // Check if we need a new page
      if (initialYPos > 250) {
        doc.addPage();
        initialYPos = 20;
        yPos = initialYPos;
        xPos = margin;
      }
      
      // Draw participant box
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(xPos, initialYPos, participantWidth - 5, 15, 2, 2, 'F');
      
      // Add participant name
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(participant.name, xPos + 5, initialYPos + 6);
      
      // Add participation percentage
      doc.setFillColor(139, 92, 246); // Purple
      doc.roundedRect(xPos + participantWidth - 40, initialYPos + 3, 30, 9, 3, 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text(`${participant.participation}%`, xPos + participantWidth - 25, initialYPos + 8, { align: 'center' });
      doc.setTextColor(0, 0, 0);
      
      xPos += participantWidth;
      count++;
      if (count % 2 === 0) {
        yPos = initialYPos;
      }
    });
    
    yPos = initialYPos + 20;
  } else {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Nenhum participante registrado.', margin + 5, yPos);
    yPos += 10;
  }
  
  // Add footer
  yPos = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128); // Gray
  doc.text('Relatório gerado automaticamente pelo Sistema de Gestão TLP', pageWidth / 2, yPos, { align: 'center' });
  doc.text(`Data de geração: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, pageWidth / 2, yPos + 5, { align: 'center' });
  
  // Save the PDF
  const fileName = `relatorio-tlp-${groupData.groupNumber || 'grupo'}-${groupData.sprint || 'sprint'}.pdf`;
  doc.save(fileName);
  
  // Log for debugging
  console.log('Relatório gerado:', {
    grupo: groupData.groupNumber,
    sprint: groupData.sprint,
    tarefasConcluidas: completedTasks.length,
    tarefasPlanejadas: plannedTasks.length,
    participantes: participants.length
  });
};

