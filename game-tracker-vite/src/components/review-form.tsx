'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Star, X, MessageSquare } from 'lucide-react'
import { Review } from '@prisma/client'

interface ReviewFormData {
  title: string
  content: string
  rating: number
  gameId: string
  userId: string
}

interface ReviewFormProps {
  gameId: string
  userId: string
  review?: Review
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ReviewFormData) => void
  isEditing?: boolean
}

export function ReviewForm({ gameId, userId, review, isOpen, onClose, onSubmit, isEditing = false }: ReviewFormProps) {
  const [formData, setFormData] = useState<ReviewFormData>({
    title: review?.title || '',
    content: review?.content || '',
    rating: review?.rating || 0,
    gameId,
    userId
  })

  const [hoveredStar, setHoveredStar] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.rating === 0) {
      alert('Por favor selecciona una calificación')
      return
    }
    
    onSubmit(formData)
    onClose()
    
    // Reset form if not editing
    if (!isEditing) {
      setFormData({
        title: '',
        content: '',
        rating: 0,
        gameId,
        userId
      })
    }
  }

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }))
  }

  const handleChange = (field: keyof ReviewFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            {isEditing ? 'Editar Reseña' : 'Escribir Reseña'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Calificación *</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="transition-transform hover:scale-110"
                  onClick={() => handleRatingChange(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredStar || formData.rating)
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-white/60">
                {formData.rating > 0 ? `${formData.rating} de 5 estrellas` : 'Selecciona una calificación'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título de la Reseña *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Escribe un título para tu reseña..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenido de la Reseña *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              className="bg-gray-800 border-gray-700 text-white min-h-[150px]"
              placeholder="Comparte tu experiencia con este juego..."
              required
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={formData.rating === 0 || !formData.title.trim() || !formData.content.trim()}
            >
              {isEditing ? 'Actualizar Reseña' : 'Publicar Reseña'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}