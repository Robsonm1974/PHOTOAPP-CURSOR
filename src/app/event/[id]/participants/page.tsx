'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Calendar, Camera, Users, Settings, Plus, Upload, Search, Edit, QrCode, Download, Printer, ArrowLeft, User } from 'lucide-react'
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
import ProtectedRoute from '@/app/components/auth/ProtectedRoute'

export default function EventParticipantsPage() {
  const params = useParams()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { events, participants, addParticipant, updateParticipant, addPhotosToParticipant } = useEvents()
  
  const [event, setEvent] = useState<Event | null>(null)
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null)
  const [showQRCode, setShowQRCode] = useState(false)
  const [showParticipantForm, setShowParticipantForm] = useState(false)
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null)
  const [showParticipantProfile, setShowParticipantProfile] = useState(false)

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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/event/${event.id}`)}
                  className="mr-3"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao Evento
                </Button>
                <Camera className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Dia da Foto</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Olá, {user?.name || user?.email}</span>
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
                <h2 className="text-3xl font-bold text-gray-900">Participantes do Evento</h2>
                <p className="text-lg text-gray-600 mt-2">{event.title}</p>
                <p className="text-gray-500 mt-1">{event.school}</p>
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                                        {new Date(event.startDate).toLocaleDateString('pt-BR')}
                    {event.endDate && event.startDate !== event.endDate &&
                      ` - ${new Date(event.endDate).toLocaleDateString('pt-BR')}`
                    }
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {eventParticipants.length} participante{eventParticipants.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleAddParticipant}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Participante
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push(`/event/${event.id}`)}
                >
                  Ver Detalhes do Evento
                </Button>
              </div>
            </div>
          </div>

          {/* Participants List */}
          <ParticipantsList
            eventId={event.id}
            eventTitle={event.title}
            participants={eventParticipants}
            onAddParticipant={handleAddParticipant}
            onEditParticipant={handleEditParticipant}
            onViewQRCode={handleViewQRCode}
            onAddPhotos={handleAddPhotos}
            onViewProfile={handleViewParticipantProfile}
            onClose={() => router.push(`/event/${event.id}`)}
          />
        </main>

        {/* Modals */}
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
      </div>
    </ProtectedRoute>
  )
}
