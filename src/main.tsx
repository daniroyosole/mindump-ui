import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UserProvider } from './contexts/UserContext'
import { DiaryProvider } from 'contexts/DiaryContext.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <GoogleOAuthProvider clientId="36780066818-3p1nlpsn5bli675s50jjt4cnv44etan7.apps.googleusercontent.com">
        <DiaryProvider>
          <App />
        </DiaryProvider>
      </GoogleOAuthProvider>
    </UserProvider>
  </StrictMode>,
)
