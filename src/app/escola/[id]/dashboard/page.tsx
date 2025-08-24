'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useEvents, School, PhotoSale } from '@/app/contexts/EventsContext'
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar, 
  Download, 
  ArrowLeft, 
  Eye,
  FileText,
  PieChart
} from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import Link from 'next/link'

export default function EscolaDashboardPage() {
  const params = useParams()
  const router = useRouter()
  const { schools, photoSales, getPhotoSalesBySchool, calculateSchoolRevenue, participants } = useEvents()
  const [school, setSchool] = useState<School | null>(null)
  const [schoolSales, setSchoolSales] = useState<PhotoSale[]>([])
  const [revenue, setRevenue] = useState({ totalSales: 0, totalCommission: 0, netRevenue: 0 })
  const [loading, setLoading] = useState(true)
  const [showSalesDetails, setShowSalesDetails] = useState(false)

  useEffect(() => {
    if (params.id && schools.length > 0) {
      const foundSchool = schools.find(s => s.id === params.id)
      if (foundSchool) {
        setSchool(foundSchool)
        const sales = getPhotoSalesBySchool(params.id as string)
        setSchoolSales(sales)
        const revenueData = calculateSchoolRevenue(params.id as string)
        setRevenue(revenueData)
      }
      setLoading(false)
    }
  }, [params.id, schools, getPhotoSalesBySchool, calculateSchoolRevenue])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard da escola...</p>
        </div>
      </div>
    )
  }

  if (!school) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Escola não encontrada</h1>
          <p className="text-gray-600 mb-6">A escola solicitada não foi encontrada em nosso sistema.</p>
          <Link href="/escolas">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar às Escolas
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const getParticipantInfo = (participantId: string) => {
    const participant = participants.find(p => p.id === participantId)
    return participant ? { name: participant.name, class: participant.class } : { name: 'N/A', class: 'N/A' }
  }

  const exportSalesReport = () => {
    const reportData = {
      escola: school.name,
      periodo: new Date().toLocaleDateString('pt-BR'),
      vendas: schoolSales.map(sale => {
        const participantInfo = getParticipantInfo(sale.participantId)
        return {
          data: sale.soldAt,
          aluno: participantInfo.name,
          turma: participantInfo.class,
          foto: sale.photoUrl.split('/').pop() || 'N/A',
          valor: sale.price,
          comissao: sale.commissionAmount,
          status: sale.status
        }
      }),
      resumo: {
        totalVendas: revenue.totalSales,
        totalComissao: revenue.totalCommission,
        quantidadeVendas: schoolSales.length
      }
    }

    // Gerar PDF manualmente usando HTML
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Relatório de Vendas - ${school.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .summary { background: #f5f5f5; padding: 15px; margin-bottom: 20px; }
          .summary h3 { margin-top: 0; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .total { font-weight: bold; background-color: #e8f4fd; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Relatório de Vendas</h1>
          <h2>${school.name}</h2>
          <p>Período: ${new Date().toLocaleDateString('pt-BR')}</p>
        </div>
        
        <div class="summary">
          <h3>Resumo Financeiro</h3>
          <p><strong>Total de Vendas:</strong> R$ ${revenue.totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <p><strong>Total de Comissões:</strong> R$ ${revenue.totalCommission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <p><strong>Quantidade de Vendas:</strong> ${schoolSales.length}</p>
        </div>

        <h3>Detalhes das Vendas</h3>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Aluno</th>
              <th>Turma</th>
              <th>Foto</th>
              <th>Valor</th>
              <th>Comissão</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.vendas.map(venda => `
              <tr>
                <td>${new Date(venda.data).toLocaleDateString('pt-BR')}</td>
                <td>${venda.aluno}</td>
                <td>${venda.turma}</td>
                <td>${venda.foto}</td>
                <td>R$ ${venda.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td>R$ ${venda.comissao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td>${venda.status === 'paid' ? 'Pago' : venda.status === 'pending' ? 'Pendente' : 'Cancelado'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <p style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
          Relatório gerado em ${new Date().toLocaleString('pt-BR')}
        </p>
      </body>
      </html>
    `

    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio_vendas_${school.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push('/escolas')}>
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar
              </Button>
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Dashboard da Escola</h1>
                  <p className="text-sm text-gray-600">{school.name}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link href={`/escola/${school.id}`}>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Perfil
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total de Vendas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {revenue.totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Comissões</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {revenue.totalCommission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>



          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Users className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total de Alunos</p>
                  <p className="text-2xl font-bold text-gray-900">{school.studentCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Sales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Vendas Recentes
              </CardTitle>
              <CardDescription>
                Últimas vendas de fotos desta escola
              </CardDescription>
            </CardHeader>
            <CardContent>
              {schoolSales.length > 0 ? (
                <div className="space-y-4">
                  {schoolSales.slice(0, 5).map((sale) => {
                    const participantInfo = getParticipantInfo(sale.participantId)
                    return (
                      <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {participantInfo.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {participantInfo.class} • {new Date(sale.soldAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            R$ {sale.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-xs text-gray-500">
                            Comissão: R$ {sale.commissionAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma venda registrada ainda</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* School Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações da Escola</CardTitle>
              <CardDescription>Dados básicos da instituição</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nome</p>
                  <p className="font-medium text-gray-900">{school.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cidade/Estado</p>
                  <p className="font-medium text-gray-900">{school.city}, {school.state}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tipo</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {school.type === 'publica' ? 'Pública' : 'Privada'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Diretor(a)</p>
                  <p className="font-medium text-gray-900">{school.director}</p>
                </div>
              </div>
              
              {school.observations && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">Observações</p>
                  <p className="text-gray-900">{school.observations}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Sales Section */}
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-gray-900">Lista Detalhada de Vendas</CardTitle>
                  <CardDescription>
                    Visualize todas as vendas com informações completas dos compradores
                  </CardDescription>
                </div>
                <Button onClick={exportSalesReport} className="mt-4 sm:mt-0">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {schoolSales.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-blue-200">
                        <th className="text-left py-2 px-3 font-medium text-gray-700">Data</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700">Comprador</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700">Aluno</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700">Turma</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700">Código da Foto</th>
                        <th className="text-right py-2 px-3 font-medium text-gray-700">Valor</th>
                        <th className="text-center py-2 px-3 font-medium text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schoolSales.map((sale) => {
                        const participantInfo = getParticipantInfo(sale.participantId)
                        const photoCode = sale.photoUrl.split('/').pop()?.split('.')[0] || 'N/A'
                        return (
                          <tr key={sale.id} className="border-b border-gray-100 hover:bg-blue-25">
                            <td className="py-3 px-3 text-gray-600">
                              {new Date(sale.soldAt).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="py-3 px-3 text-gray-900 font-medium">
                              Comprador #{sale.id.slice(-4)}
                            </td>
                            <td className="py-3 px-3 text-gray-900">
                              {participantInfo.name}
                            </td>
                            <td className="py-3 px-3 text-gray-600">
                              {participantInfo.class}
                            </td>
                            <td className="py-3 px-3 text-gray-600 font-mono text-xs">
                              {photoCode}
                            </td>
                            <td className="py-3 px-3 text-right text-gray-900 font-medium">
                              R$ {sale.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                sale.status === 'paid' 
                                  ? 'bg-green-100 text-green-700' 
                                  : sale.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {sale.status === 'paid' ? 'Pago' : sale.status === 'pending' ? 'Pendente' : 'Cancelado'}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                  <p className="text-blue-600">Nenhuma venda registrada ainda</p>
                  <p className="text-sm text-blue-500 mt-1">As vendas aparecerão aqui conforme forem realizadas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
