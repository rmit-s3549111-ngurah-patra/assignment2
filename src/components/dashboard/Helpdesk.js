import React, { Component } from 'react';
import { apiurl } from '../../helpers/constants';
import { Table, Row, Col, Jumbotron, Button } from 'react-bootstrap';
import firebase from 'firebase';
// import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';


class Helpdesk extends Component {


    state = {
        tickets: [],
        assignTickets: [],
        view: "list",
        selectedTicket: null,
        techUsers: [],
        selectedTech: null,

        updateEscalation: "",
        updatePriority: "",

    }

    /* Once component has mounted, fetch from API + firebase */
    componentDidMount() {
        /* Fetch all tickets that have NOT been assigned */
        fetch(apiurl + '/list')
            .then((response) => response.json())
            .then((responseJson) => {
                const pendingTickets = [];
                for(const ele in responseJson) {
                    firebase.database().ref('ticket/'+responseJson[ele].id).on('value', (snapshot) => {
                        if(snapshot.val() === null) {
                            pendingTickets.push(responseJson[ele]);

                            /* Force the view to re-render (async problem) */
                            this.forceUpdate();
                        }
                    })
                }
                return pendingTickets;
            })
            .then((tickets) => {
                this.setState({
                    tickets: tickets
                });
            })

        /* Fetch all tickets that have been assigned */
        fetch(apiurl + '/list')
            .then((response) => response.json())
            .then((responseJson) => {
                const assignTickets = [];
                for(const ele in responseJson) {
                    firebase.database().ref('ticket/'+responseJson[ele].id).on('value', (snapshot) => {
                        if(snapshot.val() !== null) {
                            assignTickets.push(responseJson[ele]);

                            /* Force the view to re-render (async problem) */
                            this.forceUpdate();
                        }
                    })
                }
                return assignTickets;
            })
            .then((tickets) => {
                this.setState({
                    assignTickets: tickets
                });
            })

        /* Creates a firebase listener which will automatically
         update the list of tech users every time a new tech
         registers into the system
         */
        const users = firebase.database().ref('user/')
        users.on('value', (snapshot) => {
            const tempTech = [];
            for(const ele in snapshot.val()) {
                if(snapshot.val()[ele].type === 'tech') {
                    tempTech.push(snapshot.val()[ele]);
                }
            }
            this.setState({
                techUsers: tempTech
            });
        })
    }

    /* Toggle the ticket dialog */
    ticketDetailsClick = (ticket) => {
        const { selectedTicket } = this.state;
        this.setState({
            selectedTicket: (selectedTicket !== null && selectedTicket.id === ticket.id ? null : ticket)
        });
    }

    /* Close button for dialog */
    closeDialogClick = () => {
        this.setState({
            selectedTicket: null
        })
    }


    /* Update the selected tech from dropdown box */
    handleTechChange = (e) => {
        this.setState({
            selectedTech: e.target.value
        });
    }

    /* Click assign button */
    assignTicketToTech = () => {
        if(this.state.selectedTech === null) {
            return;
        }

        /* Add assigned ticket+tech into database*/
        const data = {};
        data['ticket/' + this.state.selectedTicket.id] = {
            ticket_id: this.state.selectedTicket.id,
            user_id: this.state.selectedTech // stored Tech ID
        };
        firebase.database().ref().update(data)
        alert('Tech successfully assigned to ticket!');
        window.location.reload();
    }

    /* Add the ticket's escalation level into database from dropdown box */
    handleChangeEscalation = event => {
        const { value, name} = event.target;

        fetch(apiurl+"/"+name+"/update", {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                escalation: value,
            })
        })
    }

    /* Add the ticket's priority level into database from dropdown box */
    handleChangePriority = event => {
        const { value, name} = event.target;

        fetch(apiurl+"/"+name+"/update", {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                priority: value,
            })
        })
    }

    /* Render the page! */
    render () {
        const vm = this
        const { selectedTicket,tickets ,techUsers, assignTickets } = this.state

        const select = this.select;


        return (
            <div classname="white">
                <Row>
                    <Col md={(selectedTicket !== null ? 7 : 12)}>
                        <h1>Pending Tickets</h1>
                        {tickets.length < 1 && (
                            <p className="alert alert-info">There are no tickets to display.</p>
                        )}
                        <Table striped hover>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>OS</th>
                                <th>Description</th>
                                <th>Escalation</th>
                                <th>Priority</th>
                                <th>Assign</th>

                            </tr>
                            </thead>
                            <tbody>
                            {tickets.map((ticket, i) => (
                                <tr key={i}>
                                    <td>{ticket.id}</td>
                                    <td>{ticket.name}</td>
                                    <td>{ticket.opsystype}</td>
                                    <td>{ticket.desc}</td>
                                    <td><div>
                                        <select  className="form-control" name={ticket.id}  onChange={this.handleChangeEscalation} defaultValue="-1">
                                            <option value="-1" defaultValue disabled>Escalation Level</option>
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
                                        </select>
                                    </div></td>
                                    <td> <select value={this.state.priority} className="form-control" name={ticket.id} onChange={this.handleChangePriority} defaultValue="-1">
                                        <option value="-1" defaultValue disabled>Priority</option>
                                        <option value={"low"}>Low</option>
                                        <option value={"moderate"}>Moderate</option>
                                        <option value={"high"}>High</option>
                                    </select>
                                    </td>
                                    <td>
                                        <Button bsStyle={vm.state.selectedTicket !== null && vm.state.selectedTicket.id === ticket.id ? 'success' : 'info'} onClick={() => vm.ticketDetailsClick(ticket)}>More Details</Button>
                                    </td>
                                    {/*<button onClick={select(i)}></button>*/}
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                        <h1>Assigned Tickets</h1>

                        <Table striped hover>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Escalation</th>
                                <th>Priority</th>
                                <th>Assign</th>
                            </tr>
                            </thead>

                            <tbody>

                            {assignTickets.map((ticket, i) => (
                                <tr key={i}>
                                    <td>{ticket.id}</td>
                                    <td>{ticket.name}</td>
                                    <td><div>

                                        <select value={this.state.escalation} className="form-control" name={ticket.id}  onChange={this.handleChangeEscalation} defaultValue="-1">
                                            <option value="-1" defaultValue disabled>{ticket.escalation}</option>
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
                                        </select>
                                    </div></td>
                                    <td> <select className="form-control"  name={ticket.id} onChange={this.handleChangePriority} defaultValue="-1">
                                        <option value="-1" defaultValue disabled>{ticket.priority}</option>
                                        <option value={"low"}>Low</option>
                                        <option value={"moderate"}>Moderate</option>
                                        <option value={"high"}>High</option>
                                    </select>
                                    </td>
                                    <td>
                                        <Button bsStyle={vm.state.selectedTicket !== null && vm.state.selectedTicket.id === ticket.id ? 'success' : 'info'} onClick={() => vm.ticketDetailsClick(ticket)}>More Details</Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Col>

                    {selectedTicket !== null && (
                        <Col md={5}>
                            <Jumbotron style={{padding: 10}}>
                                <Button block bsStyle="danger" onClick={this.closeDialogClick}>Close Dialog</Button>
                                <h3 className="text-uppercase">Ticket Details</h3>
                                <p><b>ID: </b>{selectedTicket.id}</p>
                                <p><b>Name: </b><br/>{selectedTicket.name}</p>
                                <p><b>Description: </b><br/>{selectedTicket.desc}</p>
                                {techUsers.length > 0 && (
                                    <div>
                                        <hr/>
                                        <h3 className="text-uppercase">Assign to tech</h3>
                                        <select className="form-control" onChange={this.handleTechChange} defaultValue="-1">
                                            <option value="-1" defaultValue disabled>Select a tech user</option>
                                            {techUsers.map((user, i) => (
                                                <option key={i} value={user.id}>{user.name}</option>
                                            ))}
                                        </select>
                                        <div className="clearfix"><br/>
                                            <Button className="pull-right" bsStyle="success" onClick={this.assignTicketToTech}>Assign</Button>
                                        </div>
                                    </div>

                                )
                                }
                            </Jumbotron>

                        </Col>

                    )}
                </Row>
            </div>

        );
    }
}


export default Helpdesk;