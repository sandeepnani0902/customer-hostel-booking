import React from 'react'
import { Link } from 'react-router-dom'

const NavLinks = () => {
  return (
    <div className="navbar-nav mx-auto">
      <Link className="nav-link fs-5 text-white mx-3 text-decoration-none" to="/home">Home</Link>
      <Link className="nav-link fs-5 text-white mx-3 text-decoration-none" to="/mens-pg">Men's PG</Link>
      <Link className="nav-link fs-5 text-white mx-3 text-decoration-none" to="/womens-pg">Women's PG</Link>
    </div>
  )
}

export default NavLinks