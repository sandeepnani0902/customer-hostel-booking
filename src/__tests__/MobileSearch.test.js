import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import MobileSearch from '../components/MobileSearch'

const mockProps = {
  searchQuery: '',
  setSearchQuery: jest.fn(),
  showLocationSuggestions: false,
  setShowLocationSuggestions: jest.fn(),
  locationSuggestions: ['Hyderabad', 'Bangalore'],
  showFilters: false,
  setShowFilters: jest.fn(),
  hostelTypeFilter: '',
  setHostelTypeFilter: jest.fn(),
  priceFilter: '',
  setPriceFilter: jest.fn(),
  showPriceDropdown: false,
  setShowPriceDropdown: jest.fn(),
  workLocation: '',
  setWorkLocation: jest.fn(),
  showWorkLocationSuggestions: false,
  setShowWorkLocationSuggestions: jest.fn(),
  workLocationSuggestions: ['Madhapur', 'Gachibowli'],
  onSearch: jest.fn(),
  onLocationSelect: jest.fn(),
  onWorkLocationSelect: jest.fn(),
  onCurrentLocation: jest.fn(),
  onFilterChange: jest.fn(),
  locationLoading: false
}

describe('MobileSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders search input', () => {
    render(<MobileSearch {...mockProps} />)
    expect(screen.getByPlaceholderText('Search hostels...')).toBeInTheDocument()
  })

  test('calls onCurrentLocation when GPS icon clicked', () => {
    render(<MobileSearch {...mockProps} />)
    fireEvent.click(screen.getByRole('button', { name: /search/i }).previousSibling)
    expect(mockProps.onCurrentLocation).toHaveBeenCalled()
  })

  test('shows loading spinner when locationLoading is true', () => {
    render(<MobileSearch {...mockProps} locationLoading={true} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  test('toggles filters when filter button clicked', () => {
    render(<MobileSearch {...mockProps} />)
    fireEvent.click(screen.getByRole('button', { name: '' }))
    expect(mockProps.setShowFilters).toHaveBeenCalledWith(true)
  })

  test('calls onSearch when search button clicked', () => {
    render(<MobileSearch {...mockProps} />)
    fireEvent.click(screen.getByRole('button', { name: /search/i }))
    expect(mockProps.onSearch).toHaveBeenCalled()
  })

  test('shows filters when showFilters is true', () => {
    render(<MobileSearch {...mockProps} showFilters={true} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})