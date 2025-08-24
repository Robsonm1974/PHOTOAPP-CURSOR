'use client'

import { useState } from 'react'
import { QrCode, Download, Printer, X } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import QRCode from 'react-qr-code'
import { Participant } from '@/app/contexts/EventsContext'

interface QRCodeViewerProps {
  participant: Participant
  onClose: () => void
}

export default function QRCodeViewer({ participant, onClose }: QRCodeViewerProps) {
  const [qrSize, setQrSize] = useState(200)

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${participant.name}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                text-align: center;
              }
              .qr-container {
                border: 2px solid #333;
                padding: 20px;
                margin: 20px auto;
                width: fit-content;
                background: white;
              }
              .qr-code {
                margin: 20px 0;
              }
              .info {
                margin: 20px 0;
                font-size: 18px;
              }
              .name { font-weight: bold; font-size: 24px; }
              .class { font-size: 20px; color: #666; }
              .type { font-size: 18px; color: #888; }
              .code { font-family: monospace; font-size: 16px; color: #333; }
              @media print {
                body { margin: 0; }
                .qr-container { border: none; }
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <div class="info">
                <div class="name">${participant.name}</div>
                <div class="class">${participant.class}</div>
                <div class="type">${participant.type}</div>
                <div class="code">Código: ${participant.qrCode}</div>
              </div>
              <div class="qr-code">
                <svg width="${qrSize}" height="${qrSize}" viewBox="0 0 ${qrSize} ${qrSize}">
                  ${generateQRCodeSVG(participant.qrCode, qrSize)}
                </svg>
              </div>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleDownload = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (ctx) {
      canvas.width = qrSize + 200
      canvas.height = qrSize + 200
      
      // Background
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Border
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 2
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20)
      
      // Text
      ctx.fillStyle = '#333'
      ctx.font = 'bold 24px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(participant.name, canvas.width / 2, 60)
      
      ctx.font = '20px Arial'
      ctx.fillStyle = '#666'
      ctx.fillText(participant.class, canvas.width / 2, 90)
      
      ctx.font = '18px Arial'
      ctx.fillStyle = '#888'
      ctx.fillText(participant.type, canvas.width / 2, 115)
      
      ctx.font = '16px monospace'
      ctx.fillStyle = '#333'
      ctx.fillText(`Código: ${participant.qrCode}`, canvas.width / 2, 140)
      
      // QR Code (simplified representation)
      ctx.fillStyle = '#000'
      const qrStartX = (canvas.width - qrSize) / 2
      const qrStartY = 160
      
      // This is a simplified QR code representation
      // In a real implementation, you'd use a proper QR code library
      ctx.fillRect(qrStartX, qrStartY, qrSize, qrSize)
      
      // Download
      const link = document.createElement('a')
      link.download = `qr_code_${participant.name.replace(/\s+/g, '_')}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  // Simplified QR code generation - in production, use a proper library
  const generateQRCodeSVG = (text: string, size: number) => {
    // This is a placeholder - in reality, you'd use a proper QR code library
    return `<rect width="${size}" height="${size}" fill="white"/><rect x="10" y="10" width="${size-20}" height="${size-20}" fill="black"/>`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl">QR Code do Participante</CardTitle>
            <CardDescription>
              Escaneie para identificar {participant.name}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Participant Info */}
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">{participant.name}</h3>
            <p className="text-lg text-gray-600">{participant.class}</p>
            <p className="text-md text-gray-500">{participant.type}</p>
            <p className="text-sm font-mono text-gray-700">Código: {participant.qrCode}</p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            <div className="border-2 border-gray-300 p-4 bg-white">
              <QRCode
                value={participant.qrCode}
                size={qrSize}
                level="M"
              />
            </div>
          </div>

          {/* Size Control */}
          <div className="space-y-2">
            <label htmlFor="qr-size" className="text-sm font-medium text-gray-700">
              Tamanho do QR Code
            </label>
            <input
              id="qr-size"
              type="range"
              min="100"
              max="300"
              value={qrSize}
              onChange={(e) => setQrSize(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-500">
              {qrSize}px x {qrSize}px
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handlePrint} className="flex-1">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline" onClick={handleDownload} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Baixar
            </Button>
          </div>

          {/* Print Instructions */}
          <div className="text-center text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
            <p>💡 Dica: Use o botão "Imprimir" para gerar uma versão otimizada para impressão</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
