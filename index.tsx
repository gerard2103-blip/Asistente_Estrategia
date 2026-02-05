
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Fatal Error: Could not find the root DOM element with id='root'. The application cannot be mounted.");
  }

  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

} catch (error) {
  console.error("A critical error occurred during application initialization in index.tsx:", error);
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const errorStack = error instanceof Error ? error.stack : String(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    rootElement.innerHTML = `
      <div style="padding: 2rem; font-family: sans-serif; color: #b91c1c; background-color: #fef2f2; border: 2px solid #f87171; margin: 1rem; border-radius: 8px;">
        <h1 style="font-size: 1.5rem; font-weight: bold; color: #991b1b;">Application Failed to Start</h1>
        <p style="margin-top: 0.5rem;">A critical error prevented the application from loading. Please check the browser console for more details.</p>
        <pre style="white-space: pre-wrap; word-wrap: break-word; background-color: #fee2e2; border: 1px solid #fca5a5; padding: 1rem; margin-top: 1rem; font-family: monospace; font-size: 0.875rem; color: #7f1d1d; border-radius: 4px;"><strong>Error:</strong> ${errorMessage}\n\n<strong>Stack Trace:</strong>\n${errorStack}</pre>
      </div>
    `;
  }
}