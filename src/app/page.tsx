'use client'

import { useState, useEffect } from 'react'
import { Calendar, Camera, Users, Settings, LogIn, Star, Shield, Zap } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/app/components/ui/loading-spinner'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <LoadingSpinner size="lg" text="Carregando..." />
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
              <Button asChild variant="outline" className="hidden sm:inline-flex">
                <Link href="/localizar">
                  <Users className="h-4 w-4 mr-2" />
                  Localizar
                </Link>
              </Button>
              <Button asChild>
                <Link href="/auth/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Entrar
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
            ✨ Sistema de Gestão Fotográfica Profissional
          </Badge>
          
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
            Administre seus
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Eventos Fotográficos
            </span>
          </h2>
          
          <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600 sm:text-xl">
            Sistema completo para gerenciar eventos escolares, participantes e gerar QR codes únicos para identificação. 
            Simplifique seu workflow e aumente suas vendas.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto sm:max-w-none">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
              <Link href="/auth/register" className="px-8 py-4 text-lg">
                <Star className="h-5 w-5 mr-2" />
                Começar Gratuitamente
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="px-8 py-4 text-lg border-2">
              <Link href="/auth/login">
                <LogIn className="h-5 w-5 mr-2" />
                Já tenho conta
              </Link>
            </Button>
          </div>

          <div className="mt-8">
            <Button asChild variant="outline" size="lg" className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
              <Link href="/localizar" className="px-8 py-3">
                <Users className="h-5 w-5 mr-2" />
                Localizar Participante
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">1000+</div>
              <div className="text-sm text-gray-600">Eventos Realizados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">50k+</div>
              <div className="text-sm text-gray-600">Fotos Vendidas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">98%</div>
              <div className="text-sm text-gray-600">Satisfação</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Tudo que você precisa em um só lugar
            </h3>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Ferramentas profissionais para fotógrafos que querem crescer e otimizar seus eventos
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl text-gray-900">Gestão de Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 text-base">
                  Crie e gerencie eventos fotográficos com datas, escolas e informações de contato. 
                  Interface intuitiva e processo simplificado.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-green-50 to-emerald-100">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl text-gray-900">Participantes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 text-base">
                  Adicione participantes manualmente ou via CSV e gere QR codes únicos. 
                  Identificação rápida e organizada.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Camera className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl text-gray-900">Fotos e Produtos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 text-base">
                  Gerencie fotos dos participantes e configure templates de produtos. 
                  Maximize suas vendas com facilidade.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-orange-50 to-orange-100">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl text-gray-900">Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 text-base">
                  Sistema otimizado para alta performance. 
                  Carregamento rápido e interface responsiva.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-pink-50 to-pink-100">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 text-white mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl text-gray-900">Segurança</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 text-base">
                  Dados protegidos com criptografia avançada. 
                  Seus eventos e informações sempre seguros.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-indigo-50 to-indigo-100">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Settings className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl text-gray-900">Personalização</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 text-base">
                  Configure o sistema do seu jeito. 
                  Adapte-se ao seu fluxo de trabalho específico.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-32">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg mr-3">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Dia da Foto
                </h3>
              </div>
              <p className="text-gray-400 max-w-md">
                Simplifique a gestão dos seus eventos fotográficos com nossa plataforma profissional. 
                Aumente suas vendas e otimize seu tempo.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Funcionalidades</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Preços</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Atualizações</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Documentação</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contato</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Dia da Foto. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
