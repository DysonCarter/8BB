import './App.css'
import MainPage from './components/MainPage'
import { Analytics } from '@vercel/analytics/react'

function App() {
  return <>
  <MainPage />
  <Analytics />
  </>
  
}

export default App
