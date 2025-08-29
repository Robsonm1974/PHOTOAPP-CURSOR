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
  loginAsTest: () => void // Nova função para login de teste
  logout: () => void
  forceLogout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar sessão local ao carregar
  useEffect(() => {
    try {
      const raw = localStorage.getItem('auth:user')
      if (raw) {
        const parsed = JSON.parse(raw) as User
        setUser(parsed)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const persistUser = (u: User | null) => {
    if (u) localStorage.setItem('auth:user', JSON.stringify(u))
    else localStorage.removeItem('auth:user')
  }

  // Nova função para login automático de teste
  const loginAsTest = () => {
    const testUser: User = {
      id: 'test-user',
      email: 'teste@diadafoto.com',
      name: 'Usuário Teste'
    }
    setUser(testUser)
    persistUser(testUser)
    console.log('🧪 Login de teste ativado:', testUser)
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      })
      if (!res.ok) throw new Error('Credenciais inválidas')
      const data = await res.json()
      const u: User = { id: data.id, email: data.email, name: data.name }
      setUser(u)
      persistUser(u)
    } catch (error: any) {
      console.error('Erro no login:', error)
      throw new Error(error.message || 'Credenciais inválidas')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setUser(null)
      persistUser(null)
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      setUser(null)
      persistUser(null)
    }
  }

  const forceLogout = async () => {
    try {
      localStorage.clear()
      sessionStorage.clear()
      
      // Reset do estado
      setUser(null)
      persistUser(null)
      
      console.log('🧹 Logout forçado executado - cache limpo')
    } catch (error) {
      console.error('Erro no logout forçado:', error)
      // Limpar mesmo se der erro
      localStorage.clear()
      sessionStorage.clear()
      setUser(null)
      persistUser(null)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    loginAsTest, // Adicionar nova função
    logout,
    forceLogout,
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
