import React from 'react'
import ReactDom from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { HashRouter } from "react-router-dom"
import { CartProvider } from './context/CartContext.jsx'

ReactDom.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <HashRouter>
        <CartProvider>
          <App />
        </CartProvider>
      </HashRouter>
    </AuthProvider>
  </React.StrictMode>
)
