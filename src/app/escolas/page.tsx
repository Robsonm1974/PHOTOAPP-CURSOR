'use client'

import { useState } from 'react'
import { School, Plus, Edit, Trash2, MapPin, Phone, User, GraduationCap, Upload, Save, ArrowLeft, Image, Eye, BarChart3 } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { useAuth } from '@/app/contexts/AuthContext'
import { useEvents, School as SchoolType } from '@/app/contexts/EventsContext'
import ProtectedRoute from '@/app/components/auth/ProtectedRoute'
import { useRouter } from 'next/navigation'

export default function EscolasPage() {
  const { user, logout } = useAuth()
  const { schools, addSchool, updateSchool, deleteSchool } = useEvents()
  const router = useRouter()
  
  const [showSchoolForm, setShowSchoolForm] = useState(false)
  const [editingSchool, setEditingSchool] = useState<SchoolType | null>(null)
  const [schoolForm, setSchoolForm] = useState({
    name: '',
    city: '',
    state: '',
    phone: '',
    director: '',
    type: 'publica' as 'publica' | 'privada',
    studentCount: 0,
    directorMessage: '',
    observations: '',
    directorPhoto: '',
    schoolImage: ''
  })

  const estadosBrasil = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ]

  const handleAddSchool = () => {
    setEditingSchool(null)
    setSchoolForm({
      name: '',
      city: '',
      state: '',
      phone: '',
      director: '',
      type: 'publica',
      studentCount: 0,
      directorMessage: '',
      observations: '',
      directorPhoto: '',
      schoolImage: ''
    })
    setShowSchoolForm(true)
  }

  const handleEditSchool = (school: SchoolType) => {
    setEditingSchool(school)
    setSchoolForm({
      name: school.name,
      city: school.city,
      state: school.state,
      phone: school.phone,
      director: school.director,
      type: school.type,
      studentCount: school.studentCount,
      directorMessage: school.directorMessage || '',
      observations: school.observations || '',
      directorPhoto: school.directorPhoto || '',
      schoolImage: school.schoolImage || ''
    })
    setShowSchoolForm(true)
  }

  const handleSchoolSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingSchool) {
      updateSchool(editingSchool.id, schoolForm)
    } else {
      addSchool(schoolForm)
    }
    
    setShowSchoolForm(false)
    setEditingSchool(null)
    setSchoolForm({
      name: '',
      city: '',
      state: '',
      phone: '',
      director: '',
      type: 'publica',
      studentCount: 0,
      directorMessage: '',
      observations: '',
      directorPhoto: '',
      schoolImage: ''
    })
  }

  const handleDeleteSchool = (schoolId: string) => {
    if (confirm('Tem certeza que deseja excluir esta escola?')) {
      deleteSchool(schoolId)
    }
  }

  const formatPhone = (phone: string) => {
    // Formata telefone no padrão (XX) XXXXX-XXXX
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0,2)}) ${cleaned.slice(2,7)}-${cleaned.slice(7)}`
    }
    return phone
  }

  const handleImageUpload = (field: 'directorPhoto' | 'schoolImage', file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setSchoolForm(prev => ({
        ...prev,
        [field]: e.target?.result as string
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleViewProfile = (schoolId: string) => {
    router.push(`/escola/${schoolId}`)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Button variant="ghost" onClick={() => router.push('/dashboard')}>
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Voltar
                </Button>
                <School className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Escolas</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Olá, {user?.name || user?.email}</span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Gerenciar Escolas</h2>
              <p className="text-gray-600">Configure as escolas para seus eventos fotográficos</p>
            </div>
            <Button onClick={handleAddSchool}>
              <Plus className="h-5 w-5 mr-2" />
              Nova Escola
            </Button>
          </div>

          {/* Schools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school) => (
              <Card key={school.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{school.name}</CardTitle>
                      <CardDescription className="flex items-center mt-2">
                        <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                        {school.city}, {school.state}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditSchool(school)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSchool(school.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{formatPhone(school.phone)}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{school.director}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{school.studentCount} alunos</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      school.type === 'publica' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {school.type === 'publica' ? 'Pública' : 'Privada'}
                    </span>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewProfile(school.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Perfil
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/escola/${school.id}/dashboard`)}
                      >
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Dashboard
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {schools.length === 0 && (
              <div className="col-span-full text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma escola cadastrada
                </h4>
                <p className="text-gray-500 mb-4">
                  Comece cadastrando sua primeira escola
                </p>
                <Button onClick={handleAddSchool}>
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Primeira Escola
                </Button>
              </div>
            )}
          </div>
        </main>

        {/* School Form Modal */}
        {showSchoolForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>
                  {editingSchool ? 'Editar Escola' : 'Nova Escola'}
                </CardTitle>
                <CardDescription>
                  {editingSchool ? 'Edite as informações da escola' : 'Preencha os dados da nova escola'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSchoolSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome da Escola *
                    </label>
                    <Input
                      value={schoolForm.name}
                      onChange={(e) => setSchoolForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome da instituição"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cidade *
                      </label>
                      <Input
                        value={schoolForm.city}
                        onChange={(e) => setSchoolForm(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="Nome da cidade"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado *
                      </label>
                      <select
                        value={schoolForm.state}
                        onChange={(e) => setSchoolForm(prev => ({ ...prev, state: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Selecione o estado</option>
                        {estadosBrasil.map(estado => (
                          <option key={estado} value={estado}>{estado}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone *
                      </label>
                      <Input
                        value={schoolForm.phone}
                        onChange={(e) => setSchoolForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="(41) 99999-9999"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo *
                      </label>
                      <select
                        value={schoolForm.type}
                        onChange={(e) => setSchoolForm(prev => ({ ...prev, type: e.target.value as 'publica' | 'privada' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="publica">Pública</option>
                        <option value="privada">Privada</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Diretor(a) *
                      </label>
                      <Input
                        value={schoolForm.director}
                        onChange={(e) => setSchoolForm(prev => ({ ...prev, director: e.target.value }))}
                        placeholder="Nome do diretor"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Alunos *
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={schoolForm.studentCount}
                        onChange={(e) => setSchoolForm(prev => ({ ...prev, studentCount: parseInt(e.target.value) || 0 }))}
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>

                  {/* Image Upload Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Foto do Diretor(a)
                      </label>
                      <div className="space-y-2">
                        {schoolForm.directorPhoto && (
                          <div className="relative">
                            <img 
                              src={schoolForm.directorPhoto} 
                              alt="Foto do diretor" 
                              className="w-24 h-24 object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 p-0"
                              onClick={() => setSchoolForm(prev => ({ ...prev, directorPhoto: '' }))}
                            >
                              ×
                            </Button>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleImageUpload('directorPhoto', file)
                            }}
                            className="flex-1"
                          />
                          <Image className="h-4 w-4 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500">
                          Recomendado: 300x300px, formato JPG/PNG
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Imagem da Escola
                      </label>
                      <div className="space-y-2">
                        {schoolForm.schoolImage && (
                          <div className="relative">
                            <img 
                              src={schoolForm.schoolImage} 
                              alt="Imagem da escola" 
                              className="w-24 h-24 object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 p-0"
                              onClick={() => setSchoolForm(prev => ({ ...prev, schoolImage: '' }))}
                            >
                              ×
                            </Button>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleImageUpload('schoolImage', file)
                            }}
                            className="flex-1"
                          />
                          <Image className="h-4 w-4 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500">
                          Recomendado: 800x400px, formato JPG/PNG
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mensagem do Diretor
                    </label>
                    <textarea
                      value={schoolForm.directorMessage}
                      onChange={(e) => setSchoolForm(prev => ({ ...prev, directorMessage: e.target.value }))}
                      placeholder="Mensagem de boas-vindas ou apresentação da escola"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observações
                    </label>
                    <textarea
                      value={schoolForm.observations}
                      onChange={(e) => setSchoolForm(prev => ({ ...prev, observations: e.target.value }))}
                      placeholder="Informações adicionais sobre a escola"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowSchoolForm(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingSchool ? 'Atualizar' : 'Cadastrar'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
