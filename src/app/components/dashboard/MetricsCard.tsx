import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/app/components/ui/card'

interface MetricsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  gradient: string
  iconColor: string
}

const MetricsCard = React.memo(({ title, value, icon: Icon, gradient, iconColor }: MetricsCardProps) => {
  return (
    <Card className={`border-0 ${gradient}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium mb-1 ${iconColor.replace('bg-', 'text-')}`}>
              {title}
            </p>
            <p className={`text-3xl font-bold ${iconColor.replace('bg-', 'text-').replace('500', '900')}`}>
              {value}
            </p>
          </div>
          <div className={`p-3 ${iconColor} rounded-xl`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

MetricsCard.displayName = 'MetricsCard'

export default MetricsCard
