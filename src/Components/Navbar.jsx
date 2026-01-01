import React from 'react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../contexts/FavoritesContext'
import NavBrand from './Navigation/NavBrand'
import NavToggler from './Navigation/NavToggler'
import NavLinks from './Navigation/NavLinks'

const Navbar = () => {
  const { favorites } = useFavorites()
  return (
    <nav className="navbar navbar-expand-lg bg-primary fixed-top shadow">
      <div className="container-fluid">
        <NavBrand />
        <NavToggler />
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <NavLinks />
          <div className="d-none d-xl-block">
            <div className="navbar-nav ms-auto">
              <Link to="/favorites" className="nav-link text-white mx-2">
                <i className="bi bi-heart me-1"></i>
                Favorites
                {favorites.length > 0 && (
                  <span className="badge bg-danger ms-1">{favorites.length}</span>
                )}
              </Link>
              <Link to="/my-bookings" className="nav-link text-white mx-2">
                <i className="bi bi-calendar-check me-1"></i>
                My Bookings
              </Link>
              <Link to="/profile" className="nav-link text-white mx-2">
                <i className="bi bi-person-circle me-1"></i>
                Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar