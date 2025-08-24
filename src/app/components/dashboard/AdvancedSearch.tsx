'use client'

import React, { useState } from 'react'
import { Search, Filter, Calendar, School, User, DollarSign, X } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Separator } from '@/app/components/ui/separator'

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void
  onClear: () => void
}

export interface SearchFilters {
  search: string
  status: 'all' | 'active' | 'upcoming' | 'completed'
  dateRange: {
    start?: string
    end?: string
  }
  priceRange: {
    min?: number
    max?: number
  }
  school: string
  contact: string
}

const AdvancedSearch = React.memo(({ onSearch, onClear }: AdvancedSearchProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    status: 'all',
    dateRange: {},
    priceRange: {},
    school: '',
    contact: ''
  })

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onSearch(newFilters)
  }

  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    const newFilters = {
      ...filters,
      dateRange: { ...filters.dateRange, [type]: value }
    }
    setFilters(newFilters)
    onSearch(newFilters)
  }

  const handlePriceRangeChange = (type: 'min' | 'max', value: number) => {
    const newFilters = {
      ...filters,
      priceRange: { ...filters.priceRange, [type]: value }
    }
    setFilters(newFilters)
    onSearch(newFilters)
  }

  const clearAllFilters = () => {
    const emptyFilters: SearchFilters = {
      search: '',
      status: 'all',
      dateRange: {},
      priceRange: {},
      school: '',
      contact: ''
    }
    setFilters(emptyFilters)
    onClear()
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.search) count++
    if (filters.status !== 'all') count++
    if (filters.dateRange.start || filters.dateRange.end) count++
    if (filters.priceRange.min || filters.priceRange.max) count++
    if (filters.school) count++
    if (filters.contact) count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <div className="space-y-4">
      {/* Busca Principal */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar eventos por título, escola ou contato..."
            className="pl-10"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(!isOpen)}
            className="relative"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros Avançados
            {activeFiltersCount > 0 && (
              <Badge 
                variant="destructive" 
                className="ml-2 px-1.5 py-0.5 text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Filtros Avançados */}
      {isOpen && (
        <Card className="animate-fadeIn">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtros Avançados
            </CardTitle>
            <CardDescription>
              Refine sua busca com filtros específicos
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Status */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Status do Evento
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativo</option>
                <option value="upcoming">Próximo</option>
                <option value="completed">Concluído</option>
              </select>
            </div>

            <Separator />

            {/* Filtros de Data */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Período do Evento
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Data Início</label>
                  <Input
                    type="date"
                    value={filters.dateRange.start || ''}
                    onChange={(e) => handleDateRangeChange('start', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Data Fim</label>
                  <Input
                    type="date"
                    value={filters.dateRange.end || ''}
                    onChange={(e) => handleDateRangeChange('end', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Filtros de Preço */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Faixa de Preço por Foto (R$)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Preço Mínimo</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={filters.priceRange.min || ''}
                    onChange={(e) => handlePriceRangeChange('min', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Preço Máximo</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="999.99"
                    value={filters.priceRange.max || ''}
                    onChange={(e) => handlePriceRangeChange('max', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Filtros de Escola e Contato */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
                  <School className="h-4 w-4 mr-2" />
                  Escola
                </label>
                <Input
                  placeholder="Nome da escola..."
                  value={filters.school}
                  onChange={(e) => handleFilterChange('school', e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Contato
                </label>
                <Input
                  placeholder="Nome do contato..."
                  value={filters.contact}
                  onChange={(e) => handleFilterChange('contact', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros Ativos */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Busca: {filters.search}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange('search', '')}
              />
            </Badge>
          )}
          
          {filters.status !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {filters.status}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange('status', 'all')}
              />
            </Badge>
          )}
          
          {(filters.dateRange.start || filters.dateRange.end) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Data: {filters.dateRange.start || '...'} - {filters.dateRange.end || '...'}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange('dateRange', {})}
              />
            </Badge>
          )}
          
          {(filters.priceRange.min || filters.priceRange.max) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Preço: R$ {filters.priceRange.min || 0} - R$ {filters.priceRange.max || '∞'}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange('priceRange', {})}
              />
            </Badge>
          )}
          
          {filters.school && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Escola: {filters.school}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange('school', '')}
              />
            </Badge>
          )}
          
          {filters.contact && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Contato: {filters.contact}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange('contact', '')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
})

AdvancedSearch.displayName = 'AdvancedSearch'

export default AdvancedSearch
