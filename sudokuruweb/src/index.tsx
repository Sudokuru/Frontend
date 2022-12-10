import React from 'react';
import ReactDOM from 'react-dom/client';
import './app/index.css';
import App from './app/App';
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
      <Auth0Provider
          domain={process.env.REACT_APP_DOMAIN as string}
          clientId={process.env.REACT_APP_CLIENT_ID as string}
          redirectUri={window.location.origin}
      >
          <App />
      </Auth0Provider>,
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
