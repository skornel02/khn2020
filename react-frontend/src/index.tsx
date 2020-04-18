import React from 'react';
import ReactDOM from 'react-dom';
import './assets/main.css'
import Login from './Login';
import * as serviceWorker from './serviceWorker';
import Drupal from "./resource/Drupal";

ReactDOM.render(
  <React.StrictMode>
    <Login />
  </React.StrictMode>,
  document.getElementById('root')
);

Drupal.login("testelek", "testelek");

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
