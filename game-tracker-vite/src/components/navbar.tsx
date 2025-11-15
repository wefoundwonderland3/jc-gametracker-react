'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, User, Search, Plus } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    // Emitir evento personalizado para comunicarse con la página principal
    window.dispatchEvent(new CustomEvent('globalSearch', { detail: value }))
  }

  const handleAddGame = () => {
    // Emitir evento personalizado para abrir el formulario
    window.dispatchEvent(new CustomEvent('openGameForm'))
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background/80 to-transparent backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-red-600 text-2xl font-bold">
            GameTracker
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-foreground hover:text-foreground/80 transition flex items-center gap-2">
              <Home size={18} />
              Inicio
            </Link>
            <Link href="/perfil" className="text-foreground hover:text-foreground/80 transition flex items-center gap-2">
              <User size={18} />
              Perfil
            </Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center bg-muted/50 rounded-lg px-3 py-2">
            <Search size={18} className="text-muted-foreground mr-2" />
            <input
              type="text"
              placeholder="Buscar juegos..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="bg-transparent text-foreground placeholder-muted-foreground outline-none w-64"
            />
          </div>
          
          <Button 
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleAddGame}
          >
            <Plus className="w-4 h-4 mr-2" />
            Añadir juego
          </Button>
        </div>
      </div>
    </nav>
  )
}