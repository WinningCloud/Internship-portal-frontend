import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { DomainProvider } from './context/DomainContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DomainProvider>
    <AuthProvider>
      <App />
      </AuthProvider>
      </DomainProvider>

  </StrictMode>,
)
