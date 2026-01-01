import './App.css'
import { Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FavoritesProvider } from './contexts/FavoritesContext'
import ProtectedRoute from './Components/ProtectedRoute'
import ErrorBoundary from './Components/ErrorBoundary'

// Lazy load components
const Login = lazy(() => import('./Pages/Login'))
const Signup = lazy(() => import('./Pages/Signup'))
const Home = lazy(() => import('./Pages/Home/Home'))
const MensPG = lazy(() => import('./Pages/Pages/MensPG'))
const WomensPG = lazy(() => import('./Pages/Pages/WomensPG'))
const MyBookings = lazy(() => import('./Pages/Pages/MyBookings'))
const HostelDetails = lazy(() => import('./Pages/HostelDetails/HostelDetails'))
const RoomDetails = lazy(() => import('./Pages/RoomDetails/RoomDetails'))
const Favorites = lazy(() => import('./Pages/Favorites'))
const Profile = lazy(() => import('./Pages/Profile/Profile'))

// Loading component
const Loading = () => (
  <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
)

function App() {
  return (
    <ErrorBoundary>
      <FavoritesProvider>
        <div>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Login/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/signup" element={<Signup/>}/>
              <Route path="/home" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
              <Route path="/mens-pg" element={<ProtectedRoute><MensPG/></ProtectedRoute>}/>
              <Route path="/womens-pg" element={<ProtectedRoute><WomensPG/></ProtectedRoute>}/>
              <Route path="/my-bookings" element={<ProtectedRoute><MyBookings/></ProtectedRoute>}/>
              <Route path="/favorites" element={<ProtectedRoute><Favorites/></ProtectedRoute>}/>
              <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
              <Route path="/hostel/:id" element={<ProtectedRoute><ErrorBoundary><HostelDetails/></ErrorBoundary></ProtectedRoute>}/>
              <Route path="/room/:type" element={<ProtectedRoute><RoomDetails/></ProtectedRoute>}/>
            </Routes>
          </Suspense>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
      </FavoritesProvider>
    </ErrorBoundary>
  )
}

export default App
