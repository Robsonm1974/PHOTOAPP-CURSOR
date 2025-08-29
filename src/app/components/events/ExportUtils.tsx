'use client'

import { Participant, Event } from '@/app/contexts/EventsContext'
import QRCode from 'qrcode'

export class ExportUtils {
  /**
   * Exporta lista de participantes para CSV
   */
  static exportParticipantsToCSV(participants: Participant[], event: Event) {
    if (participants.length === 0) {
      alert('Não há participantes para exportar.')
      return false
    }

    const csvHeaders = [
      'Nome',
      'Turma',
      'Tipo',
      'QR Code',
      'Total de Fotos',
      'Data de Cadastro',
      'Status',
      'Evento'
    ]

    const csvData = participants.map(participant => [
      `"${participant.name}"`,
      `"${participant.class}"`,
      participant.type === 'aluno' ? 'Aluno' : 
      participant.type === 'professor' ? 'Professor' : 'Funcionário',
      participant.qrCode || participant.id,
      participant.photos?.length || 0,
      new Date().toLocaleDateString('pt-BR'),
      'Ativo',
      `"${event.title}"`
    ])

    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')

    // Adicionar BOM para UTF-8 (suporte a acentos)
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    })
    
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    
    const fileName = `participantes_${event.title.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`
    link.setAttribute('download', fileName)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    return true
  }

  /**
   * Gera QR codes reais e abre janela de impressão
   */
  static async printQRCodes(participants: Participant[], event: Event) {
    if (participants.length === 0) {
      alert('Não há participantes para imprimir QR codes.')
      return false
    }

    try {
      // Gerar QR codes reais para todos os participantes
      const qrPromises = participants.map(async (participant) => {
        const qrData = JSON.stringify({
          id: participant.id,
          name: participant.name,
          class: participant.class,
          eventId: event.id,
          type: participant.type
        })
        
        const qrCodeDataURL = await QRCode.toDataURL(qrData, {
          width: 150,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
        
        return {
          participant,
          qrCode: qrCodeDataURL
        }
      })

      const participantsWithQR = await Promise.all(qrPromises)

      // Criar janela de impressão
      const printWindow = window.open('', '_blank', 'width=900,height=700')
      if (!printWindow) {
        alert('Por favor, permita pop-ups para imprimir os QR codes.')
        return false
      }

      const printHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>QR Codes - ${event.title}</title>
            <meta charset="utf-8">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body { 
                font-family: 'Arial', sans-serif; 
                margin: 15px;
                background: white;
                color: black;
              }
              
              .header {
                text-align: center;
                margin-bottom: 25px;
                border-bottom: 3px solid #2563eb;
                padding-bottom: 15px;
              }
              
              .header h1 {
                color: #2563eb;
                font-size: 24px;
                margin-bottom: 5px;
              }
              
              .header h2 {
                color: #64748b;
                font-size: 18px;
                margin-bottom: 10px;
              }
              
              .header p {
                color: #64748b;
                font-size: 14px;
                margin: 2px 0;
              }
              
              .qr-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
                margin-top: 20px;
              }
              
              .qr-item {
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                padding: 15px;
                text-align: center;
                page-break-inside: avoid;
                background: white;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              }
              
              .qr-code-container {
                margin-bottom: 10px;
              }
              
              .qr-code {
                width: 130px;
                height: 130px;
                margin: 0 auto;
                border: 1px solid #cbd5e1;
                border-radius: 4px;
              }
              
              .participant-info {
                font-size: 12px;
                margin-top: 8px;
              }
              
              .participant-name {
                font-weight: bold;
                font-size: 14px;
                margin-bottom: 4px;
                color: #1e293b;
              }
              
              .participant-detail {
                margin: 2px 0;
                color: #475569;
              }
              
              .qr-id {
                font-family: 'Courier New', monospace;
                font-size: 10px;
                color: #64748b;
                margin-top: 5px;
                word-break: break-all;
              }
              
              .footer {
                margin-top: 30px;
                text-align: center;
                font-size: 12px;
                color: #64748b;
                border-top: 1px solid #e2e8f0;
                padding-top: 15px;
              }
              
              @media print {
                body { 
                  margin: 10px;
                }
                .qr-grid { 
                  page-break-inside: avoid;
                }
                .qr-item {
                  box-shadow: none;
                  border: 1px solid #000;
                }
              }
              
              @page {
                margin: 1cm;
                size: A4;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${event.title}</h1>
              <h2>${event.school}</h2>
              <p><strong>Data do Evento:</strong> ${new Date(event.startDate).toLocaleDateString('pt-BR')}</p>
              <p><strong>Total de Participantes:</strong> ${participants.length}</p>
              <p><strong>Gerado em:</strong> ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
            </div>
            
            <div class="qr-grid">
              ${participantsWithQR.map(({ participant, qrCode }) => `
                <div class="qr-item">
                  <div class="qr-code-container">
                    <img src="${qrCode}" alt="QR Code ${participant.name}" class="qr-code" />
                  </div>
                  <div class="participant-info">
                    <div class="participant-name">${participant.name}</div>
                    <div class="participant-detail">📚 Turma: ${participant.class}</div>
                    <div class="participant-detail">
                      👤 ${participant.type === 'aluno' ? 'Aluno' :
                           participant.type === 'professor' ? 'Professor' : 
                           participant.type === 'funcionario' ? 'Funcionário' : 'Outro'}
                    </div>
                    <div class="participant-detail">📷 Fotos: ${participant.photos?.length || 0}</div>
                    <div class="qr-id">ID: ${participant.id}</div>
                  </div>
                </div>
              `).join('')}
            </div>
            
            <div class="footer">
              <p>Sistema Dia da Foto • QR Codes gerados automaticamente</p>
              <p>Para melhor qualidade, imprima em papel branco de boa qualidade</p>
            </div>
            
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  // Opcional: fechar a janela após imprimir
                  // window.onafterprint = function() { window.close(); }
                }, 1000);
              }
            </script>
          </body>
        </html>
      `

      printWindow.document.write(printHTML)
      printWindow.document.close()
      
      return true
    } catch (error) {
      console.error('Erro ao gerar QR codes:', error)
      alert('Erro ao gerar QR codes. Tente novamente.')
      return false
    }
  }

  /**
   * Exporta participantes para Excel (formato mais avançado)
   */
  static exportParticipantsToExcel(participants: Participant[], event: Event) {
    // Implementação futura para formato Excel
    // Por enquanto, usa CSV
    return this.exportParticipantsToCSV(participants, event)
  }
}
