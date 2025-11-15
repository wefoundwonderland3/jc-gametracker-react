import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { GameCarousel } from '@/components/game-carousel'
import { GameCard } from '@/components/game-card'
import { GameForm } from '@/components/game-form'
import { GameDetailModal } from '@/components/game-detail-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Play, Plus, Star, Search, Filter, Grid, List, Eye, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { authService } from '@/lib/api'

// Datos de ejemplo
const featuredGames = [
  {
    id: '1',
    title: 'The Legend of Zelda: Tears of the Kingdom',
    description: 'La aventura épica continúa en el vasto mundo de Hyrule.',
    coverImage: '/placeholder-game.jpg',
    genre: 'Aventura',
    platform: 'Nintendo Switch',
    rating: 4.8,
    completed: false,
    hoursPlayed: 45,
    userId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    reviews: [{ rating: 5 }, { rating: 4 }]
  }
]

const recentlyPlayed = [
  {
    id: '3',
    title: 'Elden Ring',
    coverImage: '/placeholder-game.jpg',
    genre: 'RPG',
    platform: 'PC',
    rating: 4.7,
    completed: false,
    hoursPlayed: 67,
    userId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    reviews: [{ rating: 5 }]
  }
]

const topRated = [
  {
    id: '5',
    title: 'Hades',
    coverImage: '/placeholder-game.jpg',
    genre: 'Roguelike',
    platform: 'PC',
    rating: 4.9,
    completed: true,
    hoursPlayed: 89,
    userId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    reviews: [{ rating: 5 }, { rating: 5 }]
  }
]

const myGames = [
  // Lista vacía al inicio - los usuarios deben añadir sus propios juegos
]

export default function Home() {
  const [games, setGames] = useState(myGames)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isGameFormOpen, setIsGameFormOpen] = useState(false)
  const [selectedGame, setSelectedGame] = useState<any>(null)
  const [isGameDetailOpen, setIsGameDetailOpen] = useState(false)
  const [addingToList, setAddingToList] = useState<string | null>(null)

  // Escuchar evento personalizado para abrir formulario desde navbar
  useEffect(() => {
    const handleOpenGameForm = () => {
      setIsGameFormOpen(true)
    }
    
    const handleGlobalSearch = (event: CustomEvent) => {
      setSearchTerm(event.detail)
      // Cambiar a la pestaña "Mi Lista" automáticamente cuando se busca
      setActiveTab('mylist')
    }
    
    window.addEventListener('openGameForm', handleOpenGameForm)
    
    return () => {
      window.removeEventListener('openGameForm', handleOpenGameForm)
    }
  }, [])

  const genres = ['all', 'Aventura', 'RPG', 'Acción', 'Estrategia', 'Deportes', 'Puzzle', 'Terror', 'Simulación', 'Roguelike']
  const platforms = ['all', 'PC', 'Nintendo Switch', 'PS5', 'Xbox']
  const statuses = ['all', 'completed', 'playing']

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGenre = selectedGenre === 'all' || game.genre === selectedGenre
    const matchesPlatform = selectedPlatform === 'all' || game.platform === selectedPlatform
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'completed' && game.completed) ||
      (selectedStatus === 'playing' && !game.completed)
    
    return matchesSearch && matchesGenre && matchesPlatform && matchesStatus
  })

  const totalHours = games.reduce((acc, game) => acc + game.hoursPlayed, 0)
  const completedGames = games.filter(game => game.completed).length

  const clearSearch = () => {
    setSearchTerm('')
    setActiveTab('discover')
  }

  const handleGameClick = (game: any) => {
    setSelectedGame(game)
    setIsGameDetailOpen(true)
  }

  const handleGameSubmit = async (gameData: any) => {
    try {
      console.log('Adding game:', gameData)
      
      // Validar datos básicos
      if (!gameData.title || !gameData.platform || !gameData.genre) {
        toast({
          title: "Error de validación",
          description: "Por favor completa todos los campos requeridos.",
          variant: "destructive",
        })
        return
      }

      // Generar ID único
      const uniqueId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const newGame = {
        ...gameData,
        id: uniqueId,
        userId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        reviews: []
      }
      
      setGames(prev => [newGame, ...prev])
      
      toast({
        title: "¡Juego agregado!",
        description: `"${gameData.title}" ha sido agregado a tu biblioteca.`,
      })
    } catch (error) {
      console.error('Error adding game:', error)
      toast({
        title: "Error",
        description: "No se pudo agregar el juego. Intenta nuevamente.",
        variant: "destructive",
      })
    }
  }

  const handleAddReview = (reviewData: any) => {
    try {
      console.log('Adding review:', reviewData)
      
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
          id: reviewData.gameId || 'unknown',
          title: reviewData.title || 'Sin título',
          coverImage: '/placeholder-game.jpg'
        }
        }
      }
      
      setGames(prev => prev.map(game => 
        game.id === reviewData.gameId ? {
          {
            ...game,
            reviews: [...(game.reviews || []), newReview],
            rating: ((game.reviews?.reduce((acc, review) => acc + review.rating, 0) / (game.reviews?.length || 1)) : game.rating)
          }
        } : game
      }))
      
      toast({
        title: "¡Reseña agregada!",
        description: `"${reviewData.title}" ha sido agregada a "${reviewData.game.title}".`,
      })
    } catch (error) {
      console.error('Error adding review:', error)
      toast({
        title: "Error",
        description: "No se pudo agregar la reseña. Intenta nuevamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/placeholder-hero.jpg"
            alt="Featured Game"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-foreground text-5xl font-bold mb-4">
                  The Legend of Zelda: Tears of the Kingdom
                </h1>
                <p className="text-foreground/80 text-lg max-w-xl mb-6">
                  Explora un vasto mundo lleno de misterios y desafíos.
                </p>
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-foreground font-semibold">4.8</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-foreground/60 text-sm">Aventura</span>
                    <span className="text-foreground/60 text-sm">•</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                  <Eye className="w-5 h-5 mr-2" />
                  Ver más
                </Button>
                <Button size="lg" variant="secondary" className="bg-muted hover:bg-muted/80 text-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Añadir a Mi Lista
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-900 border-gray-800 mb-8">
            <TabsTrigger value="discover" className="data-[state=activeTab === 'discover' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white/80 hover:bg-gray-700' : 'text-gray-400 hover:text-white/80' text-white/80'>
              Descubrir
            </TabsTrigger>
            <TabsTrigger value="mylist" className="data-[state=activeTab === 'mylist' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white/80' : 'text-gray-400 hover:text-white/80' text-white/80'>
              Mi Lista
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-12">
            {searchTerm && (
              <div className="text-center py-4">
                <p className="text-foreground/60">
                  Buscando: <span className="text-foreground font-semibold">"{searchTerm}"</span>
                </p>
              </div>
            )}
            
            <GameCarousel
              title="Lo Nuevo"
              games={featuredGames.filter(game => game.title.toLowerCase().includes(searchTerm.toLowerCase()))}
              onGameClick={handleGameClick}
            />
            
            <GameCarousel
              title="Jugados Recientemente"
              games={recentlyPlayed.filter(game => game.title.toLowerCase().includes(searchTerm.toLowerCase()))}
              onGameClick={handleGameClick}
            />
            
            <GameCarousel
              title="Mejor Valorados"
              games={topRated.filter(game => game.title.toLowerCase().includes(searchTerm.toLowerCase()))}
              onGameClick={handleGameClick}
            />
            
            {searchTerm && filteredFeaturedGames.length === 0 && filteredRecentlyPlayed.length === 0 && filteredTopRated.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4">
                  <Search className="w-5 h-16 text-muted-foreground mx-auto mb-4">
                  <Search className="w-5 h-16 text-muted-foreground mx-auto mb-4" />
                  <span className="text-foreground font-semibold">No se encontraron juegos</span>
                </p>
                <p className="text-muted-foreground mb-4">
                  Intenta con otra búsqueda o explora las categorías.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="mylist" className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div>
                  <h2 className="text-foreground text-3xl font-bold mb-2">Mi Lista</h2>
                  <div className="flex gap-4 text-foreground/60 text-sm">
                    <span>{filteredGames.length} {filteredGames.length === 1 ? 'juego' : 'juegos'}</span>
                    <span>•</span>
                    <span>•</span>
                    <span>{completedGames} completados</span>
                    <span>•</span>
                    <span>{totalHours.toFixed(1)} horas jugadas</span>
                  </div>
                </div>
                
                <Button onClick={() => setIsGameFormOpen(true)} className="bg-red-600 hover:bg-red-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Juego
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-card border-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-16 text-muted-foreground mr-2" />
                <h3 className="text-foreground font-semibold mb-2">Filtros</h3>
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:grid-cols-6 gap-6">
                <div className="space-y-4">
                  {filteredGames.map((game) => (
                    <div key={game.id} onClick={() => handleGameClick(game)} className="cursor-pointer">
                      <GameCard game={game} />
                    </div>
                  ))}
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </div>
      
      {/* Game Form Modal */}
      <GameForm
        isOpen={isGameFormOpen}
        onClose={() => setIsGameFormOpen(false)}
        onSubmit={handleGameSubmit}
      />
      
      {/* Game Detail Modal */}
      {selectedGame && (
        <GameDetailModal
          game={selectedGame}
          isOpen={isGameDetailOpen}
          onClose={() => {
            setIsGameDetailOpen(false)
            setSelectedGame(null)
          }}
          onAddReview={handleAddReview}
        />
      )}
      
      {/* Toast Container */}
      <Toaster />
    </div>
  )
}