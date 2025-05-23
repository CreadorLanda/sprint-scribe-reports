
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
  
  // Create a new PDF document with UTF-8 support
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    compress: true
  });
  
  // Import fonts to support UTF-8 characters
  doc.addFont("helvetica", "normal");
  
  // Set up document properties
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const textWidth = pageWidth - (margin * 2);
  
  // Helper function to add centered text
  const addCenteredText = (text: string, y: number, fontSize: number = 12) => {
    doc.setFontSize(fontSize);
    doc.text(text, pageWidth / 2, y, { align: 'center' });
  };
  
  // Helper function to add section headers with a gradient background
  const addSectionHeader = (text: string, y: number) => {
    // Draw gradient-like header
    doc.setFillColor(65, 105, 225); // Royal Blue
    doc.rect(margin, y - 6, textWidth, 10, 'F');
    doc.setTextColor(255, 255, 255); // White text
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin + 5, y);
    doc.setTextColor(0, 0, 0); // Reset to black
    doc.setFont('helvetica', 'normal');
    return y + 15; // Return the new y position
  };
  
  // Add decorative header with a blue gradient background
  doc.setFillColor(51, 102, 204); // Dark blue
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Add header text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  addCenteredText('RELATÓRIO DE PROGRESSO TLP', 20, 18);
  addCenteredText(groupData.projectName || 'Sistema de Gestão Escolar', 30, 14);
  doc.setTextColor(0, 0, 0);
  
  // Add decorative line
  doc.setDrawColor(51, 102, 204);
  doc.setLineWidth(0.5);
  doc.line(margin, 50, pageWidth - margin, 50);
  
  // Add project info box with light blue background
  let yPos = 60;
  doc.setFillColor(240, 248, 255); // Alice Blue
  doc.roundedRect(margin, yPos - 10, textWidth, 45, 3, 3, 'F');
  
  // Add project info text
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Grupo: ${groupData.groupNumber || 'Não definido'}`, margin + 10, yPos);
  yPos += 10;
  doc.text(`Sprint/Fase: ${groupData.sprint || 'Não definida'}`, margin + 10, yPos);
  yPos += 10;
  doc.text(`Data: ${groupData.date ? new Date(groupData.date).toLocaleDateString('pt-BR') : 'Não definida'}`, margin + 10, yPos);
  yPos += 10;
  doc.text(`Equipe: ${participants.length} participante(s)`, margin + 10, yPos);
  yPos += 20;
  
  // Add statistics with improved visuals
  doc.setFillColor(220, 230, 250); // Light blue
  doc.roundedRect(margin, yPos, textWidth, 30, 5, 5, 'F');
  yPos += 10;
  
  const statWidth = textWidth / 3;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 102, 204); // Blue text for stats
  doc.text(`${completedTasks.length}`, margin + (statWidth / 2), yPos, { align: 'center' });
  doc.text(`${plannedTasks.length}`, margin + (statWidth * 1.5), yPos, { align: 'center' });
  doc.text(`${participants.length}`, margin + (statWidth * 2.5), yPos, { align: 'center' });
  
  doc.setFontSize(10);
  yPos += 10;
  doc.setTextColor(0, 0, 0); // Reset to black
  doc.setFont('helvetica', 'normal');
  doc.text('Tarefas Concluídas', margin + (statWidth / 2), yPos, { align: 'center' });
  doc.text('Tarefas Planejadas', margin + (statWidth * 1.5), yPos, { align: 'center' });
  doc.text('Membros da Equipe', margin + (statWidth * 2.5), yPos, { align: 'center' });
  yPos += 20;
  
  // Add completed tasks with improved visualization
  yPos = addSectionHeader('📋 Tarefas Concluídas', yPos);
  
  if (completedTasks.length > 0) {
    doc.setFont('helvetica', 'normal');
    completedTasks.forEach((task, index) => {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      // Draw a small bullet point
      doc.setFillColor(51, 102, 204);
      doc.circle(margin + 2.5, yPos - 2, 1.5, 'F');
      doc.setFontSize(10);
      
      // Use slightly different background for alternating items
      const bgColor = index % 2 === 0 ? [245, 250, 255] : [250, 253, 255];
      doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
      doc.roundedRect(margin + 6, yPos - 6, textWidth - 6, 10, 1, 1, 'F');
      
      doc.text(`${task.description}`, margin + 10, yPos);
      yPos += 12;
    });
  } else {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Nenhuma tarefa concluída nesta sprint.', margin + 5, yPos);
    yPos += 12;
  }
  
  // Add planned tasks with improved visualization
  yPos = addSectionHeader('🎯 Próximas Tarefas', yPos);
  
  if (plannedTasks.length > 0) {
    doc.setFont('helvetica', 'normal');
    plannedTasks.forEach((task, index) => {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      // Draw a small checkmark icon
      doc.setFillColor(51, 102, 204);
      doc.circle(margin + 2.5, yPos - 2, 1.5, 'F');
      doc.setFontSize(10);
      
      // Use slightly different background for alternating items
      const bgColor = index % 2 === 0 ? [245, 250, 255] : [250, 253, 255];
      doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
      doc.roundedRect(margin + 6, yPos - 6, textWidth - 6, 10, 1, 1, 'F');
      
      doc.text(`${task.description}`, margin + 10, yPos);
      yPos += 12;
    });
  } else {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Nenhuma tarefa planejada para a próxima sprint.', margin + 5, yPos);
    yPos += 12;
  }
  
  // Check if we need a new page for participants
  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }
  
  // Calculate the average participation
  const totalParticipation = participants.reduce((sum, p) => sum + p.participation, 0);
  const averageParticipation = participants.length > 0 ? totalParticipation / participants.length : 0;
  
  // Add participants with improved visualization
  yPos = addSectionHeader('👥 Participação da Equipe', yPos);
  
  // Add explanation of participation calculation
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text(`Média de participação por membro: ${averageParticipation.toFixed(0)}%`, margin + 5, yPos);
  yPos += 15;
  
  if (participants.length > 0) {
    // Create a table-like layout for participants
    doc.setFillColor(240, 248, 255); // Light blue background
    doc.rect(margin, yPos - 6, textWidth, 12, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text("Nome", margin + 5, yPos);
    doc.text("Participação", pageWidth - margin - 40, yPos);
    yPos += 10;
    
    doc.setFont('helvetica', 'normal');
    
    participants.forEach((participant, index) => {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      // Use slightly different background for alternating rows
      const bgColor = index % 2 === 0 ? [245, 250, 255] : [250, 253, 255];
      doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
      doc.rect(margin, yPos - 6, textWidth, 12, 'F');
      
      // Add participant name and participation percentage
      doc.setFontSize(10);
      doc.text(participant.name, margin + 5, yPos);
      
      // Add participation percentage with a visual bar
      const barWidth = Math.max(5, (participant.participation / 100) * 50);
      doc.setFillColor(65, 105, 225); // Royal Blue
      doc.roundedRect(pageWidth - margin - 60, yPos - 4, barWidth, 8, 2, 2, 'F');
      
      // Add text showing percentage
      doc.setTextColor(255, 255, 255);
      if (barWidth > 15) {
        // If bar is wide enough, put text inside
        doc.text(`${participant.participation}%`, pageWidth - margin - 60 + barWidth / 2, yPos, { align: 'center' });
      } else {
        // Otherwise put text outside
        doc.setTextColor(0, 0, 0);
        doc.text(`${participant.participation}%`, pageWidth - margin - 30, yPos, { align: 'right' });
      }
      doc.setTextColor(0, 0, 0);
      
      yPos += 14;
    });
  } else {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Nenhum participante registrado.', margin + 5, yPos);
    yPos += 10;
  }
  
  // Add decorative footer with gradient
  const footerTop = doc.internal.pageSize.getHeight() - 25;
  doc.setFillColor(220, 230, 250); // Light blue
  doc.rect(0, footerTop, pageWidth, 25, 'F');
  
  // Add footer text
  yPos = footerTop + 10;
  doc.setFontSize(8);
  doc.setTextColor(51, 102, 204); // Dark blue
  doc.text('Relatório gerado automaticamente pelo Sistema de Gestão TLP', pageWidth / 2, yPos, { align: 'center' });
  yPos += 5;
  doc.text(`Data de geração: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, pageWidth / 2, yPos, { align: 'center' });
  
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
