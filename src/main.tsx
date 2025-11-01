import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CrostiApp } from './CrostiApp.tsx'
import { BrowserRouter } from 'react-router-dom'
import { FocacciaStore } from './context/FocacciaStore.tsx'
import { PedidoStore } from './context/PedidoStore.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <PedidoStore>
      <FocacciaStore>
        <StrictMode>
          <CrostiApp />
        </StrictMode>
      </FocacciaStore>
    </PedidoStore>
  </BrowserRouter>
)
