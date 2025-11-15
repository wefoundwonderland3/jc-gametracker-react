'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ReviewList } from '@/components/review-card'
import { ReviewForm } from '@/components/review-form'
import { X, Star, Calendar, Clock, Trophy, MessageSquare, Plus } from 'lucide-react'
import { Game, Review } from '@prisma/client'

interface GameDetailModalProps {
  game: Game & {
    reviews?: Array<Review & {
      user: {
        id: string
        name: string
        avatar?: string
      }
    }>
  }
  isOpen: boolean
  onClose: () => void
  onAddReview: (reviewData: any) => void
  onEditReview?: (review: Review) => void
  onDeleteReview?: (reviewId: string) => void
  currentUserId?: string
}

export function GameDetailModal({ 
  game, 
  isOpen, 
  onClose, 
  onAddReview,
  onEditReview,
  onDeleteReview,
  currentUserId = '1'
}: GameDetailModalProps) {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  }

  const handleAddReview = () => {
    setEditingReview(null)
    setIsReviewFormOpen(true)
  }

  const handleEditReview = (review: Review) => {
    setEditingReview(review)
    setIsReviewFormOpen(true)
  }

  const handleReviewSubmit = (reviewData: any) => {
    onAddReview(reviewData)
    setIsReviewFormOpen(false)
    setEditingReview(null)
  }

  const averageRating = game.reviews?.length 
    ? game.reviews.reduce((acc, review) => acc + review.rating, 0) / game.reviews.length 
    : game.rating

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{game.title}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Game Info */}
            <div className="lg:col-span-1">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-4">
                <img
                  src={game.coverImage || '/placeholder-game.jpg'}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-white font-semibold">
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                  {game.completed && (
                    <Badge className="bg-green-600 text-white">Completado</Badge>
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{game.releaseDate ? formatDate(game.releaseDate) : 'Sin fecha'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{game.hoursPlayed}h jugadas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    <span>{game.genre}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Badge variant="outline" className="border-gray-700 text-gray-400">
                    {game.platform}
                  </Badge>
                </div>

                {game.description && (
                  <div>
                    <h4 className="text-white font-semibold mb-2">Descripción</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {game.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Reseñas</h3>
                  <p className="text-gray-400 text-sm">
                    {game.reviews?.length || 0} reseñas • {averageRating.toFixed(1)} promedio
                  </p>
                </div>
                
                <Button
                  onClick={handleAddReview}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Escribir Reseña
                </Button>
              </div>

              <ReviewList
                reviews={game.reviews || []}
                currentUserId={currentUserId}
                onEditReview={onEditReview || handleEditReview}
                onDeleteReview={onDeleteReview}
                onReplyToReview={() => {}} // TODO: Implement replies
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ReviewForm
        gameId={game.id}
        userId={currentUserId}
        review={editingReview || undefined}
        isOpen={isReviewFormOpen}
        onClose={() => {
          setIsReviewFormOpen(false)
          setEditingReview(null)
        }}
        onSubmit={handleReviewSubmit}
        isEditing={!!editingReview}
      />
    </>
  )
}