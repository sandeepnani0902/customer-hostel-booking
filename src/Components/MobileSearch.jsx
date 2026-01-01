import React, { useEffect, useRef, useMemo, useCallback } from 'react'
import Dropdown from './Dropdown'
import SuggestionsDropdown from './SuggestionsDropdown'

const MobileSearch = ({
  searchQuery,
  setSearchQuery,
  showLocationSuggestions,
  setShowLocationSuggestions,
  locationSuggestions,
  showFilters,
  setShowFilters,
  hostelTypeFilter,
  setHostelTypeFilter,
  priceFilter,
  setPriceFilter,
  showPriceDropdown,
  setShowPriceDropdown,
  workLocation,
  setWorkLocation,
  showWorkLocationSuggestions,
  setShowWorkLocationSuggestions,
  workLocationSuggestions,
  onSearch,
  onLocationSelect,
  onWorkLocationSelect,
  onCurrentLocation,
  onFilterChange,
  locationLoading
}) => {
  const filtersRef = useRef(null)

  const priceOptions = useMemo(() => [
    { value: '', label: 'All Prices' },
    { value: '5000-7000', label: '₹5000 - ₹7000' },
    { value: '7000-8000', label: '₹7000 - ₹8000' },
    { value: '8000-9000', label: '₹8000 - ₹9000' },
    { value: '9000-12000', label: '₹9000 - ₹12000' },
    { value: '12000-20000', label: '₹12000 - ₹20000' }
  ], [])

  const priceDisplayValue = useMemo(() => 
    priceFilter ? `₹${priceFilter.split('-')[0]}k-${priceFilter.split('-')[1]}k` : null,
    [priceFilter]
  )

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value)
    onFilterChange(e.target.value.trim(), priceFilter, hostelTypeFilter, workLocation)
  }, [setSearchQuery, onFilterChange, priceFilter, hostelTypeFilter, workLocation])

  const handleTypeChange = useCallback((e) => {
    setHostelTypeFilter(e.target.value)
    onFilterChange(searchQuery, priceFilter, e.target.value, workLocation)
  }, [setHostelTypeFilter, onFilterChange, searchQuery, priceFilter, workLocation])

  const handleWorkLocationChange = useCallback((e) => {
    setWorkLocation(e.target.value)
    onFilterChange(searchQuery, priceFilter, hostelTypeFilter, e.target.value)
  }, [setWorkLocation, onFilterChange, searchQuery, priceFilter, hostelTypeFilter])

  // Click outside to close filters
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setShowFilters(false)
      }
    }

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setShowFilters(false)
        setShowLocationSuggestions(false)
        setShowWorkLocationSuggestions(false)
        setShowPriceDropdown(false)
      }
    }

    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [showFilters, setShowFilters, setShowLocationSuggestions, setShowWorkLocationSuggestions, setShowPriceDropdown])

  return (
    <div className="bg-light py-2 d-md-none position-sticky" style={{top: '56px', zIndex: 999, height: '60px'}}>
      <div className="container position-relative">
        <div className="input-group position-relative">
          <span className="input-group-text bg-white border-end-0" onClick={onCurrentLocation} style={{cursor: 'pointer'}}>
            {locationLoading ? (
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <i className="bi bi-geo-alt text-primary"></i>
            )}
          </span>
          <input 
            type="text" 
            className="form-control border-start-0 border-end-0" 
            placeholder="Search hostels..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setShowLocationSuggestions(true)}
            onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 300)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                onSearch()
                setShowLocationSuggestions(false)
              }
            }}
            style={{boxShadow: 'none'}}
          />
          <button 
            className="btn btn-outline-secondary" 
            type="button" 
            onClick={() => setShowFilters(!showFilters)}
            style={{borderLeft: 'none'}}
          >
            <i className="bi bi-funnel"></i>
          </button>
          <button className="btn btn-primary" type="button" onClick={onSearch}>
            <i className="bi bi-search"></i>
          </button>
          
          <SuggestionsDropdown
            isOpen={showLocationSuggestions}
            suggestions={locationSuggestions}
            onSelect={onLocationSelect}
            query={searchQuery}
          />
        </div>
        
        {showFilters && (
          <div 
            ref={filtersRef}
            className="position-absolute border rounded p-2 bg-white shadow-sm" 
            style={{top: '100%', left: '15px', right: '15px', zIndex: 1000}}
            role="dialog"
            aria-label="Search filters"
          >
            <div className="row g-2">
              <div className="col-6">
                <select 
                  className="form-select form-select-sm" 
                  value={hostelTypeFilter}
                  onChange={handleTypeChange}
                >
                  <option value="">All Types</option>
                  <option value="boys">Boys</option>
                  <option value="girls">Girls</option>
                  <option value="co-living">Co-living</option>
                </select>
              </div>
              <div className="col-6">
                <Dropdown
                  isOpen={showPriceDropdown}
                  onToggle={() => setShowPriceDropdown(!showPriceDropdown)}
                  value={priceDisplayValue}
                  placeholder="Price"
                  options={priceOptions}
                  onSelect={(value) => {
                    setPriceFilter(value)
                    onFilterChange(searchQuery, value, hostelTypeFilter, workLocation)
                    setShowPriceDropdown(false)
                  }}
                  size="sm"
                />
              </div>
              <div className="col-12">
                <div className="position-relative">
                  <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    placeholder="Work location (Optional)"
                    value={workLocation}
                    onChange={handleWorkLocationChange}
                    onFocus={() => setShowWorkLocationSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowWorkLocationSuggestions(false), 300)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        onSearch()
                        setShowWorkLocationSuggestions(false)
                      }
                    }}
                  />
                  <SuggestionsDropdown
                    isOpen={showWorkLocationSuggestions}
                    suggestions={[...workLocationSuggestions, 'Clear']}
                    onSelect={onWorkLocationSelect}
                    query={workLocation}
                    icon="bi-building"
                    maxHeight="120px"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MobileSearch