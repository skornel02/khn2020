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

Drupal.login("testelek", "testelek")
    .then(() => {
        Drupal.backend.getUsers().then(result => {
            console.log("users", result);
        });
        Drupal.backend.getLocations().then(result => {
            console.log("locations", result);
        });
        Drupal.backend.getRule().then(result => {
            console.log("rule", result);
        });
        Drupal.backend.getEventRequests().then(result => {
            console.log("requests", result);
        });
        Drupal.backend.getScheduleEvent().then(result => {
            console.log("events", result);
        });

        Drupal.backend.createRule({
            name: "React rule",
            repeatRule: "0",
            startTime: "12:30:00",
            length: "01:00:00",
            users: [30, 5]
        });

        Drupal.logout();
    });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
