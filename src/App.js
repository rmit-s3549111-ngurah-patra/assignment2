import React, { Component } from 'react';
import './App.css';
import { Navbar, Button, Nav, NavItem, Jumbotron } from 'react-bootstrap';
import firebase from 'firebase';
import { Route, Redirect } from 'react-router';
import Dashboard from './components/Dashboard';
import logo from './logo.svg';

class App extends Component {
    state = {
        type: null,
        user: null
    }


    componentWillMount () {
        firebase.auth().onAuthStateChanged(this.handleCredentials);
    }

    componentWillUnmount() {
        if(this.state.user !== null) {
            localStorage.setItem('type', this.state.type);
        }
    }


    handleClick = (type) => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then((success) => { this.handleCredentials(success.user) })
            .then(() => { this.handleLogin(type) });
    }

    handleCredentials = (params) => {
        console.log(params);
        this.setState({
            user: params,
            type: localStorage.getItem('type')
        });
    }

    handleLogin = (type) => {
        localStorage.setItem('type', type);
        this.setState({
            type: type
        });

        /* Add user to our mongodb database */
        /* MongoDB schema - will insert the user's details into the database */
        const user = {};
        user['user/' + this.state.user.uid] = {
            type: type,
            name: this.state.user.displayName,
            id: this.state.user.uid
        };
        firebase.database().ref().update(user)
    }

    handleSignout = () => {
        const vm = this;
        vm.setState({
            user: null,
            type: null
        });
        localStorage.setItem('type', null);
        firebase.auth().signOut().then(function () {
            alert('You have been signed out');
        });
    }


    render() {
        return (
            <div className="App">
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <img src="https://shapermit.com/sites/default/themes/flip_theme/img/rmit-logo.png" style={{width:100}} />
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav pullRight>
                        {this.state.user !== null &&
                        <NavItem onClick={this.handleSignout}>Sign out</NavItem>
                        }
                    </Nav>
                </Navbar>

                <div className="container">

                    <Route exact path="/" render={() => (
                        this.state.user === null ? (
                            <Jumbotron >
                                <img classname="right" src="https://www.idp.com/australia/-/media/IDP/Global/Institution-Carousel-Images-960-x-330/Australia/RMIT/RMITArchitecture.ashx?h=330&w=960&la=en&hash=DB1BB51ADAD5FA553D5097C4E3659C46CD989C53"/>

                                <h1>Hello There!</h1>
                                <h2>Welcome to ITS Admin System. </h2>
                                <h3>Please Login To Continue </h3>
                                <br/>
                                <div className="text-center">
                                    <Button bsSize="large" bsStyle="warning" style={{marginRight:50}} onClick={() => this.handleClick('helpdesk')}>Helpdesk User</Button>
                                    <Button bsSize="large" bsStyle="danger" outline color="success" onClick={() => this.handleClick('tech')}>Tech User</Button>
                                </div>
                            </Jumbotron>
                        )
                            : (
                            <Redirect to="/dashboard" />
                        )
                    )} />
                    <Route exact path="/dashboard" render={() => (
                        this.state.user !== null ? (
                            <Dashboard user={this.state.user} type={this.state.type} />
                        )
                            : (
                            <Redirect to="/" />
                        )
                    )} />
                    <footer className="text-center">
                        <p>
                            Copyright © 2017
                        </p>
                    </footer>
                </div>
            </div>
        );
    }
}

export default App;