// src/main.jsx (Restored to load App.jsx)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // ✅ App import wapas
import './index.css';

// Ensure the ID 'root' matches the ID in your index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> {/* ✅ App component wapas render ho raha hai */}
  </React.StrictMode>,
);