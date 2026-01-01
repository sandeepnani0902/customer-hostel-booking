import { useState, useCallback } from 'react'

export const useGeolocation = () => {
  const [userLocation, setUserLocation] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const getCurrentLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }
      
      setIsLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = { lat: position.coords.latitude, lng: position.coords.longitude }
          setUserLocation(location)
          setIsLoading(false)
          resolve(location)
        },
        (error) => {
          setIsLoading(false)
          reject(error)
        }
      )
    })
  }, [])

  return { userLocation, isLoading, getCurrentLocation, setUserLocation }
}