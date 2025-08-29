'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Camera } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
  onRemove: () => void
  placeholder?: string
  recommendedSize?: string
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  placeholder = "Clique para fazer upload ou arraste uma imagem",
  recommendedSize = "300x300px",
  className
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (!file) return
    
    setIsUploading(true)
    
    // Simular upload - em produção, aqui você faria o upload real
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      onChange(result)
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  if (value) {
    return (
      <div className={cn("relative group", className)}>
        <div className="relative overflow-hidden rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors">
          <img
            src={value}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleClick}
                className="bg-white/90 hover:bg-white text-gray-900"
              >
                <Camera className="h-4 w-4 mr-1" />
                Alterar
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={onRemove}
                className="bg-red-500/90 hover:bg-red-500 text-white"
              >
                <X className="h-4 w-4 mr-1" />
                Remover
              </Button>
            </div>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileSelect(file)
          }}
          className="hidden"
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer",
        isDragOver
          ? "border-blue-400 bg-blue-50"
          : "border-gray-300 hover:border-gray-400 hover:bg-gray-50",
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileSelect(file)
        }}
        className="hidden"
      />
      
      <div className="space-y-3">
        {isUploading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                {placeholder}
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG até 10MB
              </p>
              <p className="text-xs text-gray-400">
                Recomendado: {recommendedSize}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
            >
              <Upload className="h-4 w-4 mr-2" />
              Escolher arquivo
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
