'use client'

import { useState } from 'react'
import { Settings, ArrowLeft, Plus, Edit, Trash2, Upload, X, Save, Camera, Package, Star } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { useEvents, AppConfig, Product } from '@/app/contexts/EventsContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ConfiguracoesPage() {
  const { appConfig, updateAppConfig, products, addProduct, updateProduct, deleteProduct } = useEvents()
  const router = useRouter()
  const [whatsappNumber, setWhatsappNumber] = useState(appConfig.whatsappNumber)
  const [appName, setAppName] = useState(appConfig.appName)
  const [appVersion, setAppVersion] = useState(appConfig.appVersion)
  const [appUrl, setAppUrl] = useState(appConfig.appUrl || '')
  const [appLogo, setAppLogo] = useState(appConfig.appLogo || '')
  const [watermark, setWatermark] = useState(appConfig.watermark || '')
  
  // Product management state
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'package' as 'photo' | 'package' | 'upsell',
    image: '',
    isActive: true
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  const handleSaveConfig = () => {
    updateAppConfig({
      whatsappNumber,
      appName,
      appVersion,
      appUrl,
      appLogo,
      watermark
    })
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProductSubmit = () => {
    const productData = {
      ...productForm,
      price: parseFloat(productForm.price),
      image: imagePreview || productForm.image
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, productData)
    } else {
      addProduct(productData)
    }

    // Reset form
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: 'package',
      image: '',
      isActive: true
    })
    setSelectedImage(null)
    setImagePreview('')
    setEditingProduct(null)
    setShowProductForm(false)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image || '',
      isActive: product.isActive
    })
    setImagePreview(product.image || '')
    setShowProductForm(true)
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduct(productId)
    }
  }

  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: 'package',
      image: '',
      isActive: true
    })
    setSelectedImage(null)
    setImagePreview('')
    setEditingProduct(null)
    setShowProductForm(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar
              </Link>
              <div className="flex items-center">
                <Settings className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* App Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Configurações do Aplicativo
              </CardTitle>
              <CardDescription>
                Configure as informações básicas do aplicativo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                             <div>
                 <label htmlFor="appName" className="block text-sm font-medium text-gray-700 mb-1">
                   Nome do Aplicativo
                 </label>
                 <Input
                   id="appName"
                   value={appName}
                   onChange={(e) => setAppName(e.target.value)}
                   placeholder="Nome do app"
                 />
                 <p className="text-xs text-gray-500 mt-1">
                   Este nome aparecerá no título das páginas e nos relatórios do sistema.
                 </p>
               </div>

                             <div>
                 <label htmlFor="appVersion" className="block text-sm font-medium text-gray-700 mb-1">
                   Versão
                 </label>
                 <Input
                   id="appVersion"
                   value={appVersion}
                   onChange={(e) => setAppVersion(e.target.value)}
                   placeholder="1.0.0"
                 />
                 <p className="text-xs text-gray-500 mt-1">
                   Versão atual do aplicativo para controle de atualizações.
                 </p>
               </div>

                             <div>
                 <label htmlFor="appUrl" className="block text-sm font-medium text-gray-700 mb-1">
                   URL do Aplicativo
                 </label>
                 <Input
                   id="appUrl"
                   value={appUrl}
                   onChange={(e) => setAppUrl(e.target.value)}
                   placeholder="https://exemplo.com"
                 />
                 <p className="text-xs text-gray-500 mt-1">
                   Endereço web oficial do aplicativo usado em links e compartilhamentos.
                 </p>
               </div>

                             <div>
                 <label htmlFor="appLogo" className="block text-sm font-medium text-gray-700 mb-1">
                   Upload do Logo
                 </label>
                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                   {appLogo ? (
                     <div className="relative">
                       <img
                         src={appLogo}
                         alt="Logo atual"
                         className="w-32 h-16 object-contain mx-auto mb-4 bg-white rounded border"
                       />
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={() => setAppLogo('')}
                         className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 p-0"
                       >
                         <X className="h-3 w-3" />
                       </Button>
                     </div>
                   ) : (
                     <>
                       <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                       <p className="text-gray-600 mb-2">
                         Arraste e solte seu logo aqui ou clique para selecionar
                       </p>
                     </>
                   )}
                   <input
                     type="file"
                     accept="image/*"
                     onChange={(e) => {
                       const file = e.target.files?.[0]
                       if (file) {
                         const reader = new FileReader()
                         reader.onload = (e) => {
                           setAppLogo(e.target?.result as string)
                         }
                         reader.readAsDataURL(file)
                       }
                     }}
                     className="hidden"
                     id="appLogo"
                   />
                   <label htmlFor="appLogo">
                     <Button variant="outline" asChild className="cursor-pointer">
                       <span>
                         <Camera className="h-4 w-4 mr-2" />
                         Selecionar Logo
                       </span>
                     </Button>
                   </label>
                 </div>
                 <p className="text-xs text-gray-500 mt-1">
                   <strong>Medidas recomendadas:</strong> 200x100 pixels (proporção 2:1). 
                   Formatos aceitos: PNG, JPG, SVG. Tamanho máximo: 2MB.
                 </p>
               </div>

               <div>
                 <label htmlFor="watermark" className="block text-sm font-medium text-gray-700 mb-1">
                   Upload da Marca D'água
                 </label>
                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                   {watermark ? (
                     <div className="relative">
                       <img
                         src={watermark}
                         alt="Marca d'água atual"
                         className="w-24 h-24 object-contain mx-auto mb-4 bg-white bg-opacity-50 rounded border"
                       />
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={() => setWatermark('')}
                         className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 p-0"
                       >
                         <X className="h-3 w-3" />
                       </Button>
                     </div>
                   ) : (
                     <>
                       <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                       <p className="text-gray-600 mb-2">
                         Arraste e solte sua marca d'água aqui ou clique para selecionar
                       </p>
                       <p className="text-xs text-gray-500 mb-2">
                         Se não carregar uma imagem, será usado "PHOTO APP" como marca d'água padrão
                       </p>
                     </>
                   )}
                   <input
                     type="file"
                     accept="image/*"
                     onChange={(e) => {
                       const file = e.target.files?.[0]
                       if (file) {
                         const reader = new FileReader()
                         reader.onload = (e) => {
                           setWatermark(e.target?.result as string)
                         }
                         reader.readAsDataURL(file)
                       }
                     }}
                     className="hidden"
                     id="watermark"
                   />
                   <label htmlFor="watermark">
                     <Button variant="outline" asChild className="cursor-pointer">
                       <span>
                         <Camera className="h-4 w-4 mr-2" />
                         Selecionar Marca D'água
                       </span>
                     </Button>
                   </label>
                 </div>
                 <p className="text-xs text-gray-500 mt-1">
                   <strong>Medidas recomendadas:</strong> 200x200 pixels (quadrada). 
                   A marca d'água aparecerá sobre as fotos dos participantes com 50% de transparência.
                   Formatos aceitos: PNG (recomendado para transparência), JPG. Tamanho máximo: 1MB.
                 </p>
               </div>

              <Button onClick={handleSaveConfig} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>

          {/* WhatsApp Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Configuração WhatsApp
              </CardTitle>
              <CardDescription>
                Configure o número do WhatsApp para contato
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                             <div>
                 <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 mb-1">
                   Número do WhatsApp
                 </label>
                 <Input
                   id="whatsappNumber"
                   value={whatsappNumber}
                   onChange={(e) => setWhatsappNumber(e.target.value)}
                   placeholder="5511999999999"
                 />
                 <p className="text-xs text-gray-500 mt-1">
                   Número usado para contato direto dos pais. Digite apenas números (código do país + DDD + número).
                 </p>
               </div>

              <Button onClick={handleSaveConfig} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Salvar Número WhatsApp
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Product Management */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Gerenciar Produtos Adicionais
                </CardTitle>
                <CardDescription>
                  Adicione, edite ou remova produtos para venda
                </CardDescription>
              </div>
              <Button onClick={() => setShowProductForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Produto
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Card key={product.id} className="border-2 border-gray-200">
                  <CardContent className="p-4">
                    {/* Product Image */}
                    <div className="mb-3">
                      {product.image ? (
                        <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-32 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex items-center justify-center">
                          <Camera className="h-8 w-8 text-gray-500" />
                        </div>
                      )}
                    </div>

                    <h6 className="font-semibold text-gray-900 mb-2">{product.name}</h6>
                    <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-green-600">
                        R$ {product.price.toFixed(2)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                <Button variant="ghost" size="icon" onClick={resetProductForm}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Produto
                </label>
                <Input
                  id="productName"
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome do produto"
                />
              </div>

              <div>
                <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <Input
                  id="productDescription"
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição detalhada do produto"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Preço (R$)
                  </label>
                  <Input
                    id="productPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <select
                    id="productCategory"
                    value={productForm.category}
                    onChange={(e) => setProductForm(prev => ({ 
                      ...prev, 
                      category: e.target.value as 'photo' | 'package' | 'upsell' 
                    }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="photo">Foto</option>
                    <option value="package">Pacote</option>
                    <option value="upsell">Produto Adicional</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="productImage" className="block text-sm font-medium text-gray-700 mb-1">
                  Imagem do Produto
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg mx-auto"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setImagePreview('')
                          setSelectedImage(null)
                        }}
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        Arraste e solte uma imagem aqui ou clique para selecionar
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="productImage"
                  />
                  <label htmlFor="productImage">
                    <Button variant="outline" asChild>
                      <span>Selecionar Imagem</span>
                    </Button>
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="productActive"
                  checked={productForm.isActive}
                  onChange={(e) => setProductForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="productActive" className="text-sm text-gray-700">
                  Produto ativo para venda
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button variant="outline" onClick={resetProductForm} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleProductSubmit} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {editingProduct ? 'Atualizar' : 'Criar'} Produto
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
