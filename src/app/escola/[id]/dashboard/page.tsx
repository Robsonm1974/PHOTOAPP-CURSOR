'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { School, MapPin, Phone, User, GraduationCap, Users, Calendar, Camera, BarChart3, TrendingUp, Eye, Edit, Plus, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useEvents, School as SchoolType, Event } from '@/app/contexts/EventsContext'
import ProtectedRoute from '@/app/components/auth/ProtectedRoute'
import { useAuth } from '@/app/contexts/AuthContext'

export default function EscolaDashboardPage() {
  const params = useParams()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { schools, events } = useEvents()
  const [school, setSchool] = useState<SchoolType | null>(null)
  const [schoolEvents, setSchoolEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id && schools.length > 0) {
      const foundSchool = schools.find(s => s.id === params.id)
      if (foundSchool) {
        setSchool(foundSchool)
        // Filtrar eventos desta escola
        const schoolEvents = events.filter(e => e.schoolId === params.id)
        setSchoolEvents(schoolEvents)
      }
      setLoading(false)
    }
  }, [params.id, schools, events])

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dashboard da escola...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!school) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <School className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Escola não encontrada</h1>
            <p className="text-gray-600">A escola solicitada não foi encontrada ou não existe.</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  // Calcular estatísticas
  const totalEvents = schoolEvents.length
  const activeEvents = schoolEvents.filter(e => e.status === 'active').length
  const completedEvents = schoolEvents.filter(e => e.status === 'completed').length
  const totalParticipants = schoolEvents.reduce((acc, event) => acc + event.participantsCount, 0)

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
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <School className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Dashboard - {school.name}</h1>
                    <p className="text-sm text-gray-600">Visão geral e estatísticas da escola</p>
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
                    <p className="text-blue-100 text-sm font-medium">Total de Eventos</p>
                    <p className="text-3xl font-bold">{totalEvents}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Eventos Ativos</p>
                    <p className="text-3xl font-bold">{activeEvents}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Eventos Concluídos</p>
                    <p className="text-3xl font-bold">{completedEvents}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Total de Participantes</p>
                    <p className="text-3xl font-bold">{totalParticipants}</p>
                  </div>
                  <Users className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informações da Escola */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <School className="h-5 w-5 mr-2 text-blue-600" />
                    Informações da Escola
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Localização</p>
                        <p className="font-medium">{school.city}, {school.state}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Telefone</p>
                        <p className="font-medium">{school.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Diretor(a)</p>
                        <p className="font-medium">{school.director}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Tipo</p>
                        <Badge variant={school.type === 'publica' ? 'default' : 'secondary'}>
                          {school.type === 'publica' ? 'Pública' : 'Privada'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {school.education && school.education.length > 0 && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-500 mb-2">Níveis de Ensino</p>
                      <div className="flex flex-wrap gap-2">
                        {school.education.map((level) => (
                          <Badge key={level} variant="outline">
                            {level === 'infantil' ? 'Educação Infantil' : 
                             level === 'fundamental' ? 'Ensino Fundamental' : 
                             'Ensino Médio'}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Ações Rápidas */}
              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full" 
                    onClick={() => router.push(`/event/new?schoolId=${school.id}`)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Evento
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push(`/escola/${school.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Página Pública
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push(`/escolas`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Escola
                  </Button>
                </CardContent>
              </Card>

              {/* Estatísticas da Escola */}
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total de Alunos</span>
                    <span className="font-semibold text-blue-600">{school.studentCount}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tipo</span>
                    <Badge variant={school.type === 'publica' ? 'default' : 'secondary'}>
                      {school.type === 'publica' ? 'Pública' : 'Privada'}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Estado</span>
                    <span className="font-semibold text-gray-900">{school.state}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Lista de Eventos */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Eventos da Escola</CardTitle>
                  <CardDescription>Histórico de eventos fotográficos realizados</CardDescription>
                </div>
                <Button onClick={() => router.push(`/event/new?schoolId=${school.id}`)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Evento
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {schoolEvents.length > 0 ? (
                <div className="space-y-4">
                  {schoolEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Camera className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{event.title}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(event.startDate).toLocaleDateString('pt-BR')} • {event.participantsCount} participantes
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          event.status === 'active' ? 'default' : 
                          event.status === 'upcoming' ? 'secondary' : 'outline'
                        }>
                          {event.status === 'active' ? 'Ativo' : 
                           event.status === 'upcoming' ? 'Agendado' : 'Concluído'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/event/${event.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento encontrado</h3>
                  <p className="text-gray-600 mb-4">
                    Esta escola ainda não possui eventos fotográficos cadastrados.
                  </p>
                  <Button onClick={() => router.push(`/event/new?schoolId=${school.id}`)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Evento
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}
