'use client'

import { useState, useEffect } from 'react'
import { X, User, GraduationCap, Tag, Camera, Star, StarOff } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Participant, useEvents } from '@/app/contexts/EventsContext'

interface ParticipantFormData {
  name: string
  class: string
  type: string
  profilePhoto?: string
}

interface ParticipantFormProps {
  eventId: string
  initialData?: Partial<ParticipantFormData> & { photos?: string[] }
  onSubmit: (data: ParticipantFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function ParticipantForm({
  eventId,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false
}: ParticipantFormProps) {
  const { updateParticipantProfilePhoto } = useEvents()
  const [formData, setFormData] = useState<ParticipantFormData>({
    name: '',
    class: '',
    type: 'aluno',
    profilePhoto: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        class: initialData.class || '',
        type: initialData.type || 'aluno',
        profilePhoto: initialData.profilePhoto || ''
      })
      // Se initialData tem fotos, define a primeira como profilePhoto se nenhuma estiver definida
      if (initialData.photos && initialData.photos.length > 0 && !initialData.profilePhoto) {
        setFormData(prev => ({ ...prev, profilePhoto: initialData.photos![0] }))
      }
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim() || !formData.class.trim()) {
      setError('Nome e turma são obrigatórios')
      return
    }

    // Se estamos editando e há mudança na foto de perfil, atualizamos no contexto
    if (initialData?.photos && formData.profilePhoto && 
        formData.profilePhoto !== initialData.profilePhoto) {
      // Aqui você poderia chamar updateParticipantProfilePhoto se tivesse o ID do participante
      // Por enquanto, vamos apenas submeter o formulário
    }

    onSubmit(formData)
  }

  const handleSetProfilePhoto = (photoUrl: string) => {
    setFormData(prev => ({ ...prev, profilePhoto: photoUrl }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                {initialData ? 'Editar Participante' : 'Novo Participante'}
              </CardTitle>
              <CardDescription>
                {initialData ? 'Edite as informações do participante' : 'Adicione um novo participante ao evento'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome completo"
                  required
                />
              </div>
              <div>
                <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
                  Turma *
                </label>
                <Input
                  id="class"
                  name="class"
                  value={formData.class}
                  onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value }))}
                  placeholder="Ex: 3º Ano A"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="aluno">Aluno</option>
                <option value="professor">Professor</option>
                <option value="funcionario">Funcionário</option>
                <option value="convidado">Convidado</option>
              </select>
            </div>

            {/* Photos and Profile Photo Selection */}
            {initialData?.photos && initialData.photos.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold flex items-center mb-4">
                  <Camera className="h-5 w-5 mr-2 text-purple-600" />
                  Fotos do Participante ({initialData.photos.length})
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Clique na estrela para definir a foto preferida como foto de perfil.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {initialData.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors">
                        <img
                          src={photo}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Overlay com estrela */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {formData.profilePhoto === photo ? (
                              <Button
                                size="sm"
                                variant="secondary"
                                className="bg-yellow-500 text-white hover:bg-yellow-600"
                                disabled
                              >
                                <Star className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleSetProfilePhoto(photo)}
                              >
                                <StarOff className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Indicador de foto principal */}
                      {formData.profilePhoto === photo && (
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
                
                {formData.profilePhoto && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✅ Foto de perfil selecionada: {initialData.photos.indexOf(formData.profilePhoto) + 1}
                    </p>
                  </div>
                )}
              </div>
            )}

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : (initialData ? 'Atualizar' : 'Adicionar')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
