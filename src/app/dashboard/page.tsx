'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Camera, Plus, BarChart3, School, Settings } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar'
import { LoadingSpinner } from '@/app/components/ui/loading-spinner'
import { ThemeToggle } from '@/app/components/ui/theme-toggle'
import { useToast } from '@/app/hooks/use-toast'
import { useAuth } from '@/app/contexts/AuthContext'
import { useEvents, Event } from '@/app/contexts/EventsContext'
import ProtectedRoute from '@/app/components/auth/ProtectedRoute'
import DashboardMetrics from '@/app/components/dashboard/DashboardMetrics'
import EventCard from '@/app/components/events/EventCard'
import AdvancedSearch, { SearchFilters } from '@/app/components/dashboard/AdvancedSearch'
import AnalyticsCharts from '@/app/components/dashboard/AnalyticsCharts'

// Lazy load do EventForm
const EventForm = dynamic(() => import('@/app/components/events/EventForm'), {
  loading: () => <LoadingSpinner text="Carregando formulário..." />
})

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const { events, addEvent, updateEvent, deleteEvent, photoSales } = useEvents()
  const router = useRouter()
  const { toast } = useToast()
  const [showEventForm, setShowEventForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    search: '',
    status: 'all',
    dateRange: {},
    priceRange: {},
    school: '',
    contact: ''
  })

  // Memoização da filtragem avançada para melhor performance
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Busca por texto
      const matchesSearch = !searchFilters.search || 
        event.title.toLowerCase().includes(searchFilters.search.toLowerCase()) ||
        event.school.toLowerCase().includes(searchFilters.search.toLowerCase()) ||
        event.contact.toLowerCase().includes(searchFilters.search.toLowerCase())

      // Filtro por status
      const matchesStatus = searchFilters.status === 'all' || event.status === searchFilters.status

      // Filtro por data
      const matchesDate = (!searchFilters.dateRange.start || new Date(event.startDate) >= new Date(searchFilters.dateRange.start)) &&
                         (!searchFilters.dateRange.end || new Date(event.startDate) <= new Date(searchFilters.dateRange.end))

      // Filtro por preço
      const matchesPrice = (!searchFilters.priceRange.min || event.photoPrice >= searchFilters.priceRange.min) &&
                          (!searchFilters.priceRange.max || event.photoPrice <= searchFilters.priceRange.max)

      // Filtro por escola
      const matchesSchool = !searchFilters.school || 
        event.school.toLowerCase().includes(searchFilters.school.toLowerCase())

      // Filtro por contato
      const matchesContact = !searchFilters.contact || 
        event.contact.toLowerCase().includes(searchFilters.contact.toLowerCase())

      return matchesSearch && matchesStatus && matchesDate && matchesPrice && matchesSchool && matchesContact
    })
  }, [events, searchFilters])

  // Callbacks memoizados para evitar re-renders desnecessários
  const handleCreateEvent = useCallback(() => {
    setEditingEvent(null)
    setShowEventForm(true)
  }, [])

  const handleEditEvent = useCallback((event: Event) => {
    setEditingEvent(event)
    setShowEventForm(true)
  }, [])

  const handleViewEvent = useCallback((eventId: string) => {
    router.push(`/event/${eventId}`)
  }, [router])

  const handleEventSubmit = useCallback((eventData: any) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData)
      toast({
        title: "Evento atualizado!",
        description: "As informações do evento foram atualizadas com sucesso.",
        variant: "success",
      })
    } else {
      addEvent(eventData)
      toast({
        title: "Evento criado!",
        description: "Novo evento foi criado com sucesso.",
        variant: "success",
      })
    }
    setShowEventForm(false)
    setEditingEvent(null)
  }, [editingEvent, updateEvent, addEvent, toast])

  const handleSearchFilters = useCallback((filters: SearchFilters) => {
    setSearchFilters(filters)
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearchFilters({
      search: '',
      status: 'all',
      dateRange: {},
      priceRange: {},
      school: '',
      contact: ''
    })
  }, [])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg mr-3">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dia da Foto
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm">
                      {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-700 font-medium dark:text-gray-300">
                    Olá, {user?.name || user?.email?.split('@')[0]}
                  </span>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className={showAnalytics ? "bg-blue-50 border-blue-200" : ""}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
                
                <Button variant="outline" size="sm" onClick={() => router.push('/escolas')} className="hidden md:inline-flex">
                  <School className="h-4 w-4 mr-2" />
                  Escolas
                </Button>
                
                <Button variant="outline" size="sm" onClick={() => router.push('/configuracoes')} className="hidden lg:inline-flex">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </Button>
                
                <ThemeToggle />
                
                <Button variant="outline" size="sm" onClick={logout}>
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Bem-vindo de volta! 👋
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Gerencie seus eventos fotográficos de forma simples e eficiente
            </p>
          </div>

          {/* Analytics Section */}
          {showAnalytics ? (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  📊 Analytics e Relatórios
                </h3>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAnalytics(false)}
                >
                  Voltar aos Eventos
                </Button>
              </div>
              <AnalyticsCharts events={events} />
            </div>
          ) : (
            <>
              {/* Metrics */}
              <DashboardMetrics events={events} />

              {/* Event Management Section */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Seus Eventos</h2>
                <Button onClick={handleCreateEvent} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="h-5 w-5 mr-2" />
                  Novo Evento
                </Button>
              </div>

              {/* Advanced Search */}
              <div className="mb-6">
                <AdvancedSearch 
                  onSearch={handleSearchFilters}
                  onClear={handleClearFilters}
                />
              </div>

              {/* Event Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEvents.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-2">Nenhum evento encontrado</p>
                    <p className="text-gray-400 text-sm">
                      {searchFilters.search || searchFilters.status !== 'all' || Object.keys(searchFilters.dateRange).length > 0
                        ? 'Tente ajustar os filtros de busca.'
                        : 'Crie seu primeiro evento para começar!'
                      }
                    </p>
                  </div>
                ) : (
                  filteredEvents.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onEdit={handleEditEvent}
                      onView={handleViewEvent}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </main>

        {/* Event Form Modal */}
        {showEventForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <EventForm
              initialData={editingEvent || undefined}
              onSubmit={handleEventSubmit}
              onCancel={() => setShowEventForm(false)}
            />
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
