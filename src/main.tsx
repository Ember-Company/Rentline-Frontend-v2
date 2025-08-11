import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * Entrypoint for the Rentline UI. This file is deliberately concise; all
 * application composition is delegated to the `App` component. Having a
 * trivial entrypoint makes it easy to test the remainder of the code in
 * isolation and keeps bootstrapping logic in one place. If additional
 * providers need to be added (e.g. localisation, theming) they should be
 * composed inside `App` to avoid leaking concerns into the bootstrap.
 */
const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Missing root element');
}
ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);