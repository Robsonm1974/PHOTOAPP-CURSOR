'use client'

import { useEvents } from '@/app/contexts/EventsContext'

interface WatermarkedImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}

export default function WatermarkedImage({ 
  src, 
  alt, 
  className = '',
  width,
  height 
}: WatermarkedImageProps) {
  const { appConfig } = useEvents()

  return (
    <div className={`relative inline-block ${className}`}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-cover"
      />
      
      {/* Watermark Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {appConfig.watermark ? (
          // Custom watermark image
          <img
            src={appConfig.watermark}
            alt="Watermark"
            className="w-1/2 h-1/2 object-contain opacity-50"
          />
        ) : (
          // Default text watermark
          <div className="text-white text-4xl font-bold text-center bg-black bg-opacity-30 px-4 py-2 rounded-lg opacity-70 select-none">
            PHOTO APP
          </div>
        )}
      </div>
    </div>
  )
}




