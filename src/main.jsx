import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { StateContextProvider } from './Context/index.jsx'
import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StateContextProvider>
    <Auth0Provider
      domain="dev-zf5fgdrlhunj6gfj.us.auth0.com"
      clientId="MyRuloN7zQiqB65rBtKJz7QTsj5PQikY"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <App />
    </Auth0Provider>
  </StateContextProvider>
);
