'use client'

import { useState } from 'react'
import { ShoppingCart as CartIcon, X, Plus, Minus, CreditCard, Trash2 } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { useEvents, PhotoSale, Event, Participant } from '@/app/contexts/EventsContext'

interface CartItem {
  id: string
  photoUrl: string
  participantName: string
  eventTitle: string
  price: number
  quantity: number
  participantId: string
  eventId: string
  schoolId: string
  filename: string
}

interface ShoppingCartProps {
  isOpen: boolean
  onClose: () => void
  onCheckout: (items: CartItem[]) => void
}

export default function ShoppingCart({ isOpen, onClose, onCheckout }: ShoppingCartProps) {
  const { events, participants, addPhotoSale } = useEvents()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const addToCart = (photoUrl: string, participant: Participant, event: Event, filename: string) => {
    const existingItem = cartItems.find(item => 
      item.photoUrl === photoUrl && item.participantId === participant.id
    )

    if (existingItem) {
      setCartItems(prev => prev.map(item =>
        item.id === existingItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      const newItem: CartItem = {
        id: Date.now().toString(),
        photoUrl,
        participantName: participant.name,
        eventTitle: event.title,
        price: event.photoPrice,
        quantity: 1,
        participantId: participant.id,
        eventId: event.id,
        schoolId: event.schoolId,
        filename: filename // Placeholder, will be updated later
      }
      setCartItems(prev => [...prev, newItem])
    }
  }

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setCartItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ))
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    
    try {
      // Criar vendas para cada item do carrinho
      for (const item of cartItems) {
        for (let i = 0; i < item.quantity; i++) {
          await addPhotoSale({
            participantId: item.participantId,
            eventId: item.eventId,
            schoolId: item.schoolId,
            photoUrl: item.photoUrl,
            price: item.price,
            soldAt: new Date().toISOString(),
            status: 'paid'
          })
        }
      }

      // Limpar carrinho e fechar
      setCartItems([])
      onCheckout(cartItems)
      onClose()
    } catch (error) {
      console.error('Erro ao processar checkout:', error)
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-2">
            <CartIcon className="h-6 w-6 text-blue-600" />
            <CardTitle>Carrinho de Compras</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <CartIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Seu carrinho está vazio</p>
              <p className="text-sm text-gray-400">Adicione fotos para começar</p>
            </div>
          ) : (
            <>
              {/* Lista de itens */}
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.photoUrl}
                      alt={`Foto de ${item.participantName}`}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{item.participantName}</p>
                      <p className="text-sm text-gray-600 truncate">{item.eventTitle}</p>
                      <p className="text-xs text-blue-600 font-mono" title={item.filename}>
                        📁 {item.filename}
                      </p>
                      <p className="text-sm font-medium text-green-600">
                        R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Resumo e checkout */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium">Total:</span>
                  <span className="text-2xl font-bold text-green-600">
                    R$ {getTotalPrice().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Continuar Comprando
                  </Button>
                  <Button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="flex-1"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {isCheckingOut ? 'Processando...' : 'Finalizar Compra'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Hook para usar o carrinho
export const useShoppingCart = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)
  const addToCart = (photoUrl: string, participant: Participant, event: Event, filename: string) => {
    // Implementação do addToCart
  }

  return {
    isOpen,
    openCart,
    closeCart,
    addToCart,
    cartItems
  }
}
