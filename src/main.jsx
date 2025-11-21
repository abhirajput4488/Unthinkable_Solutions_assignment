// src/main.jsx or src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// 👇 Ensure this line exists and the path is correct
import './index.css'; 
// If your main CSS file is in a different location, adjust the path (e.g., './styles/index.css')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);