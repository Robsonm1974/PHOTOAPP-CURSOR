'use client'

import React from 'react'
import { TrendingUp, Calendar, Users, DollarSign, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Event } from '@/app/contexts/EventsContext'

interface AnalyticsChartsProps {
  events: Event[]
}

const AnalyticsCharts = React.memo(({ events }: AnalyticsChartsProps) => {
  // Dados processados para os gráficos
  const analyticsData = React.useMemo(() => {
    const monthlyData = events.reduce((acc, event) => {
      const month = new Date(event.startDate).toLocaleDateString('pt-BR', { 
        year: 'numeric', 
        month: 'short' 
      })
      
      if (!acc[month]) {
        acc[month] = {
          events: 0,
          participants: 0,
          revenue: 0
        }
      }
      
      acc[month].events += 1
      acc[month].participants += event.participantsCount
      acc[month].revenue += event.participantsCount * event.photoPrice * (event.commission / 100)
      
      return acc
    }, {} as Record<string, { events: number, participants: number, revenue: number }>)

    const statusData = events.reduce((acc, event) => {
      acc[event.status] = (acc[event.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const schoolData = events.reduce((acc, event) => {
      acc[event.school] = (acc[event.school] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      monthly: Object.entries(monthlyData).map(([month, data]) => ({
        month,
        ...data
      })),
      status: Object.entries(statusData).map(([status, count]) => ({
        status,
        count,
        percentage: ((count / events.length) * 100).toFixed(1)
      })),
      schools: Object.entries(schoolData)
        .map(([school, count]) => ({ school, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    }
  }, [events])

  const totalRevenue = events.reduce((acc, event) => 
    acc + (event.participantsCount * event.photoPrice * (event.commission / 100)), 0
  )

  const averageEventSize = events.length > 0 
    ? events.reduce((acc, event) => acc + event.participantsCount, 0) / events.length
    : 0

  return (
    <div className="space-y-6">
      {/* KPIs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Receita Total</p>
                <p className="text-2xl font-bold text-blue-900">
                  R$ {totalRevenue.toFixed(2)}
                </p>
                <p className="text-xs text-blue-700">
                  +12% vs mês anterior
                </p>
              </div>
              <div className="p-2 bg-blue-500 rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Média por Evento</p>
                <p className="text-2xl font-bold text-green-900">
                  {averageEventSize.toFixed(0)} pessoas
                </p>
                <p className="text-xs text-green-700">
                  +5% vs mês anterior
                </p>
              </div>
              <div className="p-2 bg-green-500 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-purple-900">
                  {((analyticsData.status.find(s => s.status === 'completed')?.count || 0) / events.length * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-purple-700">
                  +3% vs mês anterior
                </p>
              </div>
              <div className="p-2 bg-purple-500 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Eventos por Mês</p>
                <p className="text-2xl font-bold text-orange-900">
                  {(events.length / Math.max(1, analyticsData.monthly.length)).toFixed(1)}
                </p>
                <p className="text-xs text-orange-700">
                  +8% vs mês anterior
                </p>
              </div>
              <div className="p-2 bg-orange-500 rounded-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Status dos Eventos
            </CardTitle>
            <CardDescription>
              Distribuição atual dos eventos por status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.status.map((item, index) => {
                const colors = {
                  active: 'bg-green-500',
                  upcoming: 'bg-blue-500',
                  completed: 'bg-gray-500'
                }
                
                return (
                  <div key={item.status} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${colors[item.status as keyof typeof colors] || 'bg-gray-400'}`} />
                      <span className="text-sm font-medium capitalize">
                        {item.status === 'active' ? 'Ativo' : 
                         item.status === 'upcoming' ? 'Próximo' : 'Concluído'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{item.count}</span>
                      <span className="text-xs text-gray-500">({item.percentage}%)</span>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Barra de progresso visual */}
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full flex">
                {analyticsData.status.map((item, index) => {
                  const colors = {
                    active: 'bg-green-500',
                    upcoming: 'bg-blue-500',
                    completed: 'bg-gray-500'
                  }
                  
                  return (
                    <div
                      key={item.status}
                      className={colors[item.status as keyof typeof colors] || 'bg-gray-400'}
                      style={{ width: `${item.percentage}%` }}
                    />
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top 5 Escolas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Top 5 Escolas
            </CardTitle>
            <CardDescription>
              Escolas com mais eventos realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.schools.map((school, index) => {
                const percentage = ((school.count / events.length) * 100).toFixed(1)
                
                return (
                  <div key={school.school} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate" title={school.school}>
                        {index + 1}. {school.school}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{school.count}</span>
                        <span className="text-xs text-gray-500">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Evolução Mensal */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Evolução Mensal
            </CardTitle>
            <CardDescription>
              Eventos, participantes e receita por mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.monthly.map((month, index) => (
                <div key={month.month} className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Mês</p>
                    <p className="font-medium">{month.month}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Eventos</p>
                    <p className="font-medium text-blue-600">{month.events}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Participantes</p>
                    <p className="font-medium text-green-600">{month.participants}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Receita</p>
                    <p className="font-medium text-purple-600">R$ {month.revenue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
})

AnalyticsCharts.displayName = 'AnalyticsCharts'

export default AnalyticsCharts
