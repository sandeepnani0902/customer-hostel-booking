import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authService } from '../services/authService'
import 'bootstrap/dist/css/bootstrap.min.css'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      setIsLoading(true)
      try {
        await authService.authenticate(formData.email, formData.password)
        toast.success('Login successful!')
        navigate('/home')
      } catch (error) {
        toast.error(error.message || 'Login failed. Please check your credentials.')
        setErrors({ password: 'Invalid email or password' })
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="login-container">
      <div className="container-fluid">
        <div className="row justify-content-center align-items-center min-vh-100 g-0">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 d-flex justify-content-center">
            <div className="login-card">
              <h2 className="login-title">Welcome Back</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-floating input-field">
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <label htmlFor="email">Email Address</label>
                  <span className="input-icon">📧</span>
                  <div className="error-message">{errors.email || ''}</div>
                </div>
                
                <div className="form-floating password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <label htmlFor="password">Password</label>
                  <span 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️🗨️'}
                  </span>
                  <div className="error-message">{errors.password || ''}</div>
                </div>
                
                <button type="submit" className="btn btn-login w-100" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
              
              <div className="login-footer">
                Don't have an account? <button type="button" className="btn btn-link p-0" onClick={() => navigate('/signup')}>Sign Up</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login