import React from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../../Components/Navbar'
import MobileBottomNav from '../../Components/MobileBottomNav'

const RoomDetails = () => {
  const { type } = useParams()

  const roomData = {
    '1': {
      title: '1 Sharing Room',
      price: '₹15,000 - ₹25,000',
      description: 'Private single occupancy room with personal space and privacy.',
      features: ['Private Room', 'Personal Bathroom', 'Study Table', 'Wardrobe', 'AC/Fan', 'WiFi'],
      distance: 'Near Metro Station (500m)',
      discount: '10% off for 6+ months',
      tag: 'Popular',
      minStay: '3 months',
      foodType: 'Vegetarian & Non-Vegetarian',
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=center&q=80',
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop&crop=center&q=80'
      ]
    },
    '2': {
      title: '2 Sharing Room',
      price: '₹10,000 - ₹18,000',
      description: 'Comfortable twin sharing accommodation with a roommate.',
      features: ['Shared Room', 'Twin Beds', 'Shared Bathroom', 'Study Area', 'Storage Space', 'WiFi'],
      distance: 'Near College (300m)',
      discount: '15% off for new joiners',
      tag: 'New',
      minStay: '2 months',
      foodType: 'Vegetarian Only',
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=center&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&crop=center&q=80'
      ]
    },
    '3': {
      title: '3 Sharing Room',
      price: '₹8,000 - ₹14,000',
      description: 'Budget-friendly triple sharing with good facilities.',
      features: ['Triple Sharing', 'Bunk Beds', 'Common Bathroom', 'Study Corner', 'Lockers', 'WiFi'],
      distance: 'Near Metro & College (400m)',
      discount: '20% off for students',
      tag: 'Best Rated',
      minStay: '1 month',
      foodType: 'Vegetarian & Non-Vegetarian',
      images: [
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop&crop=center&q=80',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&crop=center&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=center&q=80'
      ]
    },
    '4': {
      title: '4 Sharing Room',
      price: '₹6,000 - ₹12,000',
      description: 'Most economical option with basic amenities.',
      features: ['Four Sharing', 'Bunk Beds', 'Common Facilities', 'Basic Storage', 'Shared Space', 'WiFi'],
      distance: 'Near Bus Stop (200m)',
      discount: '5% off for long stay',
      tag: 'Popular',
      minStay: '1 month',
      foodType: 'Vegetarian Only',
      images: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&crop=center&q=80',
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop&crop=center&q=80',
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop&crop=center&q=80'
      ]
    }
  }

  const room = roomData[type]

  if (!room) {
    return (
      <div>
        <Navbar />
        <div className="container mt-5 text-center">
          <h2>Room type not found</h2>
          <Link to="/home" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh'}}>
      <Navbar />
      
      <div className="container py-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb bg-white rounded shadow-sm px-3 py-2">
            <li className="breadcrumb-item"><Link to="/home" className="text-decoration-none">🏠 Home</Link></li>
            <li className="breadcrumb-item active text-primary fw-bold">{room.title}</li>
          </ol>
        </nav>

        <div className="row g-4">
          <div className="col-lg-8">
            {/* Hero Image Carousel */}
            <div className="card border-0 shadow-lg mb-4 overflow-hidden" style={{borderRadius: '20px'}}>
              <div className="position-relative">
                <div id="roomCarousel" className="carousel slide" data-bs-ride="carousel">
                  <div className="carousel-inner">
                    {room.images.map((image, index) => (
                      <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                        <img src={image} className="d-block w-100" alt={`${room.title} ${index + 1}`} style={{height: window.innerWidth <= 768 ? '250px' : '450px', objectFit: 'cover'}} />
                        <div className="carousel-caption d-none d-md-block">
                          <div className="bg-dark bg-opacity-50 rounded p-2">
                            <h5 className="text-white mb-0">{room.title}</h5>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="carousel-control-prev" type="button" data-bs-target="#roomCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon bg-dark rounded-circle p-3"></span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target="#roomCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon bg-dark rounded-circle p-3"></span>
                  </button>
                </div>
                <div className="position-absolute top-0 end-0 m-3">
                  <span className={`badge fs-6 px-3 py-2 ${room.tag === 'Popular' ? 'bg-warning text-dark' : room.tag === 'New' ? 'bg-success' : 'bg-primary'}`} style={{borderRadius: '25px'}}>
                    ✨ {room.tag}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content Card */}
            <div className="card border-0 shadow-lg" style={{borderRadius: '20px'}}>
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <h1 className="display-5 fw-bold text-primary mb-2">{room.title}</h1>
                  <p className="lead text-muted">{room.description}</p>
                </div>
                
                {/* Key Info Cards */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="card bg-light border-0 h-100">
                      <div className="card-body text-center p-3">
                        <i className="bi bi-geo-alt-fill text-primary fs-2 mb-2"></i>
                        <h6 className="fw-bold mb-1">Location</h6>
                        <p className="small mb-0 text-muted">{room.distance}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card bg-light border-0 h-100">
                      <div className="card-body text-center p-3">
                        <i className="bi bi-percent text-success fs-2 mb-2"></i>
                        <h6 className="fw-bold mb-1">Special Offer</h6>
                        <p className="small mb-0 text-success fw-bold">{room.discount}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card bg-light border-0 h-100">
                      <div className="card-body text-center p-3">
                        <i className="bi bi-calendar-check text-info fs-2 mb-2"></i>
                        <h6 className="fw-bold mb-1">Minimum Stay</h6>
                        <p className="small mb-0 text-muted">{room.minStay}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card bg-light border-0 h-100">
                      <div className="card-body text-center p-3">
                        <i className="bi bi-egg-fried text-warning fs-2 mb-2"></i>
                        <h6 className="fw-bold mb-1">Food Options</h6>
                        <p className="small mb-0 text-muted">{room.foodType}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Features Section */}
                <div className="bg-gradient p-4 rounded-4 mb-4" style={{background: 'linear-gradient(45deg, #f8f9fa, #e9ecef)'}}>
                  <h4 className="text-center mb-4 text-primary">🏠 Features & Amenities</h4>
                  <div className="row g-2">
                    {room.features.map((feature, index) => (
                      <div key={index} className="col-md-6">
                        <div className="d-flex align-items-center p-2 bg-white rounded shadow-sm">
                          <i className="bi bi-check-circle-fill text-success fs-5 me-3"></i>
                          <span className="fw-medium">{feature}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-lg sticky-top" style={{top: '20px', borderRadius: '20px'}}>
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
                    <i className="bi bi-currency-rupee text-primary fs-1"></i>
                  </div>
                  <h2 className="text-primary mt-3 mb-1">{room.price}</h2>
                  <p className="text-muted mb-0">per month</p>
                </div>
                
                <div className="d-grid gap-3 mb-4">
                  <button className="btn btn-primary btn-lg py-3 fw-bold" style={{borderRadius: '15px'}}>
                    <i className="bi bi-search me-2"></i>Find Hostels
                  </button>
                  <button className="btn btn-outline-primary btn-lg py-3 fw-bold" style={{borderRadius: '15px'}}>
                    <i className="bi bi-telephone me-2"></i>Contact Us
                  </button>
                </div>

                <div className="bg-light p-3 rounded-4 text-center">
                  <i className="bi bi-shield-check text-success fs-4 mb-2"></i>
                  <p className="small mb-0 text-muted fw-medium">
                    🔒 Safe & Secure Booking<br/>
                    💯 100% Verified Properties
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  )
}

export default RoomDetails