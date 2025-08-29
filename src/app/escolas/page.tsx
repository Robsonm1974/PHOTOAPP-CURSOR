'use client'

import { useState } from 'react'
import { School, Plus, Edit, Trash2, MapPin, Phone, User, GraduationCap, Save, ArrowLeft, Image, Eye, BarChart3, Building2, Users, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ImageUpload } from '@/app/components/ui/image-upload'
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
    address: '',
    city: '',
    state: '',
    cnpj: '',
    pixKey: '',
    phone: '',
    type: 'publica' as 'publica' | 'privada',
    education: [] as ('infantil' | 'fundamental' | 'medio')[],
    studentCount: 0,
    observations: '',
    instagram: '',
    facebook: '',
    whatsapp: '',
    director: '',
    directorMessage: '',
    directorPhoto: '',
    schoolImage: '',
    featuredImages: [] as string[]
  })

  const estadosBrasil = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ]

  const handleAddSchool = () => {
    setEditingSchool(null)
    setSchoolForm({
      name: '',
      address: '',
      city: '',
      state: '',
      cnpj: '',
      pixKey: '',
      phone: '',
      type: 'publica',
      education: ['fundamental'],
      studentCount: 0,
      observations: '',
      instagram: '',
      facebook: '',
      whatsapp: '',
      director: '',
      directorMessage: '',
      directorPhoto: '',
      schoolImage: '',
      featuredImages: []
    })
    setShowSchoolForm(true)
  }

  const handleEditSchool = (school: SchoolType) => {
    setEditingSchool(school)
    setSchoolForm({
      name: school.name,
      address: school.address || '',
      city: school.city,
      state: school.state,
      cnpj: school.cnpj || '',
      pixKey: school.pixKey || '',
      phone: school.phone,
      type: school.type,
      education: school.education || ['fundamental'],
      studentCount: school.studentCount,
      observations: school.observations || '',
      instagram: school.instagram || '',
      facebook: school.facebook || '',
      whatsapp: school.whatsapp || '',
      director: school.director,
      directorMessage: school.directorMessage || '',
      directorPhoto: school.directorPhoto || '',
      schoolImage: school.schoolImage || '',
      featuredImages: school.featuredImages || []
    })
    setShowSchoolForm(true)
  }

  const handleSchoolSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingSchool) {
      updateSchool(editingSchool.id, schoolForm)
    } else {
      addSchool({
        ...schoolForm
      })
    }
    
    setShowSchoolForm(false)
    setEditingSchool(null)
  }

  const handleDeleteSchool = (schoolId: string) => {
    if (confirm('Tem certeza que deseja excluir esta escola?')) {
      deleteSchool(schoolId)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.back()}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <div className="flex items-center space-x-3">
                  <Building2 className="h-8 w-8 text-blue-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Escolas</h1>
                    <p className="text-sm text-gray-600">Gerencie as escolas parceiras</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name || user?.email}</p>
                  <p className="text-xs text-gray-500">Fotógrafo</p>
                </div>
                <Button variant="outline" size="sm" onClick={logout}>
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total de Escolas</p>
                    <p className="text-3xl font-bold">{schools.length}</p>
                  </div>
                  <Building2 className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Escolas Públicas</p>
                    <p className="text-3xl font-bold">{schools.filter(s => s.type === 'publica').length}</p>
                  </div>
                  <School className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Escolas Privadas</p>
                    <p className="text-3xl font-bold">{schools.filter(s => s.type === 'privada').length}</p>
                  </div>
                  <GraduationCap className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Total de Alunos</p>
                    <p className="text-3xl font-bold">{schools.reduce((acc, s) => acc + s.studentCount, 0)}</p>
                  </div>
                  <Users className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Lista de Escolas</h2>
              <p className="text-sm text-gray-600">Visualize e gerencie todas as escolas cadastradas</p>
            </div>
            <Button onClick={handleAddSchool} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Escola
            </Button>
          </div>

          {/* Schools List */}
          {schools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schools.map((school) => (
                <Card key={school.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-gray-900">{school.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant={school.type === 'publica' ? 'default' : 'secondary'}>
                            {school.type === 'publica' ? 'Pública' : 'Privada'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {school.studentCount} alunos
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/escola/${school.id}/dashboard`)}
                          className="h-8 w-8 p-0 text-gray-600 hover:text-blue-600"
                          title="Dashboard da Escola"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/escola/${school.id}`)}
                          className="h-8 w-8 p-0 text-gray-600 hover:text-green-600"
                          title="Página Pública da Escola"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSchool(school)}
                          className="h-8 w-8 p-0 text-gray-600 hover:text-blue-600"
                          title="Editar Escola"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSchool(school.id)}
                          className="h-8 w-8 p-0 text-gray-600 hover:text-red-600"
                          title="Excluir Escola"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {school.address && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{school.address}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{school.city}, {school.state}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{school.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span>{school.director}</span>
                      </div>
                      {school.education && school.education.length > 0 && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <GraduationCap className="h-4 w-4" />
                          <div className="flex flex-wrap gap-1">
                            {school.education.map((level) => (
                              <Badge key={level} variant="outline" className="text-xs">
                                {level === 'infantil' ? 'EI' : 
                                 level === 'fundamental' ? 'EF' : 'EM'}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma escola cadastrada</h3>
                <p className="text-gray-600 mb-6">
                  Comece cadastrando sua primeira escola para organizar seus eventos fotográficos.
                </p>
                <Button onClick={handleAddSchool}>
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Primeira Escola
                </Button>
              </CardContent>
            </Card>
          )}
        </main>

        {/* School Form Modal */}
        {showSchoolForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="border-b bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      {editingSchool ? 'Editar Escola' : 'Nova Escola'}
                    </CardTitle>
                    <CardDescription>
                      {editingSchool ? 'Edite as informações da escola' : 'Preencha os dados da nova escola'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSchoolSubmit} className="space-y-6">
                  {/* Informações Básicas */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                      Informações Básicas
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome da Escola *
                        </label>
                        <Input
                          value={schoolForm.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Nome da instituição"
                          required
                          className="h-11"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Endereço Completo
                        </label>
                        <Input
                          value={schoolForm.address}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolForm(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="Rua, número, bairro"
                          className="h-11"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cidade *
                          </label>
                          <Input
                            value={schoolForm.city}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolForm(prev => ({ ...prev, city: e.target.value }))}
                            placeholder="Nome da cidade"
                            required
                            className="h-11"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estado *
                          </label>
                          <Select value={schoolForm.state} onValueChange={(value: string) => setSchoolForm(prev => ({ ...prev, state: value }))}>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Selecione o estado" />
                            </SelectTrigger>
                            <SelectContent>
                              {estadosBrasil.map(estado => (
                                <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo *
                          </label>
                          <Select value={schoolForm.type} onValueChange={(value: string) => setSchoolForm(prev => ({ ...prev, type: value as 'publica' | 'privada' }))}>
                            <SelectTrigger className="h-11">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="publica">Pública</SelectItem>
                              <SelectItem value="privada">Privada</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CNPJ
                          </label>
                          <Input
                            value={schoolForm.cnpj}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolForm(prev => ({ ...prev, cnpj: e.target.value }))}
                            placeholder="00.000.000/0000-00"
                            className="h-11"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chave PIX
                          </label>
                          <Input
                            value={schoolForm.pixKey}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolForm(prev => ({ ...prev, pixKey: e.target.value }))}
                            placeholder="email@escola.com ou telefone"
                            className="h-11"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Telefone *
                          </label>
                          <Input
                            value={schoolForm.phone}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolForm(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="(41) 99999-9999"
                            required
                            className="h-11"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Número de Alunos *
                          </label>
                          <Input
                            type="number"
                            min="0"
                            value={schoolForm.studentCount}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolForm(prev => ({ ...prev, studentCount: parseInt(e.target.value) || 0 }))}
                            placeholder="0"
                            required
                            className="h-11"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Níveis de Ensino *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {(['infantil', 'fundamental', 'medio'] as const).map((level) => (
                            <label key={level} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={schoolForm.education.includes(level)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSchoolForm(prev => ({
                                      ...prev,
                                      education: [...prev.education, level]
                                    }))
                                  } else {
                                    setSchoolForm(prev => ({
                                      ...prev,
                                      education: prev.education.filter(l => l !== level)
                                    }))
                                  }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">
                                {level === 'infantil' ? 'Educação Infantil' : 
                                 level === 'fundamental' ? 'Ensino Fundamental' : 
                                 'Ensino Médio'}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Diretor(a) *
                        </label>
                        <Input
                          value={schoolForm.director}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolForm(prev => ({ ...prev, director: e.target.value }))}
                          placeholder="Nome do diretor"
                          required
                          className="h-11"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Redes Sociais */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-purple-600" />
                      Redes Sociais e Contato
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Instagram
                        </label>
                        <Input
                          value={schoolForm.instagram}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolForm(prev => ({ ...prev, instagram: e.target.value }))}
                          placeholder="@escola_insta"
                          className="h-11"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Facebook
                        </label>
                        <Input
                          value={schoolForm.facebook}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolForm(prev => ({ ...prev, facebook: e.target.value }))}
                          placeholder="Nome da página"
                          className="h-11"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          WhatsApp
                        </label>
                        <Input
                          value={schoolForm.whatsapp}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                          placeholder="(41) 99999-9999"
                          className="h-11"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Upload de Imagens */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Image className="h-5 w-5 mr-2 text-green-600" />
                      Imagens da Escola
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Foto do Diretor(a)
                        </label>
                        <ImageUpload
                          value={schoolForm.directorPhoto}
                          onChange={(value: string) => setSchoolForm(prev => ({ ...prev, directorPhoto: value }))}
                          onRemove={() => setSchoolForm(prev => ({ ...prev, directorPhoto: '' }))}
                          placeholder="Clique para fazer upload da foto do diretor"
                          recommendedSize="300x300px"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Imagem da Escola
                        </label>
                        <ImageUpload
                          value={schoolForm.schoolImage}
                          onChange={(value: string) => setSchoolForm(prev => ({ ...prev, schoolImage: value }))}
                          onRemove={() => setSchoolForm(prev => ({ ...prev, schoolImage: '' }))}
                          placeholder="Clique para fazer upload da imagem da escola"
                          recommendedSize="800x400px"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Informações Adicionais */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-purple-600" />
                      Informações Adicionais
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mensagem do Diretor
                        </label>
                        <Textarea
                          value={schoolForm.directorMessage}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSchoolForm(prev => ({ ...prev, directorMessage: e.target.value }))}
                          placeholder="Mensagem de boas-vindas ou apresentação da escola"
                          rows={3}
                          className="resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Observações
                        </label>
                        <Textarea
                          value={schoolForm.observations}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSchoolForm(prev => ({ ...prev, observations: e.target.value }))}
                          placeholder="Informações adicionais sobre a escola"
                          rows={3}
                          className="resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 justify-end pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowSchoolForm(false)}
                      className="px-6"
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="px-6 bg-blue-600 hover:bg-blue-700">
                      <Save className="h-4 w-4 mr-2" />
                      {editingSchool ? 'Atualizar Escola' : 'Cadastrar Escola'}
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
