import React from 'react'
import { Link } from 'react-router-dom'

const NavBrand = () => {
  return (
    <Link className="navbar-brand fs-4 text-white me-4 text-decoration-none" to="/home">
      <i className="bi bi-house-heart-fill me-2"></i>
      HostelHub
    </Link>
  )
}

export default NavBrand