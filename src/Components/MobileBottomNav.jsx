import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const MobileBottomNav = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('home')

  const handleTabClick = (tab, path) => {
    setActiveTab(tab)
    if (path) navigate(path)
  }

  return (
    <div className="d-block d-md-none fixed-bottom bg-white border-top">
      <div className="row g-0">
        <div className="col-3 text-center py-2" onClick={() => handleTabClick('home', '/home')}>
          <i className={`bi bi-house-door h5 mb-1 ${location.pathname === '/home' ? 'text-primary' : 'text-muted'}`}></i>
          <div className={`small ${location.pathname === '/home' ? 'text-primary' : 'text-muted'}`}>Home</div>
        </div>
        <div className="col-3 text-center py-2" onClick={() => handleTabClick('search', '/mens-pg')}>
          <i className={`bi bi-search h5 mb-1 ${location.pathname === '/mens-pg' || location.pathname === '/womens-pg' ? 'text-primary' : 'text-muted'}`}></i>
          <div className={`small ${location.pathname === '/mens-pg' || location.pathname === '/womens-pg' ? 'text-primary' : 'text-muted'}`}>Search</div>
        </div>
        <div className="col-3 text-center py-2" onClick={() => handleTabClick('favorites', '/my-bookings')}>
          <i className={`bi bi-heart h5 mb-1 ${location.pathname === '/my-bookings' ? 'text-primary' : 'text-muted'}`}></i>
          <div className={`small ${location.pathname === '/my-bookings' ? 'text-primary' : 'text-muted'}`}>Favorites</div>
        </div>
        <div className="col-3 text-center py-2" onClick={() => handleTabClick('about')}>
          <i className={`bi bi-person h5 mb-1 ${activeTab === 'about' ? 'text-primary' : 'text-muted'}`}></i>
          <div className={`small ${activeTab === 'about' ? 'text-primary' : 'text-muted'}`}>About</div>
        </div>
      </div>
    </div>
  )
}

export default MobileBottomNav