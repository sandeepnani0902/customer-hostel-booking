import { renderHook, act } from '@testing-library/react'
import { useGeolocation } from '../hooks/useGeolocation'

// Mock navigator.geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn()
}

Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true
})

describe('useGeolocation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('initial state', () => {
    const { result } = renderHook(() => useGeolocation())
    
    expect(result.current.userLocation).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(typeof result.current.getCurrentLocation).toBe('function')
  })

  test('successful location fetch', async () => {
    const mockPosition = {
      coords: {
        latitude: 17.385044,
        longitude: 78.486671
      }
    }

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition)
    })

    const { result } = renderHook(() => useGeolocation())

    await act(async () => {
      await result.current.getCurrentLocation()
    })

    expect(result.current.userLocation).toEqual({
      lat: 17.385044,
      lng: 78.486671
    })
    expect(result.current.isLoading).toBe(false)
  })

  test('handles geolocation error', async () => {
    const mockError = new Error('Location access denied')
    
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error(mockError)
    })

    const { result } = renderHook(() => useGeolocation())

    await act(async () => {
      try {
        await result.current.getCurrentLocation()
      } catch (error) {
        expect(error).toBe(mockError)
      }
    })

    expect(result.current.isLoading).toBe(false)
  })

  test('handles unsupported geolocation', async () => {
    const originalGeolocation = global.navigator.geolocation
    delete global.navigator.geolocation

    const { result } = renderHook(() => useGeolocation())

    await act(async () => {
      try {
        await result.current.getCurrentLocation()
      } catch (error) {
        expect(error.message).toBe('Geolocation not supported')
      }
    })

    global.navigator.geolocation = originalGeolocation
  })
})