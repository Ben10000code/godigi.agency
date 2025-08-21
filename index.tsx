import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Find the root DOM element where the React app will be mounted.
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element with id 'root' in the document.");
}

// Create a root for the React application using the new React 18 API.
// This enables concurrent features and improved performance.
const root = ReactDOM.createRoot(rootElement);

// Render the main App component into the root.
// React.StrictMode is a wrapper that helps identify potential problems in an application.
// It activates additional checks and warnings for its descendants.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
