import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './styles.css'
import App from './App.jsx'
import Footer from './components/Footer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="app-shell">
      <App />
      <Footer />
    </div>
  </StrictMode>,
)
