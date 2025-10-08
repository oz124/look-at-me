import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize security (commented out for now to fix display issue)
// import { initializeSecurity } from './lib/frontend-security'
// initializeSecurity();

createRoot(document.getElementById("root")!).render(<App />);
