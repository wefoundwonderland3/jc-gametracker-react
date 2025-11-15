'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Play, Clock, Plus, Check, X } from 'lucide-react'
import { Game } from '@prisma/client'

interface GameCardProps {
  game: Game & {
    reviews?: Array<{ rating: number }>
  }
  onClick?: () => void
  onAddToList?: () => void
  onRemoveFromList?: () => void
  isInList?: boolean
  isAdding?: boolean
  showRemoveButton?: boolean // Para mostrar botón de remover en "Mi Lista"
}

export function GameCard({ game, onClick, onAddToList, onRemoveFromList, isInList = false, isAdding = false, showRemoveButton = false }: GameCardProps) {
  const averageRating = game.reviews?.length 
    ? game.reviews.reduce((acc, review) => acc + review.rating, 0) / game.reviews.length 
    : game.rating

  // Función para obtener src seguro para la imagen
  const getImageSrc = (src: string) => {
    // Si es una URL externa o nuestro placeholder, usar img tag normal
    if (src.startsWith('http') || src.startsWith('/placeholder-')) {
      return src
    }
    // Para otras imágenes locales, usarlas directamente
    return src
  }

  const isExternalImage = game.coverImage?.startsWith('http') || game.coverImage?.startsWith('/placeholder-')

  return (
    <Card 
      className="bg-gray-900 border-gray-800 overflow-hidden cursor-pointer group hover:scale-105 transition-all duration-300 hover:z-10"
      onClick={onClick}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        {isExternalImage ? (
          // Usar img tag para imágenes externas
          <img
            src={getImageSrc(game.coverImage || '/placeholder-game.jpg')}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              // Si falla la carga, usar placeholder
              e.currentTarget.src = '/placeholder-game.jpg'
            }}
          />
        ) : (
          // Usar Next.js Image solo para imágenes locales
          <Image
            src={game.coverImage || '/placeholder-game.jpg'}
            alt={game.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              // Si falla la carga, usar placeholder
              e.currentTarget.src = '/placeholder-game.jpg'
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-white text-sm font-semibold">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              {game.completed && (
                <Badge variant="secondary" className="bg-green-600 text-white">
                  Completado
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Clock className="w-4 h-4" />
              <span>{game.hoursPlayed}h</span>
            </div>
          </div>
        </div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex flex-col gap-2">
            {/* Botón de play (siempre visible) */}
            <Button
              size="icon"
              className="h-10 w-10 rounded-full bg-red-600 hover:bg-red-700 text-white border border-white/20 backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation()
                onClick?.()
              }}
            >
              <Play className="w-4 h-4" />
            </Button>
            
            {/* Botón de añadir o remover */}
            {showRemoveButton ? (
              // Botón de remover para "Mi Lista"
              <Button
                size="icon"
                className="h-8 w-8 rounded-full bg-red-600 hover:bg-red-700 text-white border border-white/20 backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveFromList?.()
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            ) : (
              // Botón de añadir para secciones de descubrimiento
              <Button
                size="icon"
                className="h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-sm flex items-center justify-center p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  onAddToList?.()
                }}
                disabled={isInList || isAdding}
              >
                {isAdding ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : isInList ? (
                  <Check className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <Plus className="w-4 h-4 flex-shrink-0" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="text-white font-semibold text-sm truncate mb-1">
          {game.title}
        </h3>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs border-gray-700 text-gray-400">
            {game.genre}
          </Badge>
          <Badge variant="outline" className="text-xs border-gray-700 text-gray-400">
            {game.platform}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}