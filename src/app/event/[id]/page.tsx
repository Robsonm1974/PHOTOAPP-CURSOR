'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Calendar, Camera, Users, Settings, Plus, Upload, Search, Edit, QrCode, Download, Printer, ArrowLeft, MapPin, Phone, DollarSign, FileText, Trash2 } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { useAuth } from '@/app/contexts/AuthContext'
import { useEvents, Event, Participant } from '@/app/contexts/EventsContext'
import Link from 'next/link'
import ParticipantsList from '@/app/components/events/ParticipantsList'
import QRCodeViewer from '@/app/components/events/QRCodeViewer'
import ParticipantForm from '@/app/components/events/ParticipantForm'
import ParticipantProfile from '@/app/components/events/ParticipantProfile'
import BatchPhotoUpload from '@/app/components/events/BatchPhotoUpload'
import ProtectedRoute from '@/app/components/auth/ProtectedRoute'
import { ExportUtils } from '@/app/components/events/ExportUtils'

export default function EventPage() {
  const params = useParams()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { events, participants, addParticipant, updateParticipant, addPhotosToParticipant, photoSales, deleteEvent } = useEvents()
  
  const [event, setEvent] = useState<Event | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showParticipants, setShowParticipants] = useState(false)
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null)
  const [showQRCode, setShowQRCode] = useState(false)
  const [showParticipantForm, setShowParticipantForm] = useState(false)
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null)
  const [showParticipantProfile, setShowParticipantProfile] = useState(false)
  const [showBatchUpload, setShowBatchUpload] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (params.id && events.length > 0) {
      const foundEvent = events.find(e => e.id === params.id)
      if (foundEvent) {
        setEvent(foundEvent)
      } else {
        router.push('/dashboard')
      }
    }
  }, [params.id, events, router])

  if (!event) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando evento...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const eventParticipants = participants.filter(p => p.eventId === event.id)

  const handleViewParticipants = () => {
    setShowParticipants(true)
  }

  const handleViewQRCode = (participant: Participant) => {
    setSelectedParticipant(participant)
    setShowQRCode(true)
  }

  const handleAddParticipant = () => {
    setEditingParticipant(null)
    setShowParticipantForm(true)
  }

  const handleEditParticipant = (participant: Participant) => {
    setEditingParticipant(participant)
    setShowParticipantForm(true)
  }

  const handleViewParticipantProfile = (participant: Participant) => {
    setSelectedParticipant(participant)
    setShowParticipantProfile(true)
  }

  const handleParticipantSubmit = (participantData: any) => {
    if (editingParticipant) {
      updateParticipant(editingParticipant.id, participantData)
    } else {
      addParticipant({
        ...participantData,
        eventId: event.id
      })
    }
    setShowParticipantForm(false)
    setEditingParticipant(null)
  }

  const handleAddPhotos = (participant: Participant) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = 'image/*'
    
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files && files.length > 0) {
        const photoUrls = Array.from(files).map(file => {
          return URL.createObjectURL(file)
        })
        
        addPhotosToParticipant(participant.id, photoUrls)
        alert(`${photoUrls.length} foto(s) adicionada(s) ao participante ${participant.name}`)
      }
    }
    
    input.click()
  }

  const handleExportList = async () => {
    setIsExporting(true)
    try {
      const success = ExportUtils.exportParticipantsToCSV(eventParticipants, event)
      if (success) {
        alert(`✅ Lista de ${eventParticipants.length} participantes exportada com sucesso!\n\nO arquivo CSV foi baixado e pode ser aberto no Excel.`)
      }
    } catch (error) {
      console.error('Erro ao exportar:', error)
      alert('❌ Erro ao exportar lista. Tente novamente.')
    } finally {
      setIsExporting(false)
    }
  }

  const handlePrintQRCodes = async () => {
    setIsPrinting(true)
    try {
      const success = await ExportUtils.printQRCodes(eventParticipants, event)
      if (success) {
        alert(`🖨️ QR codes gerados com sucesso!\n\nJanela de impressão aberta com ${eventParticipants.length} QR codes reais.`)
      }
    } catch (error) {
      console.error('Erro ao imprimir QR codes:', error)
      alert('❌ Erro ao gerar QR codes. Verifique sua conexão e tente novamente.')
    } finally {
      setIsPrinting(false)
    }
  }

  const handleDeleteEvent = () => {
    if (event) {
      deleteEvent(event.id)
      router.push('/dashboard')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'upcoming':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo'
      case 'upcoming':
        return 'Próximo'
      case 'completed':
        return 'Concluído'
      default:
        return 'Desconhecido'
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-background transition-colors duration-200">
        {/* Header */}
        <header className="bg-white dark:bg-card shadow-sm border-b dark:border-border transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/dashboard')}
                  className="mr-3"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <Camera className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dia da Foto</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">Olá, {user?.name || user?.email}</span>
                <Link href="/configuracoes">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurações
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={logout}>
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Event Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{event.title}</h2>
                <p className="text-lg text-gray-600 mt-2">{event.school}</p>
                <div className="flex items-center gap-6 mt-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(event.status)}`}>
                    {getStatusText(event.status)}
                  </span>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                                        {new Date(event.startDate).toLocaleDateString('pt-BR')}
                    {event.endDate && event.startDate !== event.endDate &&
                      ` - ${new Date(event.endDate).toLocaleDateString('pt-BR')}`
                    }
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  Informações da Escola
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Escola</p>
                    <p className="font-medium">{event.school}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contato</p>
                    <p className="font-medium">{event.contact}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Telefone</p>
                    <p className="font-medium">{event.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                  Informações Financeiras
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Comissão por Venda</p>
                    <p className="font-medium text-green-600">{event.commission}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Preço por Foto</p>
                    <p className="font-medium text-green-600">R$ {event.photoPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Vendas Confirmadas</p>
                    <p className="font-medium text-green-600">
                      {photoSales.filter(sale => sale.eventId === event.id && sale.status === 'paid').length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total de Participantes</p>
                    <p className="font-medium">{eventParticipants.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Comissão Total</p>
                    <p className="font-medium text-green-600">
                      R$ {photoSales
                        .filter(sale => sale.eventId === event.id && sale.status === 'paid')
                        .reduce((sum, sale) => sum + sale.commissionAmount, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-purple-600" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Notas</p>
                    <p className="font-medium">
                      {event.notes || 'Nenhuma observação registrada'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                      {getStatusText(event.status)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Gerencie rapidamente este evento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button onClick={handleAddParticipant}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Participante
                </Button>
                <Button variant="outline" onClick={handleViewParticipants}>
                  <Users className="h-4 w-4 mr-2" />
                  Ver Lista de Participantes
                </Button>
                <Button 
                  onClick={() => setShowBatchUpload(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Adicionar Fotos em Lote
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleExportList}
                  disabled={isExporting || eventParticipants.length === 0}
                  className={eventParticipants.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-bounce' : ''}`} />
                  {isExporting ? 'Exportando...' : 'Exportar Lista'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handlePrintQRCodes}
                  disabled={isPrinting || eventParticipants.length === 0}
                  className={eventParticipants.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  <Printer className={`h-4 w-4 mr-2 ${isPrinting ? 'animate-spin' : ''}`} />
                  {isPrinting ? 'Gerando QR Codes...' : 'Imprimir QR Codes'}
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="ml-2"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir Evento
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Modals */}
        {showParticipants && (
          <ParticipantsList
            eventId={event.id}
            eventTitle={event.title}
            participants={eventParticipants}
            onAddParticipant={handleAddParticipant}
            onEditParticipant={handleEditParticipant}
            onViewQRCode={handleViewQRCode}
            onAddPhotos={handleAddPhotos}
            onViewProfile={handleViewParticipantProfile}
            onClose={() => setShowParticipants(false)}
          />
        )}

        {showQRCode && selectedParticipant && (
          <QRCodeViewer
            participant={selectedParticipant}
            onClose={() => {
              setShowQRCode(false)
              setSelectedParticipant(null)
            }}
          />
        )}

        {showParticipantForm && (
          <ParticipantForm
            eventId={event.id}
            initialData={editingParticipant ? {
              name: editingParticipant.name,
              class: editingParticipant.class,
              type: editingParticipant.type,
              photos: editingParticipant.photos,
              profilePhoto: editingParticipant.profilePhoto
            } : undefined}
            onSubmit={handleParticipantSubmit}
            onCancel={() => {
              setShowParticipantForm(false)
              setEditingParticipant(null)
            }}
          />
        )}

        {showParticipantProfile && selectedParticipant && (
          <ParticipantProfile
            participant={selectedParticipant}
            onClose={() => {
              setShowParticipantProfile(false)
              setSelectedParticipant(null)
            }}
            onEdit={() => {
              setShowParticipantProfile(false)
              setSelectedParticipant(null)
              handleEditParticipant(selectedParticipant)
            }}
            onAddPhotos={() => {
              setShowParticipantProfile(false)
              setSelectedParticipant(null)
              handleAddPhotos(selectedParticipant)
            }}
          />
        )}

        {showBatchUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <BatchPhotoUpload
              eventId={event.id}
              participants={eventParticipants}
              onClose={() => setShowBatchUpload(false)}
            />
          </div>
        )}

        {/* Modal de Confirmação de Exclusão */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-card rounded-lg max-w-md w-full p-6 transition-colors duration-200">
              <div className="flex items-center mb-4">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20">
                  <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Excluir Evento
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Tem certeza que deseja excluir o evento <strong>"{event.title}"</strong>? 
                  Esta ação não pode ser desfeita e todos os participantes e dados relacionados serão perdidos.
                </p>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteEvent}
                    className="flex-1"
                  >
                    Sim, Excluir
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
