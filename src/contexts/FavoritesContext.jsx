import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const FavoritesContext = createContext()

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('hostel-favorites')
    return savedFavorites ? JSON.parse(savedFavorites) : []
  })

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('hostel-favorites', JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (hostelId, hostelName) => {
    const isAdding = !favorites.includes(hostelId)
    
    setFavorites(prev => 
      prev.includes(hostelId) 
        ? prev.filter(id => id !== hostelId)
        : [...prev, hostelId]
    )
    
    if (isAdding && hostelName) {
      toast.success(`${hostelName} added to favorites!`)
    }
  }

  const isFavorite = (hostelId) => {
    return favorites.includes(hostelId)
  }

  const clearFavorites = () => {
    setFavorites([])
    localStorage.removeItem('hostel-favorites')
  }

  return (
    <FavoritesContext.Provider value={{
      favorites,
      toggleFavorite,
      isFavorite,
      clearFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  )
}