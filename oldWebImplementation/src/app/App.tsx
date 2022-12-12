import React from 'react';
//@ts-ignore
import logo from './logo.svg';
import './App.css';
import './Auth0/Auth0'
import {LoginButton, LogoutButton} from "./Auth0/Auth0";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <LoginButton></LoginButton>
        <LogoutButton></LogoutButton>
        <p>
        {`This is ${process.env.REACT_APP_NAME}`}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
