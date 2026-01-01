import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useFavorites } from '../contexts/FavoritesContext'
import { hostelsData } from '../data/hostelsData'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'

const Favorites = () => {
  const navigate = useNavigate()
  const { favorites, toggleFavorite } = useFavorites()

  const favoriteHostels = hostelsData.filter(hostel => favorites.includes(hostel.id))

  const renderStars = (rating) => {
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
  }

  return (
    <div style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>
      <Navbar />
      
      <div className="container" style={{paddingTop: '80px', paddingBottom: '40px'}}>
        <div className="row">
          <div className="col-12">
            <h2 className="mb-4">
              <i className="bi bi-heart-fill text-danger me-2"></i>
              My Favorites
            </h2>
            
            {favoriteHostels.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-heart display-1 text-muted"></i>
                <h4 className="mt-3 text-muted">No favorites yet</h4>
                <p className="text-muted mb-4">Start adding hostels to your favorites to see them here!</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/home')}
                >
                  Browse Hostels
                </button>
              </div>
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <p className="text-muted mb-0">{favoriteHostels.length} hostel{favoriteHostels.length !== 1 ? 's' : ''} in your favorites</p>
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => navigate('/home')}
                  >
                    <i className="bi bi-plus-circle me-1"></i>
                    Add More
                  </button>
                </div>
                
                <div className="row">
                  {favoriteHostels.map((hostel) => (
                    <div key={hostel.id} className="col-lg-4 col-md-6 mb-4">
                      <div 
                        className="card h-100 shadow-sm hostel-card position-relative" 
                        onClick={() => navigate(`/hostel/${hostel.id}`)}
                        style={{cursor: 'pointer'}}
                      >
                        <button 
                          className="btn btn-sm position-absolute top-0 end-0 m-2" 
                          style={{zIndex: 10, backgroundColor: 'rgba(255,255,255,0.9)', border: 'none'}}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(hostel.id, hostel.name);
                          }}
                        >
                          <i className="bi bi-heart-fill text-danger"></i>
                        </button>
                        <img 
                          src={hostel.image} 
                          className="card-img-top" 
                          alt={hostel.name} 
                          style={{height: '200px', objectFit: 'cover'}} 
                        />
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title">{hostel.name}</h5>
                          <p className="card-text text-muted mb-2">
                            <i className="bi bi-geo-alt me-1"></i>
                            {hostel.location}
                          </p>
                          <p className="card-text fw-bold text-primary mb-2">
                            ₹{hostel.price.toLocaleString()}/month
                          </p>
                          <p className="card-text text-success mb-2">
                            <i className="bi bi-bed me-1"></i>
                            {hostel.availableBeds || 8} beds available
                          </p>
                          <div className="d-flex align-items-center mb-3">
                            <div className="text-warning me-2">
                              {renderStars(hostel.rating)}
                            </div>
                            <span className="text-muted small">{hostel.rating} ({hostel.reviewCount} reviews)</span>
                          </div>
                          <div className="mt-auto">
                            <button 
                              className="btn btn-primary w-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/hostel/${hostel.id}`);
                              }}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default Favorites