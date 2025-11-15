'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { ReviewList } from '@/components/review-card'
import { ReviewForm, ReviewFormTrigger } from '@/components/review-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Plus, MessageSquare, Star } from 'lucide-react'
import { Review } from '@prisma/client'

// Datos de ejemplo
const mockReviews: Array<Review & {
  user: {
    id: string
    name: string
    avatar?: string
  }
  game: {
    id: string
    title: string
    coverImage?: string
  }
}> = [
  {
    id: '1',
    title: 'Una obra maestra del gaming',
    content: 'Baldur\'s Gate 3 es simplemente excepcional. La narrativa, los personajes, las decisiones que impactan realmente en la historia... todo está al nivel más alto. La libertad para abordar las situaciones de múltiples maneras hace que cada partida sea única.',
    rating: 5,
    gameId: '2',
    userId: '1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    user: {
      id: '1',
      name: 'Gamer Pro',
      avatar: '/placeholder-avatar.jpg'
    },
    game: {
      id: '2',
      title: 'Baldur\'s Gate 3',
      coverImage: '/placeholder-game.jpg'
    }
  },
  {
    id: '2',
    title: 'Desafiante pero gratificante',
    content: 'Elden Ring me ha costado mucho, pero cada victoria se siente merecida. El mundo es espectacular y la exploración es constante. Los jefes son épicos aunque a veces frustrantes. Recomendado para quienes buscan un desafío.',
    rating: 4,
    gameId: '3',
    userId: '2',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    user: {
      id: '2',
      name: 'Casual Gamer',
      avatar: '/placeholder-avatar.jpg'
    },
    game: {
      id: '3',
      title: 'Elden Ring',
      coverImage: '/placeholder-game.jpg'
    }
  },
  {
    id: '3',
    title: 'El final de una saga legendaria',
    content: 'God of War: Ragnarök cierra esta etapa de Kratos de manera espectacular. La historia es emocionante, los gráficos son impresionantes y el gameplay sigue siendo sólido. La relación entre Kratos y Atreus es el corazón del juego.',
    rating: 5,
    gameId: '4',
    userId: '1',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    user: {
      id: '1',
      name: 'Gamer Pro',
      avatar: '/placeholder-avatar.jpg'
    },
    game: {
      id: '4',
      title: 'God of War: Ragnarök',
      coverImage: '/placeholder-game.jpg'
    }
  }
]

export default function Reseñas() {
  const [reviews, setReviews] = useState(mockReviews)
  const [filteredReviews, setFilteredReviews] = useState(mockReviews)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGame, setSelectedGame] = useState('all')
  const [selectedRating, setSelectedRating] = useState('all')
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [selectedGameId, setSelectedGameId] = useState('')

  // Mock games for filter
  const games = [
    { id: 'all', title: 'Todos los juegos' },
    { id: '2', title: 'Baldur\'s Gate 3' },
    { id: '3', title: 'Elden Ring' },
    { id: '4', title: 'God of War: Ragnarök' }
  ]

  const ratings = [
    { value: 'all', label: 'Todas las calificaciones' },
    { value: '5', label: '5 estrellas' },
    { value: '4', label: '4 estrellas' },
    { value: '3', label: '3 estrellas' },
    { value: '2', label: '2 estrellas' },
    { value: '1', label: '1 estrella' }
  ]

  useEffect(() => {
    let filtered = reviews

    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedGame !== 'all') {
      filtered = filtered.filter(review => review.gameId === selectedGame)
    }

    if (selectedRating !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(selectedRating))
    }

    setFilteredReviews(filtered)
  }, [reviews, searchTerm, selectedGame, selectedRating])

  const handleReviewSubmit = async (reviewData: any) => {
    try {
      // TODO: Replace with actual API call
      console.log('Adding review:', reviewData)
      
      // For now, just add to local state
      const newReview = {
        ...reviewData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: '1',
          name: 'Gamer Pro',
          avatar: '/placeholder-avatar.jpg'
        },
        game: {
          id: reviewData.gameId,
          title: games.find(g => g.id === reviewData.gameId)?.title || 'Unknown Game',
          coverImage: '/placeholder-game.jpg'
        }
      }
      
      setReviews(prev => [newReview, ...prev])
    } catch (error) {
      console.error('Error adding review:', error)
    }
  }

  const handleEditReview = (review: Review) => {
    setEditingReview(review)
    setSelectedGameId(review.gameId)
    setIsReviewFormOpen(true)
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      try {
        // TODO: Replace with actual API call
        console.log('Deleting review:', reviewId)
        setReviews(prev => prev.filter(r => r.id !== reviewId))
      } catch (error) {
        console.error('Error deleting review:', error)
      }
    }
  }

  const handleReplyToReview = (reviewId: string) => {
    console.log('Replying to review:', reviewId)
    // TODO: Implement reply functionality
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-white text-4xl font-bold mb-2">Reseñas de la Comunidad</h1>
            <div className="flex gap-4 text-white/60">
              <span>{reviews.length} reseñas</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>{averageRating.toFixed(1)} promedio</span>
              </div>
            </div>
          </div>
          
          <ReviewFormTrigger onOpen={() => {
            setEditingReview(null)
            setSelectedGameId('')
            setIsReviewFormOpen(true)
          }}>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="w-5 h-5 mr-2" />
              Escribir Reseña
            </Button>
          </ReviewFormTrigger>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                Total Reseñas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{reviews.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Star className="w-5 h-5 text-yellow-500" />
                Calificación Promedio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{averageRating.toFixed(1)}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Star className="w-5 h-5 text-green-500" />
                5 Estrellas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {reviews.filter(r => r.rating === 5).length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Star className="w-5 h-5 text-orange-500" />
                4+ Estrellas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {reviews.filter(r => r.rating >= 4).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar reseñas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
              
              <Select value={selectedGame} onValueChange={setSelectedGame}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Filtrar por juego" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {games.map(game => (
                    <SelectItem key={game.id} value={game.id} className="text-white hover:bg-gray-700">
                      {game.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedRating} onValueChange={setSelectedRating}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Filtrar por calificación" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {ratings.map(rating => (
                    <SelectItem key={rating.value} value={rating.value} className="text-white hover:bg-gray-700">
                      {rating.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <ReviewList
          reviews={filteredReviews}
          currentUserId="1" // Mock current user
          onEditReview={handleEditReview}
          onDeleteReview={handleDeleteReview}
          onReplyToReview={handleReplyToReview}
        />
      </div>

      <ReviewForm
        gameId={selectedGameId || games[1]?.id || ''} // Default to first game if none selected
        userId="1" // Mock user ID
        review={editingReview || undefined}
        isOpen={isReviewFormOpen}
        onClose={() => {
          setIsReviewFormOpen(false)
          setEditingReview(null)
          setSelectedGameId('')
        }}
        onSubmit={handleReviewSubmit}
        isEditing={!!editingReview}
      />
    </div>
  )
}