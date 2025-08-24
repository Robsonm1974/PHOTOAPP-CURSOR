'use client'

import { useState } from 'react'
import { ShoppingCart as ShoppingCartIcon, Star, StarOff, DollarSign } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent } from '@/app/components/ui/card'
import { useEvents, Event, Participant } from '@/app/contexts/EventsContext'
import ShoppingCart from '@/app/components/sales/ShoppingCart'

interface PhotoGalleryProps {
  participant: Participant
  onPhotoSelect?: (photoUrl: string) => void
}

export default function PhotoGallery({ participant, onPhotoSelect }: PhotoGalleryProps) {
  const { events, updateParticipantProfilePhoto } = useEvents()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<any[]>([])

  const event = events.find(e => e.id === participant.eventId)

  const handleAddToCart = (photoUrl: string) => {
    if (!event) return

    const newItem = {
      id: Date.now().toString(),
      photoUrl,
      participantName: participant.name,
      eventTitle: event.title,
      price: event.photoPrice,
      quantity: 1,
      participantId: participant.id,
      eventId: event.id,
      schoolId: event.schoolId
    }

    setCartItems(prev => [...prev, newItem])
  }

  const handleProfilePhotoSelect = (photoUrl: string) => {
    updateParticipantProfilePhoto(participant.id, photoUrl)
    if (onPhotoSelect) {
      onPhotoSelect(photoUrl)
    }
  }

  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)

  const handleCheckout = (items: any[]) => {
    console.log('Compra finalizada:', items)
    setCartItems([])
    closeCart()
  }

  if (!participant.photos || participant.photos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhuma foto disponível para este participante.</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Fotos de {participant.name}
          </h3>
          <Button variant="outline" size="sm" onClick={openCart}>
            <ShoppingCartIcon className="h-4 w-4 mr-2" />
            Carrinho ({cartItems.length})
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {participant.photos.map((photoUrl, index) => (
            <Card key={index} className="group relative overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={photoUrl}
                    alt={`Foto ${index + 1} de ${participant.name}`}
                    className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                  />
                  
                  {/* Overlay com ações */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity space-y-2">
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(photoUrl)}
                        className="w-full"
                      >
                        <ShoppingCartIcon className="h-4 w-4 mr-2" />
                        Adicionar ao Carrinho
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleProfilePhotoSelect(photoUrl)}
                        className={`w-full ${
                          participant.profilePhoto === photoUrl
                            ? 'bg-yellow-100 border-yellow-400 text-yellow-800'
                            : ''
                        }`}
                      >
                        {participant.profilePhoto === photoUrl ? (
                          <>
                            <Star className="h-4 w-4 mr-2" />
                            Foto Principal
                          </>
                        ) : (
                          <>
                            <StarOff className="h-4 w-4 mr-2" />
                            Definir como Principal
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Preço da foto */}
                  {event && (
                    <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {event.photoPrice.toFixed(2)}
                    </div>
                  )}

                  {/* Indicador de foto principal */}
                  {participant.profilePhoto === photoUrl && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded flex items-center">
                      <Star className="h-3 w-3 mr-1" />
                      Principal
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Informações de preço */}
        {event && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-800">
                    <DollarSign className="h-4 w-4 inline mr-1" />
                    Preço por foto: R$ {event.photoPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-blue-600">
                    Comissão da escola: {event.commission}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-800">
                    Total disponível: R$ {(event.photoPrice * participant.photos.length).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-blue-600">
                    {participant.photos.length} foto{participant.photos.length !== 1 ? 's' : ''} disponível{participant.photos.length !== 1 ? 'is' : ''}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Carrinho de compras */}
      <ShoppingCart
        isOpen={isCartOpen}
        onClose={closeCart}
        onCheckout={handleCheckout}
      />
    </>
  )
}
