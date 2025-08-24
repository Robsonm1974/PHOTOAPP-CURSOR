'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useEvents, School } from '@/app/contexts/EventsContext'
import { MapPin, Phone, User, GraduationCap, Star, ArrowLeft, ExternalLink, QrCode } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import Link from 'next/link'

export default function EscolaProfilePage() {
  const params = useParams()
  const { schools } = useEvents()
  const [school, setSchool] = useState<School | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id && schools.length > 0) {
      const foundSchool = schools.find(s => s.id === params.id)
      setSchool(foundSchool || null)
      setLoading(false)
    }
  }, [params.id, schools])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil da escola...</p>
        </div>
      </div>
    )
  }

  if (!school) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Escola não encontrada</h1>
          <p className="text-gray-600 mb-6">A escola solicitada não foi encontrada em nosso sistema.</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/localizar">
                <Button variant="outline" size="sm">
                  <QrCode className="h-5 w-5 mr-2" />
                  Encontrar Alunos por QR Code
                </Button>
              </Link>
            </div>
            <div className="text-sm text-gray-500">
              Powered by MAKARISPO TECNOLOGIA
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative mb-8">
          {school.schoolImage ? (
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={school.schoolImage}
                alt={`Imagem da ${school.name}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {school.name}
                </h1>
                <div className="flex items-center text-white/90">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="text-lg">{school.city}, {school.state}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-64 md:h-80 rounded-2xl flex items-center justify-center shadow-2xl">
              <div className="text-center text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {school.name}
                </h1>
                <div className="flex items-center justify-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="text-lg">{school.city}, {school.state}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - School Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-900">Sobre Nossa Escola</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <GraduationCap className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tipo de Instituição</p>
                      <p className="font-semibold text-gray-900 capitalize">
                        {school.type === 'publica' ? 'Pública' : 'Privada'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <User className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Número de Alunos</p>
                      <p className="font-semibold text-gray-900">{school.studentCount.toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                </div>

                {school.observations && (
                  <div className="pt-4 border-t">
                    <p className="text-gray-700 leading-relaxed">{school.observations}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Director's Message */}
            {school.directorMessage && (
              <Card className="shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-xl text-yellow-900 flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Mensagem do Diretor(a)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-gray-700 italic leading-relaxed text-lg">
                    "{school.directorMessage}"
                  </blockquote>
                  <div className="mt-4 text-right">
                    <p className="text-sm text-gray-600">
                      — <span className="font-semibold">{school.director}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Director Profile & Quick Actions */}
          <div className="space-y-6">
            {/* Director Profile Card */}
            <Card className="shadow-lg text-center">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Direção</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {school.directorPhoto ? (
                  <div className="mx-auto">
                    <img
                      src={school.directorPhoto}
                      alt={`Foto de ${school.director}`}
                      className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 mx-auto flex items-center justify-center">
                    <User className="h-16 w-16 text-white" />
                  </div>
                )}
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{school.director}</h3>
                  <p className="text-sm text-gray-600">Diretor(a)</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Entrar em Contato
                </Button>
                
                <Button className="w-full" variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  Ver Localização
                </Button>
              </CardContent>
            </Card>

            {/* School Stats */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total de Alunos</span>
                  <span className="font-semibold text-blue-600">{school.studentCount.toLocaleString('pt-BR')}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tipo</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    school.type === 'publica' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {school.type === 'publica' ? 'Pública' : 'Privada'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Estado</span>
                  <span className="font-semibold text-gray-900">{school.state}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-2xl">
            <CardContent className="py-8">
              <h2 className="text-2xl font-bold mb-4">
                Interessado em nossos serviços fotográficos?
              </h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Oferecemos serviços profissionais de fotografia escolar para capturar momentos especiais 
                da vida acadêmica dos seus alunos.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" variant="secondary">
                  <Phone className="h-4 w-4 mr-2" />
                  Solicitar Orçamento
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver Portfólio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-24">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 Dia da Foto. Página de perfil da escola gerada automaticamente.</p>
            <p className="text-sm mt-2">
              Esta página é oferecida como cortesia para apresentar sua instituição de forma profissional.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
