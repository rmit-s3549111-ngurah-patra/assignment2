import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import App from './App';
import firebase from 'firebase';
import {BrowserRouter} from "react-router-dom";

const muiTheme = getMuiTheme({
    appBar: {
        color: "#37517E",
        height: 50
    },
});

const config = {
    apiKey: "AIzaSyCpZrhHkt37FRx_FyE3cTy1lgPsMY_o34g",
    authDomain: "react-login-449a1.firebaseapp.com",
    databaseURL: "https://react-login-449a1.firebaseio.com",
    projectId: "react-login-449a1",
    storageBucket: "react-login-449a1.appspot.com",
    messagingSenderId: "724119987569"
};
firebase.initializeApp(config);

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
    , document.getElementById('root'));
registerServiceWorker();



