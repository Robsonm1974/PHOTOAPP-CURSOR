'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Simular verificação de autenticação ao carregar
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch (error) {
          localStorage.removeItem('user')
        }
      }
      setIsLoading(false)
    }

    // Simular um pequeno delay para evitar flash
    const timer = setTimeout(checkAuth, 100)
    return () => clearTimeout(timer)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    
    try {
      // Simular delay de autenticação
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Simular validação básica
      if (email === 'robsonm1974@gmail.com' && password === '1234') {
        const userData: User = {
          id: '00000000-0000-0000-0000-000000000001',
          email: 'robsonm1974@gmail.com',
          name: 'Robson Martins'
        }
        
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
      } else {
        throw new Error('Credenciais inválidas')
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
