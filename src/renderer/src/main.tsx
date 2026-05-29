import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './assets/app.css'
import { App } from './App'

const rootEl = document.getElementById('root')
if (rootEl != null) {
  rootEl.setAttribute('data-velorix-ui', 'neon-kit')
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
