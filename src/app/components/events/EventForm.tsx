'use client'

import { useState, useEffect } from 'react'
import { Calendar, MapPin, Phone, User, DollarSign, FileText, X, School } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { useEvents, School as SchoolType } from '@/app/contexts/EventsContext'

interface EventFormData {
  title: string
  startDate: string
  endDate?: string
  schoolId: string
  school: string
  contact: string
  phone: string
  commission: number
  photoPrice: number
  notes?: string
}

interface EventFormProps {
  initialData?: Partial<EventFormData>
  onSubmit: (data: EventFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function EventForm({ initialData, onSubmit, onCancel, isLoading = false }: EventFormProps) {
  const { schools, addSchool } = useEvents()
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    startDate: '',
    endDate: '',
    schoolId: '',
    school: '',
    contact: '',
    phone: '',
    commission: 0,
    photoPrice: 0,
    notes: ''
  })
  const [showNewSchoolForm, setShowNewSchoolForm] = useState(false)
  const [newSchoolData, setNewSchoolData] = useState({
    name: '',
    city: '',
    state: '',
    phone: '',
    director: '',
    type: 'publica' as 'publica' | 'privada',
    studentCount: 0
  })

  const estadosBrasil = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ]

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        schoolId: initialData.schoolId || '',
        school: initialData.school || '',
        contact: initialData.contact || '',
        phone: initialData.phone || '',
        commission: initialData.commission || 0,
        photoPrice: initialData.photoPrice || 0,
        notes: initialData.notes || ''
      })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: name === 'commission' || name === 'photoPrice' ? parseFloat(value) || 0 : value
    }))
  }

  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const schoolId = e.target.value
    const selectedSchool = schools.find(s => s.id === schoolId)
    
    setFormData(prev => ({
      ...prev,
      schoolId,
      school: selectedSchool?.name || '',
      contact: selectedSchool?.director || '',
      phone: selectedSchool?.phone || ''
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      endDate: formData.endDate || undefined,
      notes: formData.notes || undefined
    })
  }

  const handleNewSchoolSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Adicionar a nova escola
    const newSchool = {
      name: newSchoolData.name,
      address: '',
      city: newSchoolData.city,
      state: newSchoolData.state,
      cnpj: '',
      pixKey: '',
      phone: newSchoolData.phone,
      type: newSchoolData.type,
      education: ['fundamental'] as ('infantil' | 'fundamental' | 'medio')[],
      studentCount: newSchoolData.studentCount,
      observations: '',
      instagram: '',
      facebook: '',
      whatsapp: '',
      director: newSchoolData.director,
      directorMessage: '',
      directorPhoto: '',
      schoolImage: '',
      featuredImages: []
    }
    
    addSchool(newSchool)
    
    // Fechar o modal e limpar o formulário
    setShowNewSchoolForm(false)
    setNewSchoolData({
      name: '',
      city: '',
      state: '',
      phone: '',
      director: '',
      type: 'publica',
      studentCount: 0
    })
    
    // Atualizar o formulário principal com a nova escola
    const addedSchool = schools.find(s => s.name === newSchoolData.name)
    if (addedSchool) {
      setFormData(prev => ({
        ...prev,
        schoolId: addedSchool.id,
        school: addedSchool.name,
        contact: addedSchool.director,
        phone: addedSchool.phone
      }))
    }
  }

  return (
    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {initialData ? 'Editar Evento' : 'Novo Evento'}
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
        <CardDescription>
          {initialData ? 'Atualize as informações do evento.' : 'Preencha os detalhes para criar um novo evento fotográfico.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título do Evento *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Dia da Foto - Escola ABC"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Data de Início *
              </label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                Data de Término (Opcional)
              </label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* School Selection */}
          <div>
            <label htmlFor="schoolId" className="block text-sm font-medium text-gray-700 mb-1">
              Escola *
            </label>
            <div className="space-y-2">
              <select
                id="schoolId"
                name="schoolId"
                value={formData.schoolId}
                onChange={handleSchoolChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione uma escola</option>
                {schools.map(school => (
                  <option key={school.id} value={school.id}>
                    {school.name} - {school.city}/{school.state}
                  </option>
                ))}
              </select>
              
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewSchoolForm(true)}
                >
                  <School className="h-4 w-4 mr-2" />
                  Adicionar Nova Escola
                </Button>
                
                {formData.schoolId && (
                  <span className="text-sm text-gray-600">
                    Escola selecionada: {formData.school}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                Contato na Escola *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Nome do responsável"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefone do Contato *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(XX) XXXXX-XXXX"
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="commission" className="block text-sm font-medium text-gray-700 mb-1">
                Comissão por Participante (%)
              </label>
              <Input
                id="commission"
                name="commission"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.commission}
                onChange={handleChange}
                placeholder="15.00"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Percentual sobre o valor das fotos vendidas
              </p>
            </div>

            <div>
              <label htmlFor="photoPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Preço por Foto (R$)
              </label>
              <Input
                id="photoPrice"
                name="photoPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.photoPrice}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Observações (Opcional)
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Informações adicionais sobre o evento..."
                rows={3}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : initialData ? 'Atualizar Evento' : 'Criar Evento'}
            </Button>
          </div>
        </form>
      </CardContent>

      {/* New School Form Modal */}
      {showNewSchoolForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Nova Escola</CardTitle>
              <CardDescription>
                Adicione uma nova escola para usar no evento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNewSchoolSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Escola *
                  </label>
                  <Input
                    value={newSchoolData.name}
                    onChange={(e) => setNewSchoolData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome da instituição"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade *
                    </label>
                    <Input
                      value={newSchoolData.city}
                      onChange={(e) => setNewSchoolData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Nome da cidade"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado *
                    </label>
                    <select
                      value={newSchoolData.state}
                      onChange={(e) => setNewSchoolData(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Estado</option>
                      {estadosBrasil.map(estado => (
                        <option key={estado} value={estado}>{estado}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone *
                    </label>
                    <Input
                      value={newSchoolData.phone}
                      onChange={(e) => setNewSchoolData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(XX) XXXXX-XXXX"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo *
                    </label>
                    <select
                      value={newSchoolData.type}
                      onChange={(e) => setNewSchoolData(prev => ({ ...prev, type: e.target.value as 'publica' | 'privada' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="publica">Pública</option>
                      <option value="privada">Privada</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Diretor(a) *
                    </label>
                    <Input
                      value={newSchoolData.director}
                      onChange={(e) => setNewSchoolData(prev => ({ ...prev, director: e.target.value }))}
                      placeholder="Nome do diretor"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nº de Alunos *
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={newSchoolData.studentCount}
                      onChange={(e) => setNewSchoolData(prev => ({ ...prev, studentCount: parseInt(e.target.value) || 0 }))}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewSchoolForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Adicionar Escola
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  )
}

