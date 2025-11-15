'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRef } from 'react'
import { Game } from '@prisma/client'
import { GameCard } from './game-card'

interface GameCarouselProps {
  title: string
  games: Array<Game & {
    reviews?: Array<{ rating: number }>
  }>
  onGameClick?: (game: Game) => void
  onAddToList?: (game: Game) => void
  onRemoveFromList?: (gameId: string, gameTitle: string) => void
  gamesInList?: string[]
  addingToList?: string | null
  showRemoveButton?: boolean
}

export function GameCarousel({ title, games, onGameClick, onAddToList, onRemoveFromList, gamesInList = [], addingToList = null, showRemoveButton = false }: GameCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75
      
      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      })
    }
  }

  // No mostrar el carrusel si no hay juegos
  if (!games || games.length === 0) {
    return null
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-xl font-bold">{title}</h2>
        {games.length > 3 && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/10 hover:bg-white/20 text-white rounded-full"
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/10 hover:bg-white/20 text-white rounded-full"
              onClick={() => scroll('right')}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {games.map((game) => (
          <div key={game.id} className="flex-none w-48">
            <GameCard 
              game={game} 
              onClick={() => onGameClick?.(game)}
              onAddToList={() => onAddToList?.(game)}
              onRemoveFromList={() => onRemoveFromList?.(game.id, game.title)}
              isInList={gamesInList.includes(game.id)}
              isAdding={addingToList === game.id}
              showRemoveButton={showRemoveButton}
            />
          </div>
        ))}
      </div>
    </div>
  )
}