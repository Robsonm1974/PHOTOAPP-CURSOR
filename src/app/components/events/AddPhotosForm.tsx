'use client'

import { useState } from 'react'
import { Upload, X, ShoppingCart as ShoppingCartIcon, DollarSign } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { useEvents, Event, Participant } from '@/app/contexts/EventsContext'
import ShoppingCart from '@/app/components/sales/ShoppingCart'

interface AddPhotosFormProps {
  participant: Participant
  onClose: () => void
  onPhotosAdded: (photos: string[]) => void
}

export default function AddPhotosForm({ participant, onClose, onPhotosAdded }: AddPhotosFormProps) {
  const { events, addPhotosToParticipant } = useEvents()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  const event = events.find(e => e.id === participant.eventId)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(prev => [...prev, ...files])

    // Criar URLs de preview
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrls(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    setIsUploading(true)
    
    try {
      // Simular upload - em produção, isso seria feito para um servidor
      const photoUrls = previewUrls.map((url, index) => 
        `/photos/${participant.id}_${Date.now()}_${index}.jpg`
      )

      // Adicionar fotos ao participante
      addPhotosToParticipant(participant.id, photoUrls)
      
      onPhotosAdded(photoUrls)
      onClose()
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)

  const handleCheckout = (items: any[]) => {
    console.log('Compra finalizada:', items)
    // Aqui você pode adicionar lógica adicional após o checkout
  }

  return (
    <>
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Adicionar Fotos - {participant.name}
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={openCart}>
                <ShoppingCartIcon className="h-4 w-4 mr-2" />
                Carrinho
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Adicione fotos para {participant.name} do evento {event?.title}
            {event && (
              <span className="block text-sm text-green-600 mt-1">
                Preço por foto: R$ {event.photoPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Upload de fotos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecionar Fotos
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Arraste e solte as fotos aqui ou clique para selecionar
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload">
                <Button variant="outline" asChild>
                  <span>Selecionar Fotos</span>
                </Button>
              </label>
            </div>
          </div>

          {/* Preview das fotos selecionadas */}
          {previewUrls.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Fotos Selecionadas ({previewUrls.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-white hover:text-red-400"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {event && (
                      <div className="absolute bottom-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                        R$ {event.photoPrice.toFixed(2)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

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
                      Total: R$ {(event.photoPrice * previewUrls.length).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-blue-600">
                      {previewUrls.length} foto{previewUrls.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botões de ação */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || isUploading}
            >
              {isUploading ? 'Fazendo Upload...' : 'Adicionar Fotos'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Carrinho de compras */}
      <ShoppingCart
        isOpen={isCartOpen}
        onClose={closeCart}
        onCheckout={handleCheckout}
      />
    </>
  )
}
