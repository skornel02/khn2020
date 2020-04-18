import React from 'react';
import ReactDOM from 'react-dom';
import './assets/main.css'
import * as serviceWorker from './serviceWorker';
import Drupal from "./resource/Drupal";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
      <App/>
  </React.StrictMode>,
  document.getElementById('root')
);

Drupal.login("testelek", "testelek");
setTimeout(Drupal.logout, 1000);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
