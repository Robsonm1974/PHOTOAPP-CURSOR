'use client'

import { useState, useRef } from 'react'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Upload, FileImage, AlertCircle, CheckCircle, Download, X } from 'lucide-react'
import { useEvents, Participant } from '@/app/contexts/EventsContext'

interface BatchPhotoUploadProps {
  eventId: string
  participants: Participant[]
  onClose?: () => void
}

interface PhotoProcessingResult {
  fileName: string
  qrCode: string | null
  participant: Participant | null
  error?: string
  success: boolean
}

export default function BatchPhotoUpload({ eventId, participants, onClose }: BatchPhotoUploadProps) {
  const { addPhotosToParticipant } = useEvents()
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<PhotoProcessingResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const extractQRCodeFromFileName = (fileName: string): string | null => {
    // Regex para extrair QR Code do formato [EOS2123_123456] ou similar
    const patterns = [
      /\[.*?_(\d{6})\]/,  // [EOS2123_123456]
      /\[(\d{6})\]/,      // [123456]
      /_(\d{6})_/,        // filename_123456_something
      /_(\d{6})\./,       // filename_123456.jpg
      /(\d{6})/           // qualquer sequência de 6 dígitos
    ]

    for (const pattern of patterns) {
      const match = fileName.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }
    return null
  }

  const findParticipantByQRCode = (qrCode: string): Participant | null => {
    return participants.find(p => p.qrCode === qrCode) || null
  }

  const handleFileSelection = () => {
    fileInputRef.current?.click()
  }

  const processPhotos = async (files: FileList) => {
    setIsProcessing(true)
    const results: PhotoProcessingResult[] = []
    const successfulAssociations: { participantId: string, photos: string[] }[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Verificar se é uma imagem JPG
      if (!file.type.includes('image/jpeg') && !file.name.toLowerCase().endsWith('.jpg')) {
        results.push({
          fileName: file.name,
          qrCode: null,
          participant: null,
          error: 'Arquivo não é uma imagem JPG',
          success: false
        })
        continue
      }

      // Extrair QR Code do nome do arquivo
      const qrCode = extractQRCodeFromFileName(file.name)
      if (!qrCode) {
        results.push({
          fileName: file.name,
          qrCode: null,
          participant: null,
          error: 'QR Code não encontrado no nome do arquivo',
          success: false
        })
        continue
      }

      // Encontrar participante
      const participant = findParticipantByQRCode(qrCode)
      if (!participant) {
        results.push({
          fileName: file.name,
          qrCode,
          participant: null,
          error: `Participante com QR Code ${qrCode} não encontrado`,
          success: false
        })
        continue
      }

      // Simular upload da foto (em produção, você faria upload real)
      const photoUrl = `/photos/${participant.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}_${i}.jpg`
      
      // Adicionar à lista de associações bem-sucedidas
      const existingAssociation = successfulAssociations.find(a => a.participantId === participant.id)
      if (existingAssociation) {
        existingAssociation.photos.push(photoUrl)
      } else {
        successfulAssociations.push({
          participantId: participant.id,
          photos: [photoUrl]
        })
      }

      results.push({
        fileName: file.name,
        qrCode,
        participant,
        success: true
      })
    }

    // Aplicar as associações no contexto
    successfulAssociations.forEach(association => {
      addPhotosToParticipant(association.participantId, association.photos)
    })

    setResults(results)
    setShowResults(true)
    setIsProcessing(false)
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      processPhotos(files)
    }
  }

  const exportErrorLog = () => {
    const errors = results.filter(r => !r.success)
    const errorData = {
      evento: eventId,
      dataProcessamento: new Date().toISOString(),
      totalArquivos: results.length,
      sucessos: results.filter(r => r.success).length,
      erros: errors.length,
      detalhesErros: errors.map(error => ({
        arquivo: error.fileName,
        qrCodeEncontrado: error.qrCode,
        participanteEncontrado: error.participant?.name || 'N/A',
        erro: error.error
      }))
    }

    const blob = new Blob([JSON.stringify(errorData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `log_erros_upload_fotos_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const resetUpload = () => {
    setResults([])
    setShowResults(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const successCount = results.filter(r => r.success).length
  const errorCount = results.filter(r => !r.success).length

  if (showResults) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <FileImage className="h-5 w-5 mr-2" />
                Resultado do Upload em Lote
              </CardTitle>
              <CardDescription>
                Processamento concluído: {successCount} sucessos, {errorCount} erros
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={resetUpload}>
                Novo Upload
              </Button>
              {onClose && (
                <Button variant="ghost" onClick={onClose} size="sm">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <FileImage className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-900">{results.length}</p>
              <p className="text-sm text-blue-600">Total de Arquivos</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-900">{successCount}</p>
              <p className="text-sm text-green-600">Fotos Associadas</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-900">{errorCount}</p>
              <p className="text-sm text-red-600">Erros</p>
            </div>
          </div>

          {/* Lista de Resultados */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">Detalhes do Processamento</h4>
              {errorCount > 0 && (
                <Button onClick={exportErrorLog} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Log de Erros
                </Button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg border ${
                    result.success 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {result.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{result.fileName}</p>
                        {result.qrCode && (
                          <p className="text-sm text-gray-600">QR Code: {result.qrCode}</p>
                        )}
                        {result.participant && (
                          <p className="text-sm text-gray-600">
                            Participante: {result.participant.name} ({result.participant.class})
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {result.success ? (
                        <span className="text-sm font-medium text-green-700">Sucesso</span>
                      ) : (
                        <span className="text-sm text-red-700">{result.error}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Adicionar Fotos em Lote
            </CardTitle>
            <CardDescription>
              Selecione uma pasta com fotos editadas. O QR Code deve estar no nome do arquivo.
            </CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" onClick={onClose} size="sm">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Instruções */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Formato dos Arquivos</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Exemplo:</strong> [EOS2123_123456].jpg → QR Code: 123456</li>
              <li>• <strong>Formatos aceitos:</strong> [texto_123456], [123456], arquivo_123456.jpg</li>
              <li>• <strong>Tipo:</strong> Apenas arquivos .jpg</li>
              <li>• <strong>QR Code:</strong> Deve ter exatamente 6 dígitos</li>
            </ul>
          </div>

          {/* Área de Upload */}
          <div className="text-center">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors">
              <FileImage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Selecionar Fotos
              </h3>
              <p className="text-gray-600 mb-4">
                Escolha múltiplas fotos para upload automático
              </p>
              <Button 
                onClick={handleFileSelection}
                disabled={isProcessing}
                className="mb-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Selecionar Arquivos
                  </>
                )}
              </Button>
              <p className="text-xs text-gray-500">
                Selecione múltiplos arquivos usando Ctrl/Cmd + clique
              </p>
            </div>
          </div>

          {/* Participantes Disponíveis */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">
              Participantes Disponíveis ({participants.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {participants.map(participant => (
                <div key={participant.id} className="text-sm">
                  <span className="font-medium">{participant.name}</span>
                  <span className="text-gray-500"> (QR: {participant.qrCode})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Input oculto para seleção de arquivos */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </CardContent>
    </Card>
  )
}




