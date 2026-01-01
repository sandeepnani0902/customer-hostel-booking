import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useFavorites } from '../../contexts/FavoritesContext'
import Navbar from '../../Components/Navbar'
import MobileBottomNav from '../../Components/MobileBottomNav'
import Footer from '../../Components/Footer'

const WomensPG = () => {
  const navigate = useNavigate()
  const { toggleFavorite, isFavorite } = useFavorites()

  // Use the same hostel data as Home page - Hyderabad hostels
  const hostelsData = [
    { id: 2, name: "SR Nagar Girls PG", location: "SR Nagar, Hyderabad", price: 8200, rating: 4.3, reviews: 112, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop&crop=center&q=80", lat: 17.4405, lng: 78.4490 },
    { id: 6, name: "Ameerpet Girls PG", location: "Ameerpet, Hyderabad", price: 7800, rating: 4.2, reviews: 118, image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=250&fit=crop&crop=center&q=80", lat: 17.4380, lng: 78.4490 },
    { id: 53, name: "SR Nagar Premium Girls", location: "SR Nagar, Hyderabad", price: 9500, rating: 4.5, reviews: 145, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=250&fit=crop&crop=center&q=80", lat: 17.4392, lng: 78.4478 },
    { id: 64, name: "Ameerpet Girls Comfort", location: "Ameerpet, Hyderabad", price: 8300, rating: 4.3, reviews: 123, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=250&fit=crop&crop=center&q=80", lat: 17.4362, lng: 78.4472 },
    { id: 23, name: "KPHB Girls PG", location: "Kukatpally, Hyderabad", price: 8000, rating: 4.2, reviews: 112, image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop&crop=center&q=80", lat: 17.4845, lng: 78.4065 },
    { id: 27, name: "Secunderabad Girls Lodge", location: "Secunderabad, Hyderabad", price: 9000, rating: 4.3, reviews: 156, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=250&fit=crop&crop=center&q=80", lat: 17.5045, lng: 78.5038 }
  ]

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
      <div className="container" style={{paddingTop: '80px', paddingBottom: '80px'}}>
        <h2 className="mb-4">
          <i className="bi bi-person-fill-check text-primary me-2"></i>
          Women's PG Accommodations
        </h2>
        <p className="text-muted mb-4">{hostelsData.length} hostels available for women</p>
        
        <div className="row">
          {hostelsData.map((hostel) => (
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
                  <i className={`bi ${isFavorite(hostel.id) ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
                </button>
                <img src={hostel.image} className="card-img-top" alt={hostel.name} style={{height: '200px', objectFit: 'cover'}} />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{hostel.name}</h5>
                  <p className="card-text text-muted mb-2">
                    <i className="bi bi-geo-alt me-1"></i>
                    {hostel.location}
                    <button 
                      className="btn btn-sm btn-outline-primary ms-2" 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/hostel/${hostel.id}?showMap=true`);
                      }}
                    >
                      <i className="bi bi-geo-alt-fill"></i> GPS
                    </button>
                  </p>
                  <p className="card-text fw-bold text-primary mb-2">
                    ₹{hostel.price.toLocaleString()}/month
                  </p>
                  <p className="card-text text-success mb-2">
                    <i className="bi bi-bed me-1"></i>
                    6 beds available
                  </p>
                  <div className="d-flex align-items-center mb-3">
                    <div className="text-warning me-2">
                      {renderStars(hostel.rating)}
                    </div>
                    <span className="text-muted small">{hostel.rating} ({hostel.reviews} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
      <MobileBottomNav />
    </div>
  )
}

export default WomensPG