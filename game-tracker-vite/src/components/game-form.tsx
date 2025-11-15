'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { X, Plus } from 'lucide-react'
import { Game } from '@prisma/client'

interface GameFormData {
  title: string
  description: string
  coverImage: string
  genre: string
  platform: string
  releaseDate: string
  rating: number
  completed: boolean
  hoursPlayed: number
}

interface GameFormProps {
  game?: Game & {
    reviews?: Array<{ rating: number }>
  }
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: GameFormData) => void
  isEditing?: boolean
}

const genres = [
  'Acción', 'RPG', 'Aventura', 'Estrategia', 'Deportes', 
  'Carreras', 'Puzzle', 'Terror', 'Simulación', 'Roguelike'
]

const platforms = [
  'PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 
  'Xbox One', 'Nintendo Switch', 'Mobile', 'Otro'
]

export function GameForm({ game, isOpen, onClose, onSubmit, isEditing = false }: GameFormProps) {
  const [formData, setFormData] = useState<GameFormData>({
    title: game?.title || '',
    description: game?.description || '',
    coverImage: game?.coverImage || '',
    genre: game?.genre || '',
    platform: game?.platform || '',
    releaseDate: game?.releaseDate ? new Date(game.releaseDate).toISOString().split('T')[0] : '',
    rating: game?.rating || 0,
    completed: game?.completed || false,
    hoursPlayed: game?.hoursPlayed || 0
  })
  const [errors, setErrors] = useState<Partial<Record<keyof GameFormData, string>>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof GameFormData, string>> = {}

    // Validación del título
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido'
    } else if (formData.title.length < 2) {
      newErrors.title = 'El título debe tener al menos 2 caracteres'
    } else if (formData.title.length > 100) {
      newErrors.title = 'El título no puede exceder 100 caracteres'
    }

    // Validación de la plataforma
    if (!formData.platform) {
      newErrors.platform = 'La plataforma es requerida'
    }

    // Validación del género
    if (!formData.genre) {
      newErrors.genre = 'El género es requerido'
    }

    // Validación del rating
    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = 'La calificación debe estar entre 0 y 5'
    }

    // Validación de horas jugadas
    if (formData.hoursPlayed < 0) {
      newErrors.hoursPlayed = 'Las horas jugadas no pueden ser negativas'
    }

    // Validación de la URL de la imagen (si se proporciona)
    if (formData.coverImage && !isValidUrl(formData.coverImage)) {
      newErrors.coverImage = 'La URL de la imagen no es válida'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string: string): boolean => {
    try {
      // Si está vacío, está bien (usará placeholder)
      if (!string.trim()) return true
      
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar formulario
    if (!validateForm()) {
      return
    }

    try {
      // Preparar datos limpios
      const cleanData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        coverImage: formData.coverImage.trim() || '/placeholder-game.jpg', // Usar placeholder si no hay URL
        platform: formData.platform,
        genre: formData.genre,
        rating: Math.max(0, Math.min(5, formData.rating)), // Asegurar que esté entre 0 y 5
        hoursPlayed: Math.max(0, formData.hoursPlayed), // Asegurar que no sea negativo
        completed: formData.completed,
        releaseDate: formData.releaseDate || new Date().toISOString().split('T')[0] // Usar fecha actual si no hay
      }

      await onSubmit(cleanData)
      onClose()
      
      // Reset form if not editing
      if (!isEditing) {
        setFormData({
          title: '',
          description: '',
          coverImage: '',
          genre: '',
          platform: '',
          releaseDate: '',
          rating: 0,
          completed: false,
          hoursPlayed: 0
        })
        setErrors({})
      }
    } catch (error) {
      console.error('Error al guardar el juego:', error)
      // Aquí podríamos mostrar un toast de error
    }
  }

  const handleChange = (field: keyof GameFormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? 'Editar Juego' : 'Agregar Nuevo Juego'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => {
                  handleChange('title', e.target.value)
                  // Limpiar error cuando el usuario empieza a escribir
                  if (errors.title) {
                    setErrors(prev => ({ ...prev, title: '' }))
                  }
                }}
                className={`bg-gray-800 border-gray-700 text-white ${
                  errors.title ? 'border-red-500 focus:border-red-500' : ''
                }`}
                required
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Plataforma *</Label>
              <Select value={formData.platform} onValueChange={(value) => {
                handleChange('platform', value)
                if (errors.platform) {
                  setErrors(prev => ({ ...prev, platform: '' }))
                }
              }}>
                <SelectTrigger className={`bg-gray-800 border-gray-700 text-white ${
                  errors.platform ? 'border-red-500 focus:border-red-500' : ''
                }`}>
                  <SelectValue placeholder="Selecciona una plataforma" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {platforms.map(platform => (
                    <SelectItem key={platform} value={platform} className="text-white hover:bg-gray-700">
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.platform && (
                <p className="text-red-500 text-sm mt-1">{errors.platform}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Género *</Label>
              <Select value={formData.genre} onValueChange={(value) => {
                handleChange('genre', value)
                if (errors.genre) {
                  setErrors(prev => ({ ...prev, genre: '' }))
                }
              }}>
                <SelectTrigger className={`bg-gray-800 border-gray-700 text-white ${
                  errors.genre ? 'border-red-500 focus:border-red-500' : ''
                }`}>
                  <SelectValue placeholder="Selecciona un género" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {genres.map(genre => (
                    <SelectItem key={genre} value={genre} className="text-white hover:bg-gray-700">
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.genre && (
                <p className="text-red-500 text-sm mt-1">{errors.genre}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="releaseDate">Fecha de Lanzamiento</Label>
              <Input
                id="releaseDate"
                type="date"
                value={formData.releaseDate}
                onChange={(e) => handleChange('releaseDate', e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hoursPlayed">Horas Jugadas</Label>
              <Input
                id="hoursPlayed"
                type="number"
                step="0.1"
                min="0"
                value={formData.hoursPlayed}
                onChange={(e) => handleChange('hoursPlayed', parseFloat(e.target.value) || 0)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Calificación (0-5)</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => handleChange('rating', parseFloat(e.target.value) || 0)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage">URL de la Imagen de Portada</Label>
            <Input
              id="coverImage"
              type="url"
              value={formData.coverImage}
              onChange={(e) => handleChange('coverImage', e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
              placeholder="Describe el juego..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="completed"
              checked={formData.completed}
              onChange={(e) => handleChange('completed', e.target.checked)}
              className="rounded border-gray-600 bg-gray-800 text-red-600 focus:ring-red-600"
            />
            <Label htmlFor="completed">Juego Completado</Label>
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
            >
              {isEditing ? 'Actualizar Juego' : 'Agregar Juego'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}