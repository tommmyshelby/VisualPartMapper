
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CssBaseline, ThemeProvider } from '@mui/material'
import theme from './ui/theme.ts'

createRoot(document.getElementById('root')!).render(
 
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  
)
