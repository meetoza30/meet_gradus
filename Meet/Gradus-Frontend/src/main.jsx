import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Navbar from './Components/Navbar.jsx'
import HomePage from './Components/HomePage.jsx'
import { Home } from 'lucide-react'
import HomeVideoCard from './Components/HomeVideoCard.jsx'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import VideoPage from './Components/VideoPage.jsx'
import CategoryVideos from './Components/CategoryVideos.jsx'

const router = createHashRouter([
  {
    path:'/',
    element: <App />
  },
  {
    path: 'home',
    element : <HomePage  />
  },
  {
    path: '/videos/:category',
    element : <CategoryVideos  />
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}>
    <App />
    </RouterProvider>
  </StrictMode>,
)
