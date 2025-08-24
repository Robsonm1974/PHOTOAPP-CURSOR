'use client'

import { useState } from 'react'
import { QrCode, MessageCircle, ArrowLeft, ShoppingCart as ShoppingCartIcon, Star, StarOff } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { useEvents, Participant, Event, Product } from '@/app/contexts/EventsContext'
import Link from 'next/link'
import ShoppingCart from '@/app/components/sales/ShoppingCart'
import WatermarkedImage from '@/app/components/ui/WatermarkedImage'

export default function LocalizarParticipantePage() {
  const { searchParticipants, products, appConfig, events } = useEvents()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Participant[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false)
  const [whatsAppForm, setWhatsAppForm] = useState({
    parentName: '',
    studentName: '',
    class: '',
    school: ''
  })

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    const results = searchParticipants(searchQuery, 'qrcode')
    setSearchResults(results)
    setIsSearching(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

    const addToCart = (photoUrl: string, participant: Participant, event: Event, filename: string, productPrice?: number) => {
    const existingItem = cartItems.find(item => 
      item.photoUrl === photoUrl && item.participantId === participant.id
    )
    
    // Determinar o preço: usar productPrice se fornecido, senão usar photoPrice do evento
    const itemPrice = productPrice || event.photoPrice
    
    if (existingItem) {
      setCartItems(prev => prev.map(item =>
        item.id === existingItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      const newItem = {
        id: Date.now().toString(),
        photoUrl,
        participantName: participant.name,
        eventTitle: event.title,
        price: itemPrice,
        quantity: 1,
        participantId: participant.id,
        eventId: event.id,
        schoolId: event.schoolId,
        filename: filename
      }
      setCartItems(prev => [...prev, newItem])
    }
    
    // Feedback visual
    console.log(`Adicionado ao carrinho: ${filename} - R$ ${itemPrice.toFixed(2)}`)
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
    // Aqui você implementaria a lógica de checkout
    console.log('Finalizando compra:', cartItems)
    setCartItems([])
    setIsCartOpen(false)
  }

  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)

  const handleWhatsAppRequest = () => {
    const { parentName, studentName, class: studentClass, school } = whatsAppForm
    
    if (!parentName || !studentName || !studentClass || !school) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    const message = `Olá! Sou ${parentName}, responsável pelo(a) aluno(a) ${studentName} da turma ${studentClass} da escola ${school}. Gostaria de solicitar o QR Code para visualizar as fotos do Dia da Foto. Obrigado!`
    
    const whatsappUrl = `https://wa.me/${appConfig.whatsappNumber}?text=${encodeURIComponent(message)}`
    
    // Reset form and close modal
    setWhatsAppForm({
      parentName: '',
      studentName: '',
      class: '',
      school: ''
    })
    setShowWhatsAppModal(false)
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank')
  }

  const resetWhatsAppForm = () => {
    setWhatsAppForm({
      parentName: '',
      studentName: '',
      class: '',
      school: ''
    })
    setShowWhatsAppModal(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar ao Início
              </Link>
              <div className="flex items-center">
                <QrCode className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Localizar Participante</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="h-6 w-6 mr-2" />
              Buscar por QR Code
            </CardTitle>
            <CardDescription>
              Digite o código QR de 6 dígitos do participante para localizar suas fotos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Input
                type="text"
                placeholder="Digite o QR Code (ex: 123456)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                maxLength={6}
                className="pr-12"
              />
              <Button 
                onClick={handleSearch} 
                disabled={isSearching}
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                {isSearching ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <QrCode className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* WhatsApp Contact */}
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm text-green-800 mb-2">
                    Não tem o QR Code? Entre em contato conosco via WhatsApp
                  </p>
                  <button
                    onClick={() => setShowWhatsAppModal(true)}
                    className="text-sm font-medium text-green-600 hover:text-green-700 underline"
                  >
                    Solicitar QR Code via WhatsApp
                  </button>
                </div>
              </div>
              
              {/* QR Code Information */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">📍 Onde encontrar seu QR Code:</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• <strong>Entregue ao aluno:</strong> Após a sessão fotográfica</li>
                  <li>• <strong>Na secretaria da escola:</strong> Lista completa com todos os QR Codes</li>
                  <li>• <strong>Formato:</strong> Código de 6 dígitos únicos</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Resultados da Busca</h2>
              <p className="text-gray-600">{searchResults.length} participante(s) encontrado(s)</p>
            </div>

            {searchResults.map((participant) => {
              const event = events.find(e => e.id === participant.eventId)
              if (!event) return null

              return (
                <Card key={participant.id} className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    {/* Participant Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-lg">
                            {participant.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">{participant.name}</h4>
                          <p className="text-gray-600">{participant.class} • {event.school}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">QR Code {participant.qrCode}</p>
                        <div className="mt-2 flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const shareUrl = `${window.location.origin}/localizar`
                              const message = `Veja as fotos da ${participant.name}: ${shareUrl}`
                              if (navigator.share) {
                                navigator.share({ 
                                  title: `Fotos - ${participant.name}`, 
                                  text: message, 
                                  url: shareUrl 
                                })
                              } else {
                                navigator.clipboard.writeText(message).then(() => 
                                  alert('Link copiado para a área de transferência!')
                                )
                              }
                            }}
                          >
                            📤 Compartilhar Perfil
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Available Photos */}
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">📷</span>
                        Fotos Disponíveis ({participant.photos.length})
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {participant.photos.map((photoUrl, index) => {
                          // Extrair nome do arquivo da URL
                          const filename = photoUrl.split('/').pop() || `foto_${index + 1}.jpg`
                          
                          return (
                            <div key={index} className="relative group">
                              <div className="relative bg-gray-200 rounded-lg overflow-hidden">
                                <WatermarkedImage
                                  src={photoUrl}
                                  alt={`Foto ${index + 1} de ${participant.name}`}
                                  className="w-full h-32"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1 text-center">
                                  {filename}
                                </div>
                                
                                {/* Botão de adicionar ao carrinho */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                                  <Button
                                    size="sm"
                                    onClick={() => addToCart(photoUrl, participant, event, filename)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 group-hover:scale-100"
                                  >
                                    <ShoppingCartIcon className="h-4 w-4 mr-2" />
                                    Adicionar
                                  </Button>
                                </div>

                                {/* Preço da foto */}
                                <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                                  R$ {event.photoPrice.toFixed(2)}
                                </div>
                              </div>
                              
                              {/* Nome do arquivo */}
                              <p className="text-xs text-gray-600 mt-2 text-center truncate" title={filename}>
                                {filename}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Additional Products */}
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">⭐</span>
                        Produtos Adicionais
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {products.filter(p => p.isActive).map((product) => (
                          <Card key={product.id} className="border-2 border-gray-200 hover:border-blue-300 transition-colors">
                            <CardContent className="p-4">
                              {/* Product Image */}
                              <div className="mb-3">
                                {product.image ? (
                                  <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        // Fallback para imagem quebrada
                                        const target = e.target as HTMLImageElement
                                        target.style.display = 'none'
                                        target.nextElementSibling?.classList.remove('hidden')
                                      }}
                                    />
                                    <div className="hidden w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                                      <span className="text-gray-600 text-xs text-center px-2">
                                        {product.name}
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="w-full h-32 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-600 text-xs text-center px-2">
                                      {product.name}
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              <h6 className="font-semibold text-gray-900 mb-2">{product.name}</h6>
                              <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-green-600">
                                  R$ {product.price.toFixed(2)}
                                </span>
                                <Button
                                  size="sm"
                                  onClick={() => addToCart(
                                    `/products/${product.id}`,
                                    participant,
                                    event,
                                    product.name,
                                    product.price
                                  )}
                                >
                                  <ShoppingCartIcon className="h-4 w-4 mr-2" />
                                  Adicionar ao Carrinho
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4">
                      <Button
                        onClick={openCart}
                        disabled={cartItems.length === 0}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <ShoppingCartIcon className="h-5 w-5 mr-2" />
                        Finalizar Compra
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* No Results */}
        {searchQuery && searchResults.length === 0 && !isSearching && (
          <Card className="text-center py-12">
            <CardContent>
              <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum participante encontrado</h3>
              <p className="text-gray-600">
                Verifique se o QR Code está correto ou entre em contato conosco
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Shopping Cart */}
      <ShoppingCart
        isOpen={isCartOpen}
        onClose={closeCart}
        onCheckout={handleCheckout}
      />

      {/* WhatsApp Request Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Solicitar QR Code</h3>
                </div>
                <button
                  onClick={resetWhatsAppForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                Preencha os dados abaixo para que possamos localizar rapidamente o participante e enviar o QR Code.
              </p>

              <div className="space-y-4">
                <div>
                  <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Pai/Mãe/Responsável *
                  </label>
                  <Input
                    id="parentName"
                    type="text"
                    value={whatsAppForm.parentName}
                    onChange={(e) => setWhatsAppForm(prev => ({ ...prev, parentName: e.target.value }))}
                    placeholder="Seu nome completo"
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Participante *
                  </label>
                  <Input
                    id="studentName"
                    type="text"
                    value={whatsAppForm.studentName}
                    onChange={(e) => setWhatsAppForm(prev => ({ ...prev, studentName: e.target.value }))}
                    placeholder="Nome completo do aluno"
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="studentClass" className="block text-sm font-medium text-gray-700 mb-1">
                    Turma *
                  </label>
                  <Input
                    id="studentClass"
                    type="text"
                    value={whatsAppForm.class}
                    onChange={(e) => setWhatsAppForm(prev => ({ ...prev, class: e.target.value }))}
                    placeholder="Ex: 3º Ano A, 1ª Série B"
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="studentSchool" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Escola *
                  </label>
                  <Input
                    id="studentSchool"
                    type="text"
                    value={whatsAppForm.school}
                    onChange={(e) => setWhatsAppForm(prev => ({ ...prev, school: e.target.value }))}
                    placeholder="Nome completo da escola"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <Button
                  variant="outline"
                  onClick={resetWhatsAppForm}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleWhatsAppRequest}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Enviar pelo WhatsApp
                </Button>
              </div>

              {/* Information about QR Code delivery */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700">
                  <strong>📱 Resposta rápida:</strong> Você receberá o QR Code via WhatsApp em até 2 horas úteis.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
