import React, { useMemo } from 'react'
import { Calendar, Users, TrendingUp, Eye } from 'lucide-react'
import { Event } from '@/app/contexts/EventsContext'
import MetricsCard from './MetricsCard'

interface DashboardMetricsProps {
  events: Event[]
}

const DashboardMetrics = React.memo(({ events }: DashboardMetricsProps) => {
  const metrics = useMemo(() => {
    const totalParticipants = events.reduce((acc, event) => acc + event.participantsCount, 0)
    const estimatedRevenue = events.reduce((acc, event) => acc + (event.participantsCount * event.photoPrice * 0.3), 0)
    const activeEvents = events.filter(e => e.status === 'active').length

    return {
      totalEvents: events.length,
      totalParticipants,
      estimatedRevenue: `R$ ${estimatedRevenue.toFixed(0)}`,
      activeEvents
    }
  }, [events])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricsCard
        title="Total de Eventos"
        value={metrics.totalEvents}
        icon={Calendar}
        gradient="bg-gradient-to-br from-blue-50 to-blue-100"
        iconColor="bg-blue-500"
      />
      
      <MetricsCard
        title="Participantes"
        value={metrics.totalParticipants}
        icon={Users}
        gradient="bg-gradient-to-br from-green-50 to-emerald-100"
        iconColor="bg-green-500"
      />
      
      <MetricsCard
        title="Receita Estimada"
        value={metrics.estimatedRevenue}
        icon={TrendingUp}
        gradient="bg-gradient-to-br from-purple-50 to-purple-100"
        iconColor="bg-purple-500"
      />
      
      <MetricsCard
        title="Eventos Ativos"
        value={metrics.activeEvents}
        icon={Eye}
        gradient="bg-gradient-to-br from-orange-50 to-orange-100"
        iconColor="bg-orange-500"
      />
    </div>
  )
})

DashboardMetrics.displayName = 'DashboardMetrics'

export default DashboardMetrics
