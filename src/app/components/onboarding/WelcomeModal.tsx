'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Camera, Users, QrCode, TrendingUp, X, ArrowRight } from 'lucide-react'

interface WelcomeModalProps {
  isOpen: boolean
  onClose: () => void
  userName: string
}

export default function WelcomeModal({ isOpen, onClose, userName }: WelcomeModalProps) {
  const [currentStep, setCurrentStep] = useState(0)

  if (!isOpen) return null

  const steps = [
    {
      title: `Bem-vindo ao PhotoApp, ${userName}! 🎉`,
      description: 'Sua plataforma completa para gerenciar eventos fotográficos escolares',
      icon: <Camera className="h-12 w-12 text-blue-600" />,
      content: (
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Transforme a gestão dos seus eventos fotográficos em uma experiência simples e profissional.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Gerencie Participantes</h4>
              <p className="text-sm text-gray-600">Cadastre alunos, professores e funcionários</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <QrCode className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">QR Codes Únicos</h4>
              <p className="text-sm text-gray-600">Organize e identifique fotos facilmente</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Como funciona? 📸',
      description: 'Processo simples em 4 passos',
      icon: <ArrowRight className="h-12 w-12 text-green-600" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">1</div>
            <div>
              <h4 className="font-semibold">Crie um Evento</h4>
              <p className="text-sm text-gray-600">Defina escola, data e configurações</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">2</div>
            <div>
              <h4 className="font-semibold">Adicione Participantes</h4>
              <p className="text-sm text-gray-600">Cadastre individualmente ou importe CSV</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">3</div>
            <div>
              <h4 className="font-semibold">Imprima QR Codes</h4>
              <p className="text-sm text-gray-600">Cada participante recebe um código único</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">4</div>
            <div>
              <h4 className="font-semibold">Gerencie Vendas</h4>
              <p className="text-sm text-gray-600">Acompanhe vendas e comissões</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Pronto para começar! 🚀',
      description: 'Sua conta está configurada e pronta para uso',
      icon: <TrendingUp className="h-12 w-12 text-purple-600" />,
      content: (
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Você já pode começar criando seu primeiro evento ou explorando as funcionalidades.
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
            <h4 className="font-semibold text-lg mb-2">💡 Dica Pro</h4>
            <p className="text-sm text-gray-600">
              Use o botão "Exportar Lista" para gerar planilhas Excel com todos os participantes, 
              e "Imprimir QR Codes" para criar etiquetas profissionais.
            </p>
          </div>
        </div>
      )
    }
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Marcar onboarding como concluído
      localStorage.setItem('photoapp_onboarding_completed', 'true')
      onClose()
    }
  }

  const skipOnboarding = () => {
    localStorage.setItem('photoapp_onboarding_completed', 'true')
    onClose()
  }

  const currentStepData = steps[currentStep]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <button
            onClick={skipOnboarding}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="text-center mb-4">
            {currentStepData.icon}
          </div>
          
          <CardTitle className="text-center text-xl">
            {currentStepData.title}
          </CardTitle>
          <CardDescription className="text-center">
            {currentStepData.description}
          </CardDescription>
          
          {/* Progress bar */}
          <div className="flex space-x-2 justify-center mt-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-8 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-8">
            {currentStepData.content}
          </div>
          
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={skipOnboarding}
              className="text-gray-500"
            >
              Pular tutorial
            </Button>
            
            <div className="flex space-x-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Anterior
                </Button>
              )}
              <Button onClick={nextStep}>
                {currentStep === steps.length - 1 ? 'Começar!' : 'Próximo'}
                {currentStep < steps.length - 1 && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
