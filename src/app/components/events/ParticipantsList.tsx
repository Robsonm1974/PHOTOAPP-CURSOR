'use client'

import { useState } from 'react'
import { Users, Plus, Upload, Search, Edit, QrCode, Download, Printer, Camera, User } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Participant, useEvents } from '@/app/contexts/EventsContext'

interface ParticipantsListProps {
  eventId: string
  eventTitle: string
  participants: Participant[]
  onAddParticipant: () => void
  onEditParticipant: (participant: Participant) => void
  onViewQRCode: (participant: Participant) => void
  onAddPhotos: (participant: Participant) => void
  onViewProfile?: (participant: Participant) => void
  onClose: () => void
}

export default function ParticipantsList({
  eventId,
  eventTitle,
  participants,
  onAddParticipant,
  onEditParticipant,
  onViewQRCode,
  onAddPhotos,
  onViewProfile,
  onClose
}: ParticipantsListProps) {
  const { addParticipantsBatch } = useEvents()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<keyof Participant>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const handleSort = (column: keyof Participant) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const filteredAndSortedParticipants = participants
    .filter(participant =>
      participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
         .sort((a, b) => {
       const aValue = a[sortBy] || ''
       const bValue = b[sortBy] || ''
       
       if (sortOrder === 'asc') {
         return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
       } else {
         return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
       }
     })

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const csvText = e.target?.result as string
        parseAndAddParticipants(csvText)
      }
      reader.readAsText(file)
    }
  }

    const parseAndAddParticipants = (csvText: string) => {
    try {
      const lines = csvText.split('\n').filter(line => line.trim())
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      
      // Verificar se as colunas necessárias existem
      const nameIndex = headers.findIndex(h => h.includes('nome') || h.includes('name'))
      const classIndex = headers.findIndex(h => h.includes('turma') || h.includes('classe') || h.includes('class'))
      
      if (nameIndex === -1) {
        alert('Erro: Coluna "Nome" não encontrada no CSV')
        return
      }
      
      if (classIndex === -1) {
        alert('Erro: Coluna "Turma/Classe" não encontrada no CSV')
        return
      }
      
      // Preparar dados dos participantes para importação em lote
      const participantsToAdd: Array<Omit<Participant, 'id' | 'qrCode'>> = []
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        const name = values[nameIndex]
        const className = values[classIndex]
        
        if (name && className) {
          participantsToAdd.push({
            eventId,
            name,
            class: className,
            type: 'aluno',
            photos: [],
            profilePhoto: undefined
          })
        }
      }
      
      if (participantsToAdd.length > 0) {
        // Usar a função do contexto para adicionar em lote
        addParticipantsBatch(participantsToAdd)
        alert(`Importação concluída! ${participantsToAdd.length} participantes adicionados.`)
      } else {
        alert('Nenhum participante válido encontrado no CSV.')
      }
    } catch (error) {
      console.error('Erro ao processar CSV:', error)
      alert('Erro ao processar o arquivo CSV. Verifique o formato.')
    }
  }

  const handlePrintList = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Lista de Participantes - ${eventTitle}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              h1 { color: #333; }
            </style>
          </head>
          <body>
            <h1>Lista de Participantes</h1>
            <h2>${eventTitle}</h2>
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Turma</th>
                  <th>Tipo</th>
                  <th>QR Code</th>
                </tr>
              </thead>
              <tbody>
                ${filteredAndSortedParticipants.map(p => `
                  <tr>
                    <td>${p.name}</td>
                    <td>${p.class}</td>
                    <td>${p.type}</td>
                    <td>${p.qrCode}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleExportCSV = () => {
    const csvContent = [
      ['Nome', 'Turma', 'Tipo', 'QR Code'],
      ...filteredAndSortedParticipants.map(p => [p.name, p.class, p.type, p.qrCode])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `participantes_${eventTitle.replace(/\s+/g, '_')}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Unified Header & Actions Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          {/* Title Section */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Participantes</h2>
                <p className="text-gray-600 text-sm sm:text-base">Evento: {eventTitle}</p>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  className="bg-white hover:bg-gray-50 border-gray-300 shadow-sm"
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="p-4 sm:p-6">
            <div className="flex flex-col xl:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome, turma ou tipo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11 shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Button 
                  onClick={onAddParticipant}
                  className="bg-blue-600 hover:bg-blue-700 shadow-sm h-11 px-3 sm:px-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Adicionar</span>
                  <span className="sm:hidden">Add</span>
                </Button>
                
                <div className="relative">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCSVUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <Button variant="outline" asChild className="h-11 shadow-sm border-gray-300">
                    <label htmlFor="csv-upload" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Upload CSV</span>
                      <span className="sm:hidden">Upload</span>
                    </label>
                  </Button>
                </div>

                <Button 
                  variant="outline" 
                  onClick={handlePrintList}
                  className="bg-white hover:bg-gray-50 border-gray-300 shadow-sm h-11"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Imprimir</span>
                  <span className="sm:hidden">Print</span>
                </Button>

                <Button 
                  variant="outline" 
                  onClick={handleExportCSV}
                  className="bg-white hover:bg-gray-50 border-gray-300 shadow-sm h-11"
                >
                  <Download className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Exportar</span>
                  <span className="sm:hidden">Export</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Participants Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {filteredAndSortedParticipants.length} Participante{filteredAndSortedParticipants.length !== 1 ? 's' : ''}
                </h3>
              </div>
              <div className="text-sm text-gray-500">
                {searchTerm && `Filtrado de ${participants.length} total`}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th 
                      className="text-left py-4 px-6 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      Nome {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="text-left py-4 px-6 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('class')}
                    >
                      Turma {sortBy === 'class' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="text-left py-4 px-6 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('type')}
                    >
                      Tipo {sortBy === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">QR Code</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Fotos</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAndSortedParticipants.map((participant) => (
                    <tr key={participant.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-gray-900">{participant.name}</td>
                      <td className="py-4 px-6 text-gray-700">{participant.class}</td>
                      <td className="py-4 px-6 text-gray-700 capitalize">{participant.type}</td>
                      <td className="py-4 px-6 font-mono text-sm text-blue-600 bg-blue-50 rounded-md">{participant.qrCode}</td>
                      <td className="py-4 px-6">
                        {participant.photos.length > 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {participant.photos.length} foto{participant.photos.length !== 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Sem fotos
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditParticipant(participant)}
                            className="hover:bg-blue-50 hover:border-blue-300"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewQRCode(participant)}
                            className="hover:bg-purple-50 hover:border-purple-300"
                          >
                            <QrCode className="h-3 w-3 mr-1" />
                            QR Code
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onAddPhotos(participant)}
                            className="hover:bg-green-50 hover:border-green-300"
                          >
                            <Camera className="h-3 w-3 mr-1" />
                            Fotos
                          </Button>
                          {onViewProfile && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onViewProfile(participant)}
                              className="hover:bg-gray-50 hover:border-gray-300"
                            >
                              <User className="h-3 w-3 mr-1" />
                              Perfil
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Cards */}
            <div className="lg:hidden space-y-4 p-4">
              {filteredAndSortedParticipants.map((participant) => (
                <div key={participant.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{participant.name}</h4>
                      <p className="text-gray-600">{participant.class} • {participant.type}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {participant.qrCode}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      {participant.photos.length > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {participant.photos.length} foto{participant.photos.length !== 1 ? 's' : ''}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          Sem fotos
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditParticipant(participant)}
                      className="w-full hover:bg-blue-50"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewQRCode(participant)}
                      className="w-full hover:bg-purple-50"
                    >
                      <QrCode className="h-3 w-3 mr-1" />
                      QR
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAddPhotos(participant)}
                      className="w-full hover:bg-green-50"
                    >
                      <Camera className="h-3 w-3 mr-1" />
                      Fotos
                    </Button>
                    {onViewProfile && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewProfile(participant)}
                        className="w-full hover:bg-gray-50"
                      >
                        <User className="h-3 w-3 mr-1" />
                        Perfil
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {filteredAndSortedParticipants.length === 0 && (
            <div className="text-center py-16 px-6">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {searchTerm ? 'Nenhum participante encontrado' : 'Nenhum participante ainda'}
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {searchTerm 
                  ? 'Tente ajustar os termos de busca ou verifique a ortografia'
                  : 'Comece adicionando participantes ao evento usando o botão "Adicionar" acima'
                }
              </p>
              {!searchTerm && (
                <Button onClick={onAddParticipant} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Participante
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
