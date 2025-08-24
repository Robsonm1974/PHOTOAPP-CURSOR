import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateQRCode(): string {
  // Gera um código único de 6 dígitos
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('pt-BR')
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function parseCSV(csvText: string): Array<{ name: string; class: string; type: string }> {
  const lines = csvText.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim())
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim())
    return {
      name: values[0] || '',
      class: values[1] || '',
      type: values[2] || ''
    }
  }).filter(row => row.name && row.class && row.type)
}




