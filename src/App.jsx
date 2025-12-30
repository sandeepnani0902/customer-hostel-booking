import './App.css'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <div>
<Routes>
  <Route path="/" element={<Login/>}/>
  <Route path="/signup" element={<Signup/>}/>
</Routes>
    </div>
  )
}

export default App
