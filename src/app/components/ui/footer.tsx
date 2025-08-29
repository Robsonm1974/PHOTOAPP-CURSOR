import React from 'react'
import { Camera, Heart, Mail, Phone, Star, Briefcase } from 'lucide-react'
import Link from 'next/link'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-white dark:bg-card border-t border-gray-200 dark:border-border transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg mr-3">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Dia da Foto
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Plataforma completa para eventos fotográficos escolares. 
              Visualize e adquira suas fotos de forma prática e segura.
            </p>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span>Feito com</span>
              <Heart className="h-4 w-4 mx-1 text-red-500" />
              <span>para famílias e escolas</span>
            </div>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Contato
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Email do Fotógrafo:</p>
                  <a 
                    href="mailto:fotografo@exemplo.com" 
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    fotografo@exemplo.com
                  </a>
                </div>
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Telefone:</p>
                  <a 
                    href="tel:+5511999999999" 
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    (11) 99999-9999
                  </a>
                </div>
              </li>
              <li className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                * Dados configuráveis pelo fotógrafo no sistema
              </li>
            </ul>
          </div>

          {/* Para Fotógrafos */}
          <div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center mb-3">
                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg mr-2">
                  <Briefcase className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  É Fotógrafo?
                </h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Adquira nossa plataforma e organize seus eventos fotográficos escolares de forma profissional!
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Star className="h-3 w-3 mr-1 text-yellow-500" />
                  Gestão completa de eventos
                </div>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Star className="h-3 w-3 mr-1 text-yellow-500" />
                  Vendas online automatizadas
                </div>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Star className="h-3 w-3 mr-1 text-yellow-500" />
                  Interface moderna e intuitiva
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-blue-200 dark:border-blue-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <strong>Makarispo Tech</strong> - Desenvolvedora do sistema
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Contato e URL serão fornecidos
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-border mt-8 pt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} Dia da Foto. Todos os direitos reservados.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Desenvolvido por <strong>Makarispo Tech</strong> - Soluções em Tecnologia
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
