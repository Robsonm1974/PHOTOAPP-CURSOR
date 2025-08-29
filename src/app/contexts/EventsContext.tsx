'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface Event {
  id: string
  title: string
  startDate: string
  endDate?: string
  schoolId: string // Agora referencia a escola
  school: string // Mantido para compatibilidade
  contact: string
  phone: string
  commission: number // Agora em porcentagem
  photoPrice: number
  notes?: string
  participantsCount: number
  status: 'active' | 'upcoming' | 'completed'
}

export interface Participant {
  id: string
  eventId: string
  name: string
  class: string
  type: 'aluno' | 'professor' | 'funcionario' | 'outro'
  qrCode: string
  photos: string[]
  profilePhoto?: string
}

export interface PhotoSale {
  id: string
  participantId: string
  eventId: string
  schoolId: string
  photoUrl: string
  price: number
  soldAt: string
  commissionAmount: number
  netAmount: number
  status: 'pending' | 'paid' | 'cancelled'
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: 'photo' | 'package' | 'upsell'
  image?: string
  isActive: boolean
}

export interface School {
  id: string
  name: string
  address: string
  city: string
  state: string
  cnpj?: string
  pixKey?: string
  phone: string
  type: 'publica' | 'privada'
  education: ('infantil' | 'fundamental' | 'medio')[]
  studentCount: number
  observations?: string
  instagram?: string
  facebook?: string
  whatsapp?: string
  director: string
  directorMessage?: string
  directorPhoto?: string
  schoolImage?: string
  featuredImages?: string[]
}

export interface AppConfig {
  whatsappNumber: string
  appName: string
  appVersion: string
  appUrl?: string
  appLogo?: string
  watermark?: string
}

interface EventsContextType {
  events: Event[]
  participants: Participant[]
  products: Product[]
  schools: School[]
  photoSales: PhotoSale[]
  appConfig: AppConfig
  addEvent: (event: Omit<Event, 'id' | 'participantsCount' | 'status'>) => void
  updateEvent: (id: string, updates: Partial<Event>) => void
  deleteEvent: (id: string) => void
  addParticipant: (participant: Omit<Participant, 'id' | 'qrCode'>) => void
  addParticipantsBatch: (participants: Omit<Participant, 'id' | 'qrCode'>[]) => void
  updateParticipant: (id: string, updates: Partial<Participant>) => void
  updateParticipantProfilePhoto: (participantId: string, profilePhoto: string) => void
  deleteParticipant: (id: string) => void
  addPhotosToParticipant: (participantId: string, photos: string[]) => void
  getParticipantsByEvent: (eventId: string) => Participant[]
  generateQRCode: () => string
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  searchParticipants: (query: string, type: 'qrcode' | 'name' | 'class' | 'school') => Participant[]
  addSchool: (school: Omit<School, 'id'>) => void
  updateSchool: (id: string, updates: Partial<School>) => void
  deleteSchool: (id: string) => void
  updateAppConfig: (updates: Partial<AppConfig>) => void
  addPhotoSale: (sale: Omit<PhotoSale, 'id' | 'commissionAmount' | 'netAmount'>) => void
  updatePhotoSale: (id: string, updates: Partial<PhotoSale>) => void
  getPhotoSalesBySchool: (schoolId: string) => PhotoSale[]
  getPhotoSalesByEvent: (eventId: string) => PhotoSale[]
  calculateSchoolRevenue: (schoolId: string) => { totalSales: number; totalCommission: number; netRevenue: number }
}

const EventsContext = createContext<EventsContextType | undefined>(undefined)

const initialEvents: Event[] = [
  {
    id: '1',
    title: 'Dia da Foto - Escola Primária',
    startDate: '2024-03-10',
    endDate: '2024-03-10',
    schoolId: '1',
    school: 'Escola Primária Sol Nascente',
    contact: 'Maria Silva',
    phone: '(11) 99999-9999',
    commission: 15.0, // 15% de comissão
    photoPrice: 25.0,
    notes: 'Evento anual para fotos de turma e individuais.',
    participantsCount: 45,
    status: 'active',
  },
  {
    id: '2',
    title: 'Formatura - Colégio Estadual',
    startDate: '2024-07-15',
    endDate: '2024-07-17',
    schoolId: '2',
    school: 'Colégio Estadual Futuro Brilhante',
    contact: 'João Santos',
    phone: '(11) 88888-8888',
    commission: 20.0, // 20% de comissão
    photoPrice: 30.0,
    notes: 'Sessões de fotos para formandos do 3º ano do ensino médio.',
    participantsCount: 120,
    status: 'upcoming',
  },
]

const initialParticipants: Participant[] = [
  {
    id: 'p1',
    eventId: '1',
    name: 'Ana Clara',
    class: '3º Ano A',
    type: 'aluno',
    qrCode: '123456',
    photos: ['/photos/ana_clara_1.jpg', '/photos/ana_clara_2.jpg'],
    profilePhoto: '/photos/ana_clara_1.jpg'
  },
  {
    id: 'p2',
    eventId: '1',
    name: 'Bruno Lima',
    class: '3º Ano A',
    type: 'aluno',
    qrCode: '654321',
    photos: ['/photos/bruno_lima_1.jpg'],
    profilePhoto: '/photos/bruno_lima_1.jpg'
  },
  {
    id: 'p3',
    eventId: '1',
    name: 'Carlos Eduardo',
    class: '4º Ano B',
    type: 'aluno',
    qrCode: '112233',
    photos: [],
    profilePhoto: undefined
  },
  {
    id: 'p4',
    eventId: '2',
    name: 'Daniela Pereira',
    class: '3º EM C',
    type: 'aluno',
    qrCode: '987654',
    photos: ['/photos/daniela_1.jpg', '/photos/daniela_2.jpg', '/photos/daniela_3.jpg'],
    profilePhoto: '/photos/daniela_1.jpg'
  },
]

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Pacote Básico',
    description: '5 fotos digitais + 1 impressa',
    price: 99.90,
    category: 'package',
    image: '/images/products/pacote-basico.jpg',
    isActive: true
  },
  {
    id: '2',
    name: 'Pacote Premium',
    description: '10 fotos digitais + 3 impressas + álbum',
    price: 199.90,
    category: 'package',
    image: '/images/products/pacote-premium.jpg',
    isActive: true
  },
  {
    id: '3',
    name: 'Foto Individual',
    description: '1 foto digital de alta resolução',
    price: 15.90,
    category: 'photo',
    image: '/images/products/foto-individual.jpg',
    isActive: true
  },
  {
    id: '4',
    name: 'Álbum Personalizado',
    description: 'Álbum com 20 fotos + capa personalizada',
    price: 89.90,
    category: 'upsell',
    image: '/images/products/album-personalizado.jpg',
    isActive: true
  }
]

const initialSchools: School[] = [
  {
    id: '1',
    name: 'Escola Primária Sol Nascente',
    address: 'Rua das Flores, 123 - Centro',
    city: 'São Paulo',
    state: 'SP',
    cnpj: '12.345.678/0001-90',
    pixKey: 'escola.sol.nascente@email.com',
    phone: '(11) 99999-9999',
    type: 'publica',
    education: ['infantil', 'fundamental'],
    studentCount: 450,
    observations: 'Escola com foco em educação infantil e fundamental I.',
    instagram: '@escolasolnascente',
    facebook: 'Escola Sol Nascente',
    whatsapp: '(11) 99999-9999',
    director: 'Maria Silva',
    directorMessage: 'Bem-vindos à nossa escola! Nosso compromisso é com a excelência educacional.',
    directorPhoto: '/images/directors/maria-silva.jpg',
    schoolImage: '/images/school1.jpg',
    featuredImages: ['/images/schools/sol-nascente-1.jpg', '/images/schools/sol-nascente-2.jpg']
  },
  {
    id: '2',
    name: 'Colégio Estadual Futuro Brilhante',
    address: 'Av. Principal, 456 - Jardim Europa',
    city: 'São Paulo',
    state: 'SP',
    cnpj: '98.765.432/0001-10',
    pixKey: 'futuro.brilhante@email.com',
    phone: '(11) 88888-8888',
    type: 'publica',
    education: ['fundamental', 'medio'],
    studentCount: 1200,
    observations: 'Colégio com ensino fundamental II e médio completo.',
    instagram: '@colegiofuturobrilhante',
    facebook: 'Colégio Futuro Brilhante',
    whatsapp: '(11) 88888-8888',
    director: 'João Santos',
    directorMessage: 'Preparando jovens para um futuro brilhante através da educação de qualidade.',
    directorPhoto: '/images/directors/joao-santos.jpg',
    schoolImage: '/images/school2.jpg',
    featuredImages: ['/images/schools/futuro-brilhante-1.jpg', '/images/schools/futuro-brilhante-2.jpg']
  }
]

const initialAppConfig: AppConfig = {
  whatsappNumber: '5511999999999',
  appName: 'Dia da Foto',
  appVersion: '1.0.0',
  appUrl: 'https://diadafoto.com.br'
}

const initialPhotoSales: PhotoSale[] = [
  {
    id: '1',
    participantId: 'p1',
    eventId: '1',
    schoolId: '1',
    photoUrl: '/photos/ana_clara_1.jpg',
    price: 25.0,
    soldAt: '2024-03-15',
    commissionAmount: 3.75, // 15% de 25.00
    netAmount: 21.25,
    status: 'paid'
  },
  {
    id: '2',
    participantId: 'p2',
    eventId: '1',
    schoolId: '1',
    photoUrl: '/photos/bruno_lima_1.jpg',
    price: 25.0,
    soldAt: '2024-03-16',
    commissionAmount: 3.75,
    netAmount: 21.25,
    status: 'paid'
  },
  {
    id: '3',
    participantId: 'p4',
    eventId: '2',
    schoolId: '2',
    photoUrl: '/photos/daniela_1.jpg',
    price: 30.0,
    soldAt: '2024-03-20',
    commissionAmount: 6.0, // 20% de 30.00
    netAmount: 24.0,
    status: 'paid'
  }
]

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants)
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [schools, setSchools] = useState<School[]>(initialSchools)
  const [photoSales, setPhotoSales] = useState<PhotoSale[]>(initialPhotoSales)
  const [appConfig, setAppConfig] = useState<AppConfig>(initialAppConfig)

  // Carregar eventos do banco local
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await fetch('/api/events')
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length) setEvents(data)
        }
      } catch {}
    }
    loadEvents()
  }, [])

  const generateQRCode = (): string => {
    let code: string
    do {
      code = Math.floor(100000 + Math.random() * 900000).toString()
    } while (participants.some(p => p.qrCode === code))
    return code
  }

  const addEvent = (eventData: Omit<Event, 'id' | 'participantsCount' | 'status'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      participantsCount: 0,
      status: 'upcoming',
    }
    setEvents(prev => [...prev, newEvent])
    // Persistir
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent)
    }).catch(() => {})
  }

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents(prev => prev.map(event =>
      event.id === id ? { ...event, ...updates } : event
    ))
  }

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id))
    setParticipants(prev => prev.filter(participant => participant.eventId !== id))
  }

  const addParticipant = (participantData: Omit<Participant, 'id' | 'qrCode'>) => {
    const newParticipant: Participant = {
      ...participantData,
      id: Date.now().toString(),
      qrCode: generateQRCode(),
    }
    setParticipants(prev => [...prev, newParticipant])
    setEvents(prev => prev.map(event =>
      event.id === participantData.eventId
        ? { ...event, participantsCount: event.participantsCount + 1 }
        : event
    ))
    // Persistir
    fetch('/api/participants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newParticipant)
    }).catch(() => {})
  }

  const addParticipantsBatch = (participantsData: Omit<Participant, 'id' | 'qrCode'>[]) => {
    const newParticipants: Participant[] = participantsData.map(data => ({
      ...data,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      qrCode: generateQRCode(),
    }))

    setParticipants(prev => [...prev, ...newParticipants])

    if (newParticipants.length > 0) {
      const eventId = newParticipants[0].eventId
      setEvents(prev => prev.map(event =>
        event.id === eventId
          ? { ...event, participantsCount: event.participantsCount + newParticipants.length }
          : event
      ))
    }

    // Persistir
    newParticipants.forEach(np => {
      fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(np)
      }).catch(() => {})
    })
  }

  const updateParticipant = (id: string, updates: Partial<Participant>) => {
    setParticipants(prev => prev.map(participant =>
      participant.id === id ? { ...participant, ...updates } : participant
    ))
  }

  const updateParticipantProfilePhoto = (participantId: string, profilePhoto: string) => {
    setParticipants(prev => prev.map(participant =>
      participant.id === participantId
        ? { ...participant, profilePhoto }
        : participant
    ))
  }

  const deleteParticipant = (id: string) => {
    const participantToDelete = participants.find(p => p.id === id)
    if (participantToDelete) {
      setParticipants(prev => prev.filter(participant => participant.id !== id))
      setEvents(prev => prev.map(event =>
        event.id === participantToDelete.eventId
          ? { ...event, participantsCount: event.participantsCount - 1 }
          : event
      ))
    }
  }

  const addPhotosToParticipant = (participantId: string, newPhotos: string[]) => {
    setParticipants(prev => prev.map(participant =>
      participant.id === participantId
        ? { ...participant, photos: [...participant.photos, ...newPhotos] }
        : participant
    ))
  }

  const getParticipantsByEvent = (eventId: string): Participant[] => {
    return participants.filter(participant => participant.eventId === eventId)
  }

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString()
    }
    setProducts(prev => [...prev, newProduct])
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product =>
      product.id === id ? { ...product, ...updates } : product
    ))
  }

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id))
  }

  const searchParticipants = (query: string, type: 'qrcode' | 'name' | 'class' | 'school'): Participant[] => {
    const searchTerm = query.toLowerCase().trim()

    return participants.filter(participant => {
      const event = events.find(e => e.id === participant.eventId)

      switch (type) {
        case 'qrcode':
          return participant.qrCode === searchTerm
        case 'name':
          return participant.name.toLowerCase().includes(searchTerm)
        case 'class':
          return participant.class.toLowerCase().includes(searchTerm)
        case 'school':
          return event?.school.toLowerCase().includes(searchTerm) || false
        default:
          return false
      }
    })
  }

  const addSchool = (schoolData: Omit<School, 'id'>) => {
    const newSchool: School = {
      ...schoolData,
      id: Date.now().toString()
    }
    setSchools(prev => [...prev, newSchool])
  }

  const updateSchool = (id: string, updates: Partial<School>) => {
    setSchools(prev => prev.map(school =>
      school.id === id ? { ...school, ...updates } : school
    ))
  }

  const deleteSchool = (id: string) => {
    setSchools(prev => prev.filter(school => school.id !== id))
  }

  const updateAppConfig = (updates: Partial<AppConfig>) => {
    setAppConfig(prev => ({ ...prev, ...updates }))
  }

  const addPhotoSale = (saleData: Omit<PhotoSale, 'id' | 'commissionAmount' | 'netAmount'>) => {
    // Encontrar o evento para obter a porcentagem de comissão
    const event = events.find(e => e.id === saleData.eventId)
    if (!event) {
      console.error('Evento não encontrado para calcular comissão')
      return
    }

    // Calcular comissão baseada na porcentagem do evento
    const commissionAmount = (saleData.price * event.commission) / 100
    const netAmount = saleData.price - commissionAmount

    const newSale: PhotoSale = {
      ...saleData,
      id: Date.now().toString(),
      commissionAmount,
      netAmount,
      status: 'pending'
    }
    setPhotoSales(prev => [...prev, newSale])
  }

  const updatePhotoSale = (id: string, updates: Partial<PhotoSale>) => {
    setPhotoSales(prev => prev.map(sale =>
      sale.id === id ? { ...sale, ...updates } : sale
    ))
  }

  const getPhotoSalesBySchool = (schoolId: string): PhotoSale[] => {
    return photoSales.filter(sale => sale.schoolId === schoolId)
  }

  const getPhotoSalesByEvent = (eventId: string): PhotoSale[] => {
    return photoSales.filter(sale => sale.eventId === eventId)
  }

  const calculateSchoolRevenue = (schoolId: string): { totalSales: number; totalCommission: number; netRevenue: number } => {
    const sales = getPhotoSalesBySchool(schoolId)
    let totalSales = 0
    let totalCommission = 0

    sales.forEach(sale => {
      totalSales += sale.price
      totalCommission += sale.commissionAmount
    })

    return {
      totalSales,
      totalCommission,
      netRevenue: totalSales - totalCommission
    }
  }

  const value: EventsContextType = {
    events,
    participants,
    products,
    schools,
    photoSales,
    appConfig,
    addEvent,
    updateEvent,
    deleteEvent,
    addParticipant,
    addParticipantsBatch,
    updateParticipant,
    updateParticipantProfilePhoto,
    deleteParticipant,
    addPhotosToParticipant,
    getParticipantsByEvent,
    generateQRCode,
    addProduct,
    updateProduct,
    deleteProduct,
    searchParticipants,
    addSchool,
    updateSchool,
    deleteSchool,
    updateAppConfig,
    addPhotoSale,
    updatePhotoSale,
    getPhotoSalesBySchool,
    getPhotoSalesByEvent,
    calculateSchoolRevenue
  }

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  )
}

export function useEvents() {
  const context = useContext(EventsContext)
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventsProvider')
  }
  return context
}
