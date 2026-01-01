import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useFavorites } from '../../contexts/FavoritesContext'
import { hostelsData } from '../../data/hostelsData'
import { useGeolocation } from '../../hooks/useGeolocation'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
import MobileSearch from '../../Components/MobileSearch'
import Dropdown from '../../Components/Dropdown'
import SuggestionsDropdown from '../../Components/SuggestionsDropdown'
import '../../styles/enhancements.css'
import './Home.css'

const Home = () => {
  const navigate = useNavigate()
  const { favorites, toggleFavorite, isFavorite } = useFavorites()
  const { userLocation, isLoading: locationLoading, getCurrentLocation } = useGeolocation()
  const [activeTab, setActiveTab] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  const [priceFilter, setPriceFilter] = useState('')
  const [showPriceDropdown, setShowPriceDropdown] = useState(false)
  const [hostelTypeFilter, setHostelTypeFilter] = useState('')
  const [workLocation, setWorkLocation] = useState('')
  const [showWorkLocationSuggestions, setShowWorkLocationSuggestions] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [locationRequested, setLocationRequested] = useState(false)
  const [filteredHostels, setFilteredHostels] = useState(hostelsData)
  const debounceRef = useRef(null)

  const locationSuggestions = useMemo(() => [
    'Near Me', 'Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad',
    'Koramangala', 'Whitefield', 'HSR Layout', 'BTM Layout', 'Indiranagar', 'SR Nagar', 'Ameerpet', 
    'Madhapur', 'Gachibowli', 'Uppal', 'Kukatpally', 'Secunderabad', 'Banjara Hills', 'Jubilee Hills',
    'Kondapur', 'Miyapur', 'Dilsukhnagar', 'Begumpet', 'Somajiguda', 'LB Nagar'
  ], [])

  const workLocationSuggestions = useMemo(() => [
    'Madhapur IT Hub', 'Gachibowli Financial District', 'Hi-Tech City', 'Kondapur IT Park',
    'Ameerpet Training Hub', 'Secunderabad Railway', 'Begumpet Airport', 'Banjara Hills Commercial',
    'Jubilee Hills Business', 'SR Nagar Metro', 'Uppal Industrial', 'Kukatpally KPHB'
  ], [])

  const favoriteHostels = useMemo(() => 
    hostelsData.filter(hostel => isFavorite(hostel.id)), 
    [isFavorite]
  )

  const calculateDistance = useCallback((lat1, lng1, lat2, lng2) => {
    const R = 6371
    const dLatRad = (lat2 - lat1) * Math.PI / 180
    const dLngRad = (lng2 - lng1) * Math.PI / 180
    const lat1Rad = lat1 * Math.PI / 180
    const lat2Rad = lat2 * Math.PI / 180
    
    const a = Math.sin(dLatRad/2) * Math.sin(dLatRad/2) + 
              Math.cos(lat1Rad) * Math.cos(lat2Rad) * 
              Math.sin(dLngRad/2) * Math.sin(dLngRad/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }, [])

  const applyAllFilters = useCallback((search, price, hostelType, workLoc) => {
    let filtered = hostelsData
    
    if (search && search.trim() && !search.includes('Near Me')) {
      filtered = filtered.filter(hostel => {
        const searchLower = search.toLowerCase()
        const nameLower = hostel.name.toLowerCase()
        const locationLower = hostel.location.toLowerCase()
        return nameLower.includes(searchLower) || locationLower.includes(searchLower)
      })
    }
    
    if (workLoc && workLoc.trim()) {
      filtered = filtered.filter(hostel => {
        const workArea = workLoc.toLowerCase()
        const hostelArea = hostel.location.toLowerCase()
        
        const workLocationMap = {
          'madhapur': ['madhapur', 'gachibowli', 'kondapur', 'miyapur'],
          'gachibowli': ['gachibowli', 'madhapur', 'kondapur'],
          'hi-tech city': ['madhapur', 'gachibowli', 'kondapur'],
          'kondapur': ['kondapur', 'madhapur', 'gachibowli', 'miyapur'],
          'ameerpet': ['ameerpet', 'sr nagar', 'begumpet', 'somajiguda'],
          'secunderabad': ['secunderabad', 'begumpet', 'somajiguda'],
          'banjara hills': ['banjara hills', 'jubilee hills', 'somajiguda'],
          'jubilee hills': ['jubilee hills', 'banjara hills', 'madhapur']
        }
        
        // Check direct match first
        if (hostelArea.includes(workArea)) {
          return true
        }
        
        // Check mapped areas
        for (const [work, areas] of Object.entries(workLocationMap)) {
          if (workArea.includes(work)) {
            return areas.some(area => hostelArea.includes(area))
          }
        }
        
        return false
      })
    }
    
    if (price) {
      const priceParts = price.split('-')
      if (priceParts.length === 2) {
        const [min, max] = priceParts.map(Number)
        if (!isNaN(min) && !isNaN(max)) {
          filtered = filtered.filter(hostel => hostel.price >= min && hostel.price <= max)
        }
      }
    }
    
    if (hostelType) {
      filtered = filtered.filter(hostel => {
        const name = hostel.name.toLowerCase()
        switch(hostelType) {
          case 'boys': return name.includes('boys') || name.includes('boy')
          case 'girls': return name.includes('girls') || name.includes('girl')
          case 'co-living': return name.includes('co-living') || name.includes('coliving')
          default: return true
        }
      })
    }
    
    setFilteredHostels(filtered)
  }, [])

  const debouncedApplyFilters = useCallback((search, price, hostelType, workLoc) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      applyAllFilters(search, price, hostelType, workLoc)
    }, 300)
  }, [applyAllFilters])

  const handleGeolocation = useCallback(async () => {
    if (locationRequested) return
    setLocationRequested(true)
    
    try {
      const location = await getCurrentLocation()
      const nearbyHostels = hostelsData.filter(hostel => {
        if (hostel.lat && hostel.lng && typeof hostel.lat === 'number' && typeof hostel.lng === 'number') {
          const distance = calculateDistance(location.lat, location.lng, hostel.lat, hostel.lng)
          return distance <= 10
        }
        return false
      })
      
      if (nearbyHostels.length > 0) {
        setFilteredHostels(nearbyHostels)
        return `Near Me (${nearbyHostels.length} hostels found)`
      } else {
        const expandedHostels = hostelsData.filter(hostel => {
          if (hostel.lat && hostel.lng && typeof hostel.lat === 'number' && typeof hostel.lng === 'number') {
            const distance = calculateDistance(location.lat, location.lng, hostel.lat, hostel.lng)
            return distance <= 25
          }
          return false
        })
        setFilteredHostels(expandedHostels)
        return `Near Me (${expandedHostels.length} hostels within 25km)`
      }
    } catch (error) {
      console.warn('Location access denied - showing all hostels')
      setFilteredHostels(hostelsData)
      throw error
    }
  }, [getCurrentLocation, locationRequested, calculateDistance])

  useEffect(() => {
    setIsMobile(window.innerWidth < 1200)
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1200)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Request location permission on app open
  useEffect(() => {
    const requestLocationOnOpen = async () => {
      try {
        await getCurrentLocation()
        // Location granted - no need to show message
      } catch (error) {
        // Location denied or error - continue with all hostels
        console.log('Location access not granted, showing all hostels')
      }
    }
    
    requestLocationOnOpen()
  }, [getCurrentLocation])

  useEffect(() => {
    setFilteredHostels(hostelsData)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPriceDropdown && !event.target.closest('.position-relative')) {
        setShowPriceDropdown(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPriceDropdown])

  const renderStars = useCallback((rating) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    const stars = []
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="bi bi-star-fill"></i>)
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="bi bi-star-half"></i>)
    }
    
    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<i key={`empty-${i}`} className="bi bi-star"></i>)
    }
    
    return stars
  }, [])

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      applyAllFilters(searchQuery, priceFilter, hostelTypeFilter, workLocation)
    }
    setActiveTab('home')
  }, [searchQuery, priceFilter, hostelTypeFilter, workLocation, applyAllFilters])

  const handleToggleFavorite = useCallback((hostelId) => {
    const hostel = hostelsData.find(h => h.id === hostelId)
    toggleFavorite(hostelId, hostel?.name)
  }, [toggleFavorite])

  const handleCurrentLocation = useCallback(() => {
    setSearchQuery('Searching nearby...')
    handleGeolocation()
      .then((message) => {
        setSearchQuery(message)
        setActiveTab('home')
      })
      .catch(() => {
        setSearchQuery('')
        toast.error('Unable to access your location. Please enable location services and try again.')
      })
  }, [handleGeolocation])

  const handleLocationSelect = useCallback((city) => {
    if (city === 'Near Me') {
      handleCurrentLocation()
    } else {
      setSearchQuery(city)
      applyAllFilters(city, priceFilter, hostelTypeFilter, workLocation)
    }
    setShowLocationSuggestions(false)
  }, [handleCurrentLocation, priceFilter, hostelTypeFilter, workLocation, applyAllFilters])

  const handleWorkLocationSelect = useCallback((work) => {
    if (work === 'Clear') {
      setWorkLocation('')
      applyAllFilters(searchQuery, priceFilter, hostelTypeFilter, '')
    } else {
      setWorkLocation(work)
      applyAllFilters(searchQuery, priceFilter, hostelTypeFilter, work)
    }
    setShowWorkLocationSuggestions(false)
  }, [searchQuery, priceFilter, hostelTypeFilter, applyAllFilters])

  return (
    <div style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>
      <Navbar />
      
      {/* Mobile Search Section */}
      {activeTab !== 'favorites' && activeTab !== 'about' && (
        <MobileSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showLocationSuggestions={showLocationSuggestions}
          setShowLocationSuggestions={setShowLocationSuggestions}
          locationSuggestions={locationSuggestions}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          hostelTypeFilter={hostelTypeFilter}
          setHostelTypeFilter={setHostelTypeFilter}
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
          showPriceDropdown={showPriceDropdown}
          setShowPriceDropdown={setShowPriceDropdown}
          workLocation={workLocation}
          setWorkLocation={setWorkLocation}
          showWorkLocationSuggestions={showWorkLocationSuggestions}
          setShowWorkLocationSuggestions={setShowWorkLocationSuggestions}
          workLocationSuggestions={workLocationSuggestions}
          onSearch={handleSearch}
          onLocationSelect={handleLocationSelect}
          onWorkLocationSelect={handleWorkLocationSelect}
          onCurrentLocation={handleCurrentLocation}
          onFilterChange={debouncedApplyFilters}
          locationLoading={locationLoading}
        />
      )}
      
      {/* Desktop Search Section */}
      <div className="bg-light py-4 d-none d-md-block position-sticky" style={{top: '56px', zIndex: 999}}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-10 col-lg-11">
              <div className="d-flex gap-2 align-items-center flex-wrap">
                <div className="flex-grow-1" style={{minWidth: '300px'}}>
                  <div className="input-group position-relative">
                    <span className="input-group-text bg-white border-end-0" onClick={handleCurrentLocation} style={{cursor: 'pointer'}}>
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
                      placeholder="Search by location or hostel name"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        debouncedApplyFilters(e.target.value.trim(), priceFilter, hostelTypeFilter, workLocation)
                      }}
                      onFocus={() => setShowLocationSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 300)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleSearch()
                          setShowLocationSuggestions(false)
                        }
                      }}
                      style={{boxShadow: 'none'}}
                    />
                    <button className="btn btn-primary" type="button" onClick={handleSearch}>
                      <i className="bi bi-search"></i>
                    </button>
                    
                    <SuggestionsDropdown
                      isOpen={showLocationSuggestions}
                      suggestions={locationSuggestions}
                      onSelect={handleLocationSelect}
                      query={searchQuery}
                    />
                  </div>
                </div>
                
                <div className="position-relative" style={{width: '200px', flexShrink: 0}}>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Work location (Optional)"
                    value={workLocation}
                    onChange={(e) => {
                      setWorkLocation(e.target.value)
                      debouncedApplyFilters(searchQuery, priceFilter, hostelTypeFilter, e.target.value)
                    }}
                    onFocus={() => setShowWorkLocationSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowWorkLocationSuggestions(false), 300)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleSearch()
                        setShowWorkLocationSuggestions(false)
                      }
                    }}
                  />
                  <SuggestionsDropdown
                    isOpen={showWorkLocationSuggestions}
                    suggestions={[...workLocationSuggestions, 'Clear']}
                    onSelect={handleWorkLocationSelect}
                    query={workLocation}
                    icon="bi-building"
                    maxHeight="150px"
                  />
                </div>
                
                <div className="position-relative" style={{width: '140px', flexShrink: 0}}>
                  <select 
                    className="form-select" 
                    value={hostelTypeFilter}
                    onChange={(e) => {
                      setHostelTypeFilter(e.target.value)
                      applyAllFilters(searchQuery, priceFilter, e.target.value, workLocation)
                    }}
                  >
                    <option value="">All Types</option>
                    <option value="boys">Boys</option>
                    <option value="girls">Girls</option>
                    <option value="co-living">Co-living</option>
                  </select>
                </div>
                
                <div className="position-relative" style={{width: '180px', flexShrink: 0}}>
                  <Dropdown
                    isOpen={showPriceDropdown}
                    onToggle={() => setShowPriceDropdown(!showPriceDropdown)}
                    value={priceFilter ? `₹${priceFilter.split('-')[0]} - ₹${priceFilter.split('-')[1]}` : null}
                    placeholder="All Prices"
                    options={[
                      { value: '', label: 'All Prices' },
                      { value: '5000-7000', label: '₹5000 - ₹7000' },
                      { value: '7000-8000', label: '₹7000 - ₹8000' },
                      { value: '8000-9000', label: '₹8000 - ₹9000' },
                      { value: '9000-12000', label: '₹9000 - ₹12000' },
                      { value: '12000-20000', label: '₹12000 - ₹20000' }
                    ]}
                    onSelect={(value) => {
                      setPriceFilter(value)
                      applyAllFilters(searchQuery, value, hostelTypeFilter, workLocation)
                      setShowPriceDropdown(false)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hostel Cards Section */}
      {(activeTab === 'home' || !isMobile) && (
        <div className="container" style={{paddingBottom: isMobile ? '80px' : '20px', marginTop: isMobile ? '20px' : '60px'}}>
          <h3 className="mb-4">Available Hostels {workLocation && <span className="text-muted small">near {workLocation}</span>}</h3>
          {filteredHostels.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-geo-alt display-1 text-muted"></i>
              <h5 className="mt-3 text-muted">No hostels found</h5>
              <p className="text-muted">Click GPS icon to see nearby hostels or search for specific areas</p>
            </div>
          ) : (
            <div className="row">
              {filteredHostels.map((hostel) => (
                <div key={hostel.id} className="col-lg-4 col-md-6 mb-4 fade-in">
                  <div 
                    className="card h-100 shadow-sm hostel-card position-relative card-gradient" 
                    onClick={(e) => {
                      if (e.target.closest('button')) return;
                      navigate(`/hostel/${hostel.id}`);
                    }}
                    style={{cursor: 'pointer'}}
                  >
                    <button 
                      className="btn btn-sm position-absolute top-0 end-0 m-2" 
                      style={{zIndex: 10, backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '40px', height: '40px'}}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(hostel.id);
                      }}
                    >
                      <i className={`bi ${isFavorite(hostel.id) ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
                    </button>
                    <div className="position-relative">
                      <img src={hostel.image} className="card-img-top" alt={hostel.name} style={{height: '200px', objectFit: 'cover'}} />
                      <div className="position-absolute bottom-0 start-0 m-2">
                        <span className="price-tag">
                          ₹{hostel.price.toLocaleString()}/month
                        </span>
                      </div>
                    </div>
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{hostel.name}</h5>
                      <p className="card-text text-muted mb-2">
                        <i className="bi bi-geo-alt me-1"></i>
                        {hostel.location}
                        {userLocation && hostel.lat && hostel.lng && (
                          <span className="badge bg-info ms-2">
                            {calculateDistance(userLocation.lat, userLocation.lng, hostel.lat, hostel.lng).toFixed(1)} km away
                          </span>
                        )}
                        <button 
                          className="btn btn-sm btn-outline-primary ms-2" 
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hostel.location)}`, '_blank');
                          }}
                        >
                          <i className="bi bi-geo-alt-fill"></i> GPS
                        </button>
                      </p>
                      <p className="card-text text-success mb-2">
                        <i className="bi bi-bed me-1"></i>
                        <span className={hostel.availableBeds > 5 ? 'status-available' : 'status-limited'}>
                          {hostel.availableBeds} beds available
                        </span>
                      </p>
                      <div className="d-flex align-items-center mb-3">
                        <div className="text-warning me-2">
                          {renderStars(hostel.rating)}
                        </div>
                        <span className="text-muted small">{hostel.rating} ({hostel.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Profile Section */}
      {activeTab === 'about' && isMobile && (
        <div className="container" style={{paddingBottom: '80px', marginTop: '20px'}}>
          <h3 className="mb-4">Profile</h3>
          <div className="card mb-3">
            <div className="card-body text-center">
              <i className="bi bi-person-circle display-1 text-primary mb-3"></i>
              <h5>User Profile</h5>
              <p className="text-muted">+91 98765 43210</p>
            </div>
          </div>
          <div className="list-group">
            <div className="list-group-item d-flex justify-content-between align-items-center">
              <div><i className="bi bi-person-fill text-primary me-2"></i>Account Settings</div>
              <i className="bi bi-chevron-right"></i>
            </div>
            <div className="list-group-item d-flex justify-content-between align-items-center">
              <div><i className="bi bi-heart-fill text-danger me-2"></i>My Favorites ({favorites.length})</div>
              <i className="bi bi-chevron-right"></i>
            </div>
            <div className="list-group-item d-flex justify-content-between align-items-center">
              <div><i className="bi bi-calendar-check text-success me-2"></i>My Bookings</div>
              <span className="badge bg-primary rounded-pill">0</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Favorites Section */}
      {activeTab === 'favorites' && isMobile && (
        <div className="container" style={{paddingBottom: '80px', marginTop: '20px'}}>
          <h3 className="mb-4">Favorites</h3>
          {favorites.length === 0 ? (
            <div className="text-center">
              <i className="bi bi-heart display-1 text-muted"></i>
              <p className="mt-3">No favorites yet. Start adding hostels to your favorites!</p>
            </div>
          ) : (
            <div className="row">
              {favoriteHostels.map((hostel) => (
                <div key={hostel.id} className="col-12 mb-3">
                  <div className="card" onClick={() => navigate(`/hostel/${hostel.id}`)} style={{cursor: 'pointer'}}>
                    <div className="row g-0">
                      <div className="col-4">
                        <img src={hostel.image} className="img-fluid rounded-start" alt={hostel.name} style={{height: '120px', objectFit: 'cover'}} />
                      </div>
                      <div className="col-8">
                        <div className="card-body p-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <h6 className="card-title mb-1">{hostel.name}</h6>
                            <button 
                              className="btn btn-sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorite(hostel.id);
                              }}
                            >
                              <i className="bi bi-heart-fill text-danger"></i>
                            </button>
                          </div>
                          <p className="card-text small text-muted mb-1">
                            <i className="bi bi-geo-alt me-1"></i>{hostel.location}
                          </p>
                          <p className="card-text fw-bold text-primary mb-1">₹{hostel.price.toLocaleString()}/month</p>
                          <div className="d-flex align-items-center">
                            <div className="text-warning me-2">{renderStars(hostel.rating)}</div>
                            <span className="small text-muted">{hostel.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Mobile Bottom Navigation */}
      <div className="d-block d-xl-none" style={{position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', borderTop: '1px solid #dee2e6', height: '60px', zIndex: 1000}}>
        <div className="row g-0 h-100">
          <div className="col-3 text-center d-flex flex-column justify-content-center" onClick={() => setActiveTab('home')}>
            <i className={`bi bi-house-door ${activeTab === 'home' ? 'text-primary' : 'text-muted'}`}></i>
            <div className={`small ${activeTab === 'home' ? 'text-primary' : 'text-muted'}`}>Home</div>
          </div>
          <div className="col-3 text-center d-flex flex-column justify-content-center" onClick={() => setActiveTab('search')}>
            <i className={`bi bi-search ${activeTab === 'search' ? 'text-primary' : 'text-muted'}`}></i>
            <div className={`small ${activeTab === 'search' ? 'text-primary' : 'text-muted'}`}>Search</div>
          </div>
          <div className="col-3 text-center d-flex flex-column justify-content-center" onClick={() => setActiveTab('favorites')}>
            <i className={`bi bi-heart ${activeTab === 'favorites' ? 'text-primary' : 'text-muted'}`}></i>
            <div className={`small ${activeTab === 'favorites' ? 'text-primary' : 'text-muted'}`}>Favorites</div>
          </div>
          <div className="col-3 text-center d-flex flex-column justify-content-center" onClick={() => setActiveTab('about')}>
            <i className={`bi bi-person ${activeTab === 'about' ? 'text-primary' : 'text-muted'}`}></i>
            <div className={`small ${activeTab === 'about' ? 'text-primary' : 'text-muted'}`}>Profile</div>
          </div>
        </div>
      </div>
      
      {!isMobile && <Footer />}
    </div>
  )
}

export default Home