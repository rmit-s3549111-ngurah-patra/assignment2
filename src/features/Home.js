import React, { Component } from 'react';
// import './App.css';
// import React from "react";
import {sAvatar, RaisedButton} from "material-ui";
import {logout} from "../helpers/auth";

// Material UI Components
import {
    MuiThemeProvider,
    AppBar,
} from 'material-ui';
import {
    Table,
    TableBody,
    TableFooter,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

// Theme
import {deepOrange500}  from 'material-ui/styles/colors';
import getMuiTheme      from 'material-ui/styles/getMuiTheme';

// The muiTheme we apply to MuiThemeProvider
const muiTheme = getMuiTheme({
    palette: {
        accent1Color: deepOrange500,
    },
});
const appTokenKey = "appToken"; // also duplicated in Login.js
export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            //firebaseUser: JSON.parse(localStorage.getItem("firebaseUser"))
        };

        //console.log("User:", this.state.firebaseUser);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout() {
        logout().then(function () {
            localStorage.removeItem(appTokenKey);
            this.props.history.push("/login");
            console.log("user signed out from firebase");
        }.bind(this));

    }

    render() {
        const styles = {
            propContainer: {
                width: 200,
                overflow: 'hidden',
                margin: '20px auto 0',
            },
            propToggleHeader: {
                margin: '20px auto 10px',
            },
        };

        return (
            <div>
                <div>
                    <RaisedButton
                        backgroundColor="#a4c639"
                        labelColor="#ffffff"
                        label="Sign Out"
                        onTouchTap={this.handleLogout}
                    />
                </div>


                     <div>

                  <AppBar title="ITS HELPDESK"/>
                         <Table>
                    <TableHeader>
                    <TableRow>
                    <TableHeaderColumn colSpan="7" tooltip="Super Header" style={{textAlign: 'center'}}>
                    Ticket submit by student
                   </TableHeaderColumn>
                    </TableRow>
                   <TableRow>
                    <TableHeaderColumn tooltip="The ID">ID</TableHeaderColumn>
                    <TableHeaderColumn tooltip="The Name">Name</TableHeaderColumn>
                    <TableHeaderColumn tooltip="The Status">Email</TableHeaderColumn>
                    <TableHeaderColumn tooltip="The Name">Phone</TableHeaderColumn>
                    <TableHeaderColumn tooltip="The Status">Operating System</TableHeaderColumn>
                    <TableHeaderColumn tooltip="The Name">Type</TableHeaderColumn>
                    <TableHeaderColumn tooltip="The Status">Description</TableHeaderColumn>
                   </TableRow>
                    </TableHeader>
                         </Table>
                     </div>

            </div>
        );
    }
}
