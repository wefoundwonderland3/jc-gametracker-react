'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Trophy, 
  Lock, 
  Star, 
  Target, 
  Gamepad2, 
  Clock,
  Award,
  Zap,
  Shield,
  Flame,
  Heart,
  Medal,
  Crown
} from 'lucide-react'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  requirement: number
  unlocked?: boolean
  unlockedAt?: Date
  progress?: number
}

interface AchievementBadgeProps {
  achievement: Achievement
  size?: 'sm' | 'md' | 'lg'
  showProgress?: boolean
  currentProgress?: number
}

const iconMap: { [key: string]: any } = {
  'Gamepad2': Gamepad2,
  'Clock': Clock,
  'Trophy': Trophy,
  'Star': Star,
  'Target': Target,
  'Award': Award,
  'Zap': Zap,
  'Shield': Shield,
  'Flame': Flame,
  'Heart': Heart,
  'Medal': Medal,
  'Crown': Crown
}

const colorMap: { [key: string]: string } = {
  'Gamepad2': 'bg-green-600',
  'Clock': 'bg-blue-600',
  'Trophy': 'bg-purple-600',
  'Star': 'bg-yellow-600',
  'Target': 'bg-red-600',
  'Award': 'bg-orange-600',
  'Zap': 'bg-cyan-600',
  'Shield': 'bg-indigo-600',
  'Flame': 'bg-red-700',
  'Heart': 'bg-pink-600',
  'Medal': 'bg-amber-600',
  'Crown': 'bg-yellow-700'
}

export function AchievementBadge({ 
  achievement, 
  size = 'md', 
  showProgress = false,
  currentProgress = 0 
}: AchievementBadgeProps) {
  const IconComponent = iconMap[achievement.icon] || Trophy
  const colorClass = colorMap[achievement.icon] || 'bg-gray-600'
  const isUnlocked = achievement.unlocked
  const progress = showProgress ? (currentProgress / achievement.requirement) * 100 : 0

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  }

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${sizeClasses[size]}`}>
        <div className={`
          ${sizeClasses[size]} rounded-full flex items-center justify-center transition-all duration-300
          ${isUnlocked 
            ? `${colorClass} shadow-lg shadow-${colorClass.replace('bg-', '')}/50` 
            : 'bg-gray-800 border-2 border-gray-700'
          }
        `}>
          <IconComponent 
            className={`
              ${iconSizes[size]} transition-all duration-300
              ${isUnlocked ? 'text-white' : 'text-gray-600'}
            `} 
          />
        </div>
        
        {!isUnlocked && (
          <div className="absolute -bottom-1 -right-1 bg-gray-700 rounded-full p-1">
            <Lock className="w-3 h-3 text-gray-500" />
          </div>
        )}
        
        {isUnlocked && (
          <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
            <Star className="w-3 h-3 text-white fill-white" />
          </div>
        )}
      </div>
      
      <div className="mt-2 text-center">
        <p className={`text-xs font-medium mb-1 ${
          isUnlocked ? 'text-white' : 'text-gray-500'
        }`}>
          {achievement.name}
        </p>
        
        {showProgress && !isUnlocked && (
          <div className="w-full">
            <Progress value={progress} className="h-1 mb-1" />
            <p className="text-xs text-gray-500">
              {currentProgress}/{achievement.requirement}
            </p>
          </div>
        )}
        
        {isUnlocked && achievement.unlockedAt && (
          <Badge variant="secondary" className="text-xs bg-green-600/20 text-green-400 border-green-600/30">
            Desbloqueado
          </Badge>
        )}
      </div>
    </div>
  )
}

interface AchievementGridProps {
  achievements: Achievement[]
  userStats?: {
    totalHours: number
    completedGames: number
    totalGames: number
    totalReviews: number
    uniqueGenres: number
  }
  size?: 'sm' | 'md' | 'lg'
  showProgress?: boolean
}

export function AchievementGrid({ 
  achievements, 
  userStats,
  size = 'md',
  showProgress = false 
}: AchievementGridProps) {
  const getProgressForAchievement = (achievement: Achievement) => {
    if (!userStats || achievement.unlocked) return 0

    if (achievement.name.includes('Novato')) {
      return userStats.totalGames
    } else if (achievement.name.includes('Maratón')) {
      return userStats.totalHours
    } else if (achievement.name.includes('Coleccionista')) {
      return userStats.totalGames
    } else if (achievement.name.includes('Crítico')) {
      return userStats.totalReviews
    } else if (achievement.name.includes('Explorador')) {
      return userStats.uniqueGenres
    } else if (achievement.name.includes('Leyenda')) {
      return userStats.totalHours
    }

    return 0
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length
  const progressPercentage = (unlockedCount / totalCount) * 100

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-lg">Progreso de Logros</h3>
            <Badge variant="outline" className="border-gray-700 text-gray-300">
              {unlockedCount} de {totalCount} desbloqueados
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <p className="text-gray-400 text-sm mt-2">
            {progressPercentage.toFixed(0)}% completado
          </p>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {achievements.map((achievement) => (
          <AchievementBadge
            key={achievement.id}
            achievement={achievement}
            size={size}
            showProgress={showProgress}
            currentProgress={getProgressForAchievement(achievement)}
          />
        ))}
      </div>
    </div>
  )
}

// Compact version for smaller spaces
interface AchievementCompactProps {
  achievement: Achievement
  currentProgress?: number
}

export function AchievementCompact({ achievement, currentProgress = 0 }: AchievementCompactProps) {
  const IconComponent = iconMap[achievement.icon] || Trophy
  const colorClass = colorMap[achievement.icon] || 'bg-gray-600'
  const isUnlocked = achievement.unlocked
  const progress = (currentProgress / achievement.requirement) * 100

  return (
    <Card className={`
      bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors
      ${isUnlocked ? 'ring-2 ring-green-600/30' : ''}
    `}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
            ${isUnlocked 
              ? `${colorClass} shadow-lg` 
              : 'bg-gray-800 border-2 border-gray-700'
            }
          `}>
            <IconComponent 
              className={`w-6 h-6 ${
                isUnlocked ? 'text-white' : 'text-gray-600'
              }`} 
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className={`font-medium text-sm mb-1 truncate ${
              isUnlocked ? 'text-white' : 'text-gray-500'
            }`}>
              {achievement.name}
            </h4>
            <p className="text-xs text-gray-400 mb-2">{achievement.description}</p>
            
            {!isUnlocked && (
              <div>
                <Progress value={progress} className="h-1 mb-1" />
                <p className="text-xs text-gray-500">
                  {currentProgress}/{achievement.requirement}
                </p>
              </div>
            )}
            
            {isUnlocked && (
              <Badge variant="secondary" className="text-xs bg-green-600/20 text-green-400 border-green-600/30">
                ✓ Desbloqueado
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}