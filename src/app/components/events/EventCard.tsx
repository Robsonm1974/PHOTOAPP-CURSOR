import React from 'react'
import { Eye, School } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Event } from '@/app/contexts/EventsContext'

interface EventCardProps {
  event: Event
  onEdit: (event: Event) => void
  onView: (eventId: string) => void
}

const EventCard = React.memo(({ event, onEdit, onView }: EventCardProps) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {event.title}
            </CardTitle>
            <CardDescription className="flex items-center text-sm text-gray-600">
              <School className="h-4 w-4 mr-1 text-gray-500" />
              {event.school}
            </CardDescription>
          </div>
          <Badge 
            variant={
              event.status === 'active' ? 'success' :
              event.status === 'upcoming' ? 'default' : 'secondary'
            }
            className="ml-2"
          >
            {event.status === 'active' ? 'Ativo' :
             event.status === 'upcoming' ? 'Próximo' : 'Concluído'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Data</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(event.startDate).toLocaleDateString('pt-BR')}
                {event.endDate && event.startDate !== event.endDate
                  ? ` - ${new Date(event.endDate).toLocaleDateString('pt-BR')}`
                  : ''}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Participantes</p>
              <p className="text-sm font-medium text-gray-900">{event.participantsCount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Comissão</p>
              <p className="text-sm font-medium text-green-600">{event.commission}%</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Contato</p>
              <p className="text-sm font-medium text-gray-900">{event.contact}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Telefone</p>
              <p className="text-sm font-medium text-gray-900">{event.phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Preço/Foto</p>
              <p className="text-sm font-medium text-purple-600">R$ {event.photoPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              onClick={() => onView(event.id)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Administrar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 hover:bg-gray-50" 
              onClick={() => onEdit(event)}
            >
              Editar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

EventCard.displayName = 'EventCard'

export default EventCard
