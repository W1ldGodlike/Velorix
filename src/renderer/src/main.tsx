import './assets/base.css'
import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// Renderer bootstrap intentionally small.
// Здесь только React и CSS: вся работа с Electron/FS/процессами идёт через preload API,
// чтобы точка входа UI не превращалась в скрытый слой бизнес-логики.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
