import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useFavorites } from '../../contexts/FavoritesContext'
import { authService } from '../../services/authService'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
import MobileBottomNav from '../../Components/MobileBottomNav'

const Profile = () => {
  const navigate = useNavigate()
  const { favorites } = useFavorites()
  const [expandedSection, setExpandedSection] = useState(null)
  const [workLocation, setWorkLocation] = useState('Madhapur IT Hub')
  const [priceRange, setPriceRange] = useState('8000-12000')
  const [hostelType, setHostelType] = useState('Boys')
  const [isEditing, setIsEditing] = useState(false)

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const handleLogout = () => {
    authService.logout()
    toast.success('Logged out successfully!')
    navigate('/login')
  }

  const handleSavePreferences = () => {
    localStorage.setItem('userPreferences', JSON.stringify({
      workLocation,
      priceRange,
      hostelType
    }))
    setIsEditing(false)
    toast.success('Preferences saved successfully!')
  }

  return (
    <div style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>
      <Navbar />
      
      <div className="container-fluid px-3" style={{paddingTop: '80px', paddingBottom: '80px', maxWidth: '600px'}}>
        <div className="text-center mb-4">
          <i className="bi bi-person-circle text-primary" style={{fontSize: '3rem'}}></i>
          <h4 className="mt-2 mb-0">Profile</h4>
        </div>
        
        {/* Profile Info Dropdown */}
        <div className="card mb-3 shadow-sm">
          <div 
            className="card-header d-flex justify-content-between align-items-center" 
            style={{cursor: 'pointer', padding: '1rem', backgroundColor: '#fff', border: 'none', borderBottom: '1px solid #dee2e6'}}
            onClick={() => toggleSection('info')}
          >
            <div className="d-flex align-items-center">
              <i className="bi bi-person-fill text-primary me-3" style={{fontSize: '1.2rem'}}></i>
              <span style={{fontWeight: '500'}}>Personal Information</span>
            </div>
            <i className={`bi bi-chevron-${expandedSection === 'info' ? 'up' : 'down'} text-muted`}></i>
          </div>
          {expandedSection === 'info' && (
            <div className="card-body" style={{padding: '1rem'}}>
              <div className="row g-3">
                <div className="col-12">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Name</span>
                    <span className="fw-medium">Srikanth Sirangi</span>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Email</span>
                    <span className="fw-medium">srikanthsirangi7@gmail.com</span>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Phone</span>
                    <span className="fw-medium">+91 98765 43210</span>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Work Location</span>
                    <span className="fw-medium">{workLocation}</span>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Preferred Budget</span>
                    <span className="fw-medium">₹{priceRange.split('-')[0]} - ₹{priceRange.split('-')[1]}/month</span>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Hostel Type</span>
                    <span className="fw-medium">{hostelType}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preferences Dropdown */}
        <div className="card mb-3 shadow-sm">
          <div 
            className="card-header d-flex justify-content-between align-items-center" 
            style={{cursor: 'pointer', padding: '1rem', backgroundColor: '#fff', border: 'none', borderBottom: '1px solid #dee2e6'}}
            onClick={() => toggleSection('preferences')}
          >
            <div className="d-flex align-items-center">
              <i className="bi bi-sliders text-primary me-3" style={{fontSize: '1.2rem'}}></i>
              <span style={{fontWeight: '500'}}>Search Preferences</span>
            </div>
            <i className={`bi bi-chevron-${expandedSection === 'preferences' ? 'up' : 'down'} text-muted`}></i>
          </div>
          {expandedSection === 'preferences' && (
            <div className="card-body" style={{padding: '1rem'}}>
              {!isEditing ? (
                <div className="row g-3">
                  <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">Work Location</span>
                      <span className="fw-medium">{workLocation}</span>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">Budget Range</span>
                      <span className="fw-medium">₹{priceRange.split('-')[0]} - ₹{priceRange.split('-')[1]}</span>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">Hostel Type</span>
                      <span className="fw-medium">{hostelType}</span>
                    </div>
                  </div>
                  <div className="col-12 mt-3">
                    <button 
                      className="btn btn-outline-primary btn-sm w-100"
                      onClick={() => setIsEditing(true)}
                    >
                      <i className="bi bi-pencil me-2"></i>Edit Preferences
                    </button>
                  </div>
                </div>
              ) : (
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label text-muted">Work Location</label>
                    <select 
                      className="form-select"
                      value={workLocation}
                      onChange={(e) => setWorkLocation(e.target.value)}
                    >
                      <option value="Madhapur IT Hub">Madhapur IT Hub</option>
                      <option value="Gachibowli Financial District">Gachibowli Financial District</option>
                      <option value="Hi-Tech City">Hi-Tech City</option>
                      <option value="Kondapur IT Park">Kondapur IT Park</option>
                      <option value="Ameerpet Training Hub">Ameerpet Training Hub</option>
                      <option value="Secunderabad Railway">Secunderabad Railway</option>
                      <option value="Begumpet Airport">Begumpet Airport</option>
                      <option value="Banjara Hills Commercial">Banjara Hills Commercial</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label text-muted">Budget Range</label>
                    <select 
                      className="form-select"
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                    >
                      <option value="5000-7000">₹5,000 - ₹7,000</option>
                      <option value="7000-8000">₹7,000 - ₹8,000</option>
                      <option value="8000-9000">₹8,000 - ₹9,000</option>
                      <option value="9000-12000">₹9,000 - ₹12,000</option>
                      <option value="12000-15000">₹12,000 - ₹15,000</option>
                      <option value="15000-20000">₹15,000 - ₹20,000</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label text-muted">Hostel Type</label>
                    <select 
                      className="form-select"
                      value={hostelType}
                      onChange={(e) => setHostelType(e.target.value)}
                    >
                      <option value="Boys">Boys Only</option>
                      <option value="Girls">Girls Only</option>
                      <option value="Co-living">Co-living</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <button 
                      className="btn btn-success w-100"
                      onClick={handleSavePreferences}
                    >
                      <i className="bi bi-check-lg me-2"></i>Save
                    </button>
                  </div>
                  <div className="col-6">
                    <button 
                      className="btn btn-outline-secondary w-100"
                      onClick={() => setIsEditing(false)}
                    >
                      <i className="bi bi-x-lg me-2"></i>Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Account Settings Dropdown */}
        <div className="card mb-3 shadow-sm">
          <div 
            className="card-header d-flex justify-content-between align-items-center" 
            style={{cursor: 'pointer', padding: '1rem', backgroundColor: '#fff', border: 'none', borderBottom: '1px solid #dee2e6'}}
            onClick={() => toggleSection('settings')}
          >
            <div className="d-flex align-items-center">
              <i className="bi bi-gear-fill text-secondary me-3" style={{fontSize: '1.2rem'}}></i>
              <span style={{fontWeight: '500'}}>Account Settings</span>
            </div>
            <i className={`bi bi-chevron-${expandedSection === 'settings' ? 'up' : 'down'} text-muted`}></i>
          </div>
          {expandedSection === 'settings' && (
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between align-items-center py-3 px-4" style={{cursor: 'pointer'}}>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-key text-warning me-3"></i>
                    <span>Change Password</span>
                  </div>
                  <i className="bi bi-chevron-right text-muted"></i>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center py-3 px-4" style={{cursor: 'pointer'}}>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-shield-check text-success me-3"></i>
                    <span>Privacy Settings</span>
                  </div>
                  <i className="bi bi-chevron-right text-muted"></i>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center py-3 px-4" style={{cursor: 'pointer'}}>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-bell text-info me-3"></i>
                    <span>Notification Preferences</span>
                  </div>
                  <i className="bi bi-chevron-right text-muted"></i>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* My Activity Dropdown */}
        <div className="card mb-3 shadow-sm">
          <div 
            className="card-header d-flex justify-content-between align-items-center" 
            style={{cursor: 'pointer', padding: '1rem', backgroundColor: '#fff', border: 'none', borderBottom: '1px solid #dee2e6'}}
            onClick={() => toggleSection('activity')}
          >
            <div className="d-flex align-items-center">
              <i className="bi bi-activity text-success me-3" style={{fontSize: '1.2rem'}}></i>
              <span style={{fontWeight: '500'}}>My Activity</span>
            </div>
            <i className={`bi bi-chevron-${expandedSection === 'activity' ? 'up' : 'down'} text-muted`}></i>
          </div>
          {expandedSection === 'activity' && (
            <div className="card-body" style={{padding: '1rem'}}>
              <div className="row g-3 text-center">
                <div className="col-6">
                  <div className="border rounded-3 p-3" style={{backgroundColor: '#f8f9fa'}}>
                    <i className="bi bi-heart-fill text-danger mb-2" style={{fontSize: '1.5rem'}}></i>
                    <h5 className="text-primary mb-1">{favorites.length}</h5>
                    <small className="text-muted">Favorites</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border rounded-3 p-3" style={{backgroundColor: '#f8f9fa'}}>
                    <i className="bi bi-calendar-check-fill text-success mb-2" style={{fontSize: '1.5rem'}}></i>
                    <h5 className="text-success mb-1">1</h5>
                    <small className="text-muted">Bookings</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="border rounded-3 p-3" style={{backgroundColor: '#f8f9fa'}}>
                    <i className="bi bi-building text-primary mb-2" style={{fontSize: '1.5rem'}}></i>
                    <h6 className="text-primary mb-1" style={{fontSize: '0.9rem'}}>{workLocation.split(' ')[0]}</h6>
                    <small className="text-muted">Work Area</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="border rounded-3 p-3" style={{backgroundColor: '#f8f9fa'}}>
                    <i className="bi bi-currency-rupee text-success mb-2" style={{fontSize: '1.5rem'}}></i>
                    <h6 className="text-success mb-1" style={{fontSize: '0.9rem'}}>₹{priceRange.split('-')[0]}K</h6>
                    <small className="text-muted">Budget</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="border rounded-3 p-3" style={{backgroundColor: '#f8f9fa'}}>
                    <i className="bi bi-house text-info mb-2" style={{fontSize: '1.5rem'}}></i>
                    <h6 className="text-info mb-1" style={{fontSize: '0.9rem'}}>{hostelType}</h6>
                    <small className="text-muted">Type</small>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions Dropdown */}
        <div className="card mb-3 shadow-sm">
          <div 
            className="card-header d-flex justify-content-between align-items-center" 
            style={{cursor: 'pointer', padding: '1rem', backgroundColor: '#fff', border: 'none', borderBottom: '1px solid #dee2e6'}}
            onClick={() => toggleSection('actions')}
          >
            <div className="d-flex align-items-center">
              <i className="bi bi-lightning-fill text-warning me-3" style={{fontSize: '1.2rem'}}></i>
              <span style={{fontWeight: '500'}}>Quick Actions</span>
            </div>
            <i className={`bi bi-chevron-${expandedSection === 'actions' ? 'up' : 'down'} text-muted`}></i>
          </div>
          {expandedSection === 'actions' && (
            <div className="card-body" style={{padding: '1rem'}}>
              <div className="d-grid gap-3">
                <button 
                  className="btn btn-outline-primary d-flex align-items-center justify-content-center py-3"
                  onClick={() => navigate(`/home?work=${encodeURIComponent(workLocation)}&price=${priceRange}&type=${hostelType.toLowerCase()}`)}
                  style={{borderRadius: '12px'}}
                >
                  <i className="bi bi-search me-2" style={{fontSize: '1.1rem'}}></i>
                  Find Hostels Near Work
                </button>
                <button 
                  className="btn btn-outline-primary d-flex align-items-center justify-content-center py-3"
                  onClick={() => navigate('/favorites')}
                  style={{borderRadius: '12px'}}
                >
                  <i className="bi bi-heart me-2" style={{fontSize: '1.1rem'}}></i>
                  View Favorites ({favorites.length})
                </button>
                <button 
                  className="btn btn-outline-success d-flex align-items-center justify-content-center py-3"
                  onClick={() => navigate('/my-bookings')}
                  style={{borderRadius: '12px'}}
                >
                  <i className="bi bi-calendar-check me-2" style={{fontSize: '1.1rem'}}></i>
                  My Bookings
                </button>
                <button 
                  className="btn btn-outline-info d-flex align-items-center justify-content-center py-3"
                  onClick={() => navigate('/home')}
                  style={{borderRadius: '12px'}}
                >
                  <i className="bi bi-house me-2" style={{fontSize: '1.1rem'}}></i>
                  Browse All Hostels
                </button>
                <button 
                  className="btn btn-outline-warning d-flex align-items-center justify-content-center py-3"
                  onClick={() => setExpandedSection('preferences')}
                  style={{borderRadius: '12px'}}
                >
                  <i className="bi bi-sliders me-2" style={{fontSize: '1.1rem'}}></i>
                  Update Preferences
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="text-center mt-4">
          <button 
            className="btn btn-outline-danger px-4 py-2" 
            style={{borderRadius: '12px'}}
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-2"></i>
            Logout
          </button>
        </div>
      </div>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}

export default Profile