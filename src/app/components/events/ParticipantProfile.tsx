'use client'

import { useState } from 'react'
import { X, User, GraduationCap, Tag, Camera, Edit, QrCode, Star, StarOff, Plus } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Participant, useEvents } from '@/app/contexts/EventsContext'

interface ParticipantProfileProps {
  participant: Participant
  onClose: () => void
  onEdit: () => void
  onAddPhotos: () => void
}

export default function ParticipantProfile({
  participant,
  onClose,
  onEdit,
  onAddPhotos
}: ParticipantProfileProps) {
  const { updateParticipantProfilePhoto } = useEvents()
  const [selectedProfilePhoto, setSelectedProfilePhoto] = useState<string | undefined>(
    participant.profilePhoto
  )

  const handleSetProfilePhoto = (photoUrl: string) => {
    setSelectedProfilePhoto(photoUrl)
    updateParticipantProfilePhoto(participant.id, photoUrl)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center">
                <User className="h-6 w-6 mr-3 text-blue-600" />
                Perfil do Participante
              </CardTitle>
              <CardDescription>
                Visualize e gerencie as informações e fotos de {participant.name}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Nome:</span>
              </div>
              <p className="font-medium text-lg">{participant.name}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <GraduationCap className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Turma:</span>
              </div>
              <p className="font-medium text-lg">{participant.class}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Tag className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Tipo:</span>
              </div>
              <p className="font-medium text-lg capitalize">{participant.type}</p>
            </div>
          </div>

          {/* QR Code */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <QrCode className="h-5 w-5 mr-2 text-blue-600" />
                Código QR
              </h3>
              <span className="font-mono text-lg bg-gray-100 px-3 py-1 rounded">
                {participant.qrCode}
              </span>
            </div>
          </div>

          {/* Fotos */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Camera className="h-5 w-5 mr-2 text-purple-600" />
                Fotos ({participant.photos.length})
              </h3>
              <Button onClick={onAddPhotos} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Fotos
              </Button>
            </div>

            {participant.photos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {participant.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors">
                      <img
                        src={photo}
                        alt={`Foto ${index + 1} de ${participant.name}`}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Overlay com ações */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-y-2">
                          {selectedProfilePhoto === photo ? (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="bg-yellow-500 text-white hover:bg-yellow-600"
                              disabled
                            >
                              <Star className="h-4 w-4 mr-1" />
                              Foto Principal
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleSetProfilePhoto(photo)}
                            >
                              <StarOff className="h-4 w-4 mr-1" />
                              Definir como Principal
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Indicador de foto principal */}
                    {selectedProfilePhoto === photo && (
                      <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full p-1">
                        <Star className="h-3 w-3" />
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 text-center mt-1">
                      Foto {index + 1}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma foto adicionada
                </h4>
                <p className="text-gray-500 mb-4">
                  Adicione fotos para este participante
                </p>
                <Button onClick={onAddPhotos}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeira Foto
                </Button>
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="border-t pt-6">
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
              <Button variant="outline" onClick={onAddPhotos}>
                <Camera className="h-4 w-4 mr-2" />
                Adicionar Fotos
              </Button>
              <Button onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Editar Participante
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
