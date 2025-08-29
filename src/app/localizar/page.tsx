'use client'

import { useState } from 'react'
import { QrCode, MessageCircle, ShoppingCart as ShoppingCartIcon, Star, StarOff, Camera, Search, Sparkles } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { useEvents, Participant, Event, Product } from '@/app/contexts/EventsContext'
import ShoppingCart from '@/app/components/sales/ShoppingCart'
import WatermarkedImage from '@/app/components/ui/WatermarkedImage'
import { ThemeToggle } from '@/app/components/ui/theme-toggle'
import { Badge } from '@/app/components/ui/badge'
import Footer from '@/app/components/ui/footer'

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-background dark:via-background dark:to-background transition-colors duration-200">
      {/* Header */}
      <header className="bg-white/80 dark:bg-card/80 backdrop-blur-md shadow-sm border-b border-white/20 dark:border-border sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg mr-3">
                <QrCode className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Localizar Participante
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                  Encontre e visualize suas fotos do evento
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4 mr-2" />
            Busca Inteligente de Fotos
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              DIA DA FOTO NA ESCOLA
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Encontre, visualize e faça seu pedido online!
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 border-0 bg-white/60 dark:bg-card/60 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                <Search className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">
              Buscar por QR Code
            </CardTitle>
            <CardDescription className="text-base text-gray-600 dark:text-gray-400">
              Digite o código QR de 6 dígitos do participante para localizar suas fotos
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <QrCode className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Digite o QR Code (ex: 123456)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                maxLength={6}
                className="pl-10 pr-20 h-12 text-center text-lg font-mono tracking-widest border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
              />
              <Button 
                onClick={handleSearch} 
                disabled={isSearching || !searchQuery.trim()}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isSearching ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* WhatsApp Contact */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10 hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                        Não tem o QR Code?
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-400 mb-3">
                        Entre em contato conosco via WhatsApp para solicitar seu código
                      </p>
                      <Button
                        onClick={() => setShowWhatsAppModal(true)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Solicitar via WhatsApp
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10 hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <QrCode className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                        📍 Onde encontrar seu QR Code:
                      </h3>
                      <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                        <li>• <strong>Entregue ao aluno:</strong> Após a sessão fotográfica</li>
                        <li>• <strong>Na secretaria da escola:</strong> Lista completa disponível</li>
                        <li>• <strong>Formato:</strong> Código de 6 dígitos únicos</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-8">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
                <Camera className="h-4 w-4 mr-2" />
                Participante Encontrado!
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Suas Fotos do Evento
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {searchResults.length} participante{searchResults.length > 1 ? 's' : ''} encontrado{searchResults.length > 1 ? 's' : ''}
              </p>
            </div>

            {searchResults.map((participant) => {
              const event = events.find(e => e.id === participant.eventId)
              if (!event) return null

              return (
                <Card key={participant.id} className="border-0 bg-white/80 dark:bg-card/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-8">
                    {/* Participant Header */}
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 space-y-4 sm:space-y-0">
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl">
                              {participant.name.charAt(0)}
                            </span>
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <Camera className="h-3 w-3 text-white" />
                          </div>
                        </div>
                        <div className="text-center sm:text-left">
                          <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{participant.name}</h4>
                          <p className="text-gray-600 dark:text-gray-400 text-lg">{participant.class} • {event.school}</p>
                          <Badge variant="secondary" className="mt-2">
                            {event.title}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-center sm:text-right">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl mb-3">
                          <p className="text-sm font-medium">QR Code</p>
                          <p className="text-2xl font-bold font-mono">{participant.qrCode}</p>
                        </div>
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
                          className="w-full sm:w-auto"
                        >
                          <Star className="h-4 w-4 mr-2" />
                          Compartilhar Perfil
                        </Button>
                      </div>
                    </div>

                    {/* Available Photos */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-6">
                        <h5 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg mr-3">
                            <Camera className="h-5 w-5 text-white" />
                          </div>
                          Fotos Disponíveis
                        </h5>
                        <Badge variant="secondary" className="px-3 py-1 text-lg">
                          {participant.photos.length} foto{participant.photos.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {participant.photos.map((photoUrl, index) => {
                          // Extrair nome do arquivo da URL
                          const filename = photoUrl.split('/').pop() || `foto_${index + 1}.jpg`
                          
                          return (
                            <div key={index} className="relative group">
                              <Card className="border-0 bg-white/60 dark:bg-card/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:scale-105">
                                <div className="relative aspect-square">
                                  <WatermarkedImage
                                    src={photoUrl}
                                    alt={`Foto ${index + 1} de ${participant.name}`}
                                    className="w-full h-full object-cover"
                                  />
                                  
                                  {/* Preço da foto */}
                                  <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                                    R$ {event.photoPrice.toFixed(2)}
                                  </div>
                                  
                                  {/* Overlay com botão */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                                    <Button
                                      size="lg"
                                      onClick={() => addToCart(photoUrl, participant, event, filename)}
                                      className="transform scale-90 group-hover:scale-100 transition-transform bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl"
                                    >
                                      <ShoppingCartIcon className="h-5 w-5 mr-2" />
                                      Adicionar ao Carrinho
                                    </Button>
                                  </div>

                                  {/* Badge do índice da foto */}
                                  <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/90 text-gray-900 dark:text-white text-xs font-bold px-2 py-1 rounded-full">
                                    #{index + 1}
                                  </div>
                                </div>
                                
                                {/* Footer do card */}
                                <CardContent className="p-3">
                                  <p className="text-xs text-gray-600 dark:text-gray-400 text-center truncate font-medium" title={filename}>
                                    {filename}
                                  </p>
                                </CardContent>
                              </Card>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Additional Products */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-6">
                        <h5 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                          <div className="p-2 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg mr-3">
                            <Sparkles className="h-5 w-5 text-white" />
                          </div>
                          Produtos Especiais
                        </h5>
                        <Badge variant="secondary" className="px-3 py-1">
                          {products.filter(p => p.isActive).length} produto{products.filter(p => p.isActive).length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
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
          <Card className="text-center py-16 border-0 bg-white/60 dark:bg-card/60 backdrop-blur-sm shadow-xl">
            <CardContent>
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl">
                  <QrCode className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Participante não encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 max-w-md mx-auto">
                Verifique se o QR Code <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{searchQuery}</span> está correto
              </p>
              <div className="space-y-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Dicas para encontrar seu código:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-sm">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="font-medium text-blue-800 dark:text-blue-300">📋 Secretaria da escola</p>
                    <p className="text-blue-600 dark:text-blue-400">Lista completa disponível</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <p className="font-medium text-green-800 dark:text-green-300">💬 WhatsApp</p>
                    <p className="text-green-600 dark:text-green-400">Solicite seu código</p>
                  </div>
                </div>
              </div>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-card rounded-2xl shadow-2xl w-full max-w-md mx-auto border-0 transition-colors duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Solicitar QR Code</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Via WhatsApp</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetWhatsAppForm}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 h-8 w-8 p-0"
                >
                  ✕
                </Button>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
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
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
