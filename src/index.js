// Import React library
import React from 'react';

// Import ReactDOM for rendering the React app to the browser
import ReactDOM from 'react-dom/client';

// Import BrowserRouter for enabling routing in the app
// This allows navigation without full page reloads
import { BrowserRouter } from 'react-router-dom';

// Import the main App component
import App from './App';

// Import Bootstrap styles for UI styling
import 'bootstrap/dist/css/bootstrap.min.css';


// Get the root HTML element where the React app will mount
// This corresponds to <div id="root"></div> in index.html
const container = document.getElementById('root');

// Create a React root using React 18's createRoot API
// This enables concurrent features and better performance
const root = ReactDOM.createRoot(container);

// Render the application into the root element
root.render(
  <React.StrictMode>
    
    {/* BrowserRouter wraps the entire App
        This makes routing available throughout the application */}
    <BrowserRouter>
      <App />
    </BrowserRouter>

  </React.StrictMode>
);

/*
React.StrictMode:
- Helps detect potential problems in development
- Does NOT affect production build
- Can cause some components to render twice in development (this is normal)

The commented section below is for performance measurement (optional):
You can use reportWebVitals to log performance metrics
or send them to an analytics service.
*/
