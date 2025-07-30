import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UserProvider } from './contexts/UserContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import "./i18n"; // Importa tu configuración i18n

createRoot(document.getElementById('root')!).render(
    <UserProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT || ""}>
        <App />
      </GoogleOAuthProvider>
    </UserProvider>,
)
