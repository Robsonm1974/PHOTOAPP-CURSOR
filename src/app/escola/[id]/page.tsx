'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { School, MapPin, Phone, User, Instagram, Facebook, MessageSquare, Building2, GraduationCap, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useEvents, School as SchoolType } from '@/app/contexts/EventsContext'

export default function EscolaPublicaPage() {
  const params = useParams()
  const { schools } = useEvents()
  const [school, setSchool] = useState<SchoolType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id && schools.length > 0) {
      const foundSchool = schools.find(s => s.id === params.id)
      if (foundSchool) {
        setSchool(foundSchool)
      }
      setLoading(false)
    }
  }, [params.id, schools])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando informações da escola...</p>
        </div>
      </div>
    )
  }

  if (!school) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Escola não encontrada</h1>
          <p className="text-gray-600">A escola solicitada não foi encontrada ou não existe.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header da Escola */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <School className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{school.name}</h1>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Badge variant={school.type === 'publica' ? 'default' : 'secondary'}>
                {school.type === 'publica' ? 'Pública' : 'Privada'}
              </Badge>
              <Badge variant="outline">
                <Users className="h-3 w-3 mr-1" />
                {school.studentCount} alunos
              </Badge>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{school.city}, {school.state}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Imagem da Escola */}
            {school.schoolImage && (
              <Card>
                <CardContent className="p-0">
                  <img
                    src={school.schoolImage}
                    alt={`Imagem da ${school.name}`}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                </CardContent>
              </Card>
            )}

            {/* Informações da Escola */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                  Sobre a Escola
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {school.address && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Endereço</p>
                      <p className="text-gray-600">{school.address}</p>
                    </div>
                  </div>
                )}

                {school.phone && (
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Telefone</p>
                      <p className="text-gray-600">{school.phone}</p>
                    </div>
                  </div>
                )}

                {school.education && school.education.length > 0 && (
                  <div className="flex items-start space-x-3">
                    <GraduationCap className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Níveis de Ensino</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {school.education.map((level) => (
                          <Badge key={level} variant="outline">
                            {level === 'infantil' ? 'Educação Infantil' : 
                             level === 'fundamental' ? 'Ensino Fundamental' : 
                             'Ensino Médio'}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {school.observations && (
                  <div>
                    <p className="font-medium text-gray-900 mb-2">Observações</p>
                    <p className="text-gray-600">{school.observations}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Redes Sociais */}
            {(school.instagram || school.facebook || school.whatsapp) && (
              <Card>
                <CardHeader>
                  <CardTitle>Redes Sociais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {school.instagram && (
                      <Button variant="outline" className="flex items-center space-x-2">
                        <Instagram className="h-4 w-4" />
                        <span>Instagram</span>
                      </Button>
                    )}
                    {school.facebook && (
                      <Button variant="outline" className="flex items-center space-x-2">
                        <Facebook className="h-4 w-4" />
                        <span>Facebook</span>
                      </Button>
                    )}
                    {school.whatsapp && (
                      <Button variant="outline" className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>WhatsApp</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Diretor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-green-600" />
                  Direção
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {school.directorPhoto && (
                  <div className="text-center">
                    <img
                      src={school.directorPhoto}
                      alt={`Diretor ${school.director}`}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-3"
                    />
                  </div>
                )}
                <div className="text-center">
                  <p className="font-semibold text-gray-900">{school.director}</p>
                  <p className="text-sm text-gray-600">Diretor(a)</p>
                </div>
                {school.directorMessage && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 italic text-center">
                      "{school.directorMessage}"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informações de Contato */}
            <Card>
              <CardHeader>
                <CardTitle>Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {school.whatsapp && (
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Falar no WhatsApp
                  </Button>
                )}
                {school.phone && (
                  <Button variant="outline" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Ligar
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Imagens em Destaque */}
            {school.featuredImages && school.featuredImages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Galeria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {school.featuredImages.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Imagem ${index + 1} da escola`}
                        className="w-full h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
