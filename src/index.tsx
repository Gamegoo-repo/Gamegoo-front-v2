import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import './app/styles/globals.css'
import './shared/api/config'

const rootEl = document.getElementById('root')
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
