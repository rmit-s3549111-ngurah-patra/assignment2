import React, { Component } from 'react';
import { apiurl } from "../../helpers/constants";
import firebase from 'firebase';
import { Panel } from 'react-bootstrap';
import {Button} from 'react-bootstrap';

class Tech extends Component {
    state = {
        tickets:[],
        comment:""
    }

    componentDidMount() {
        /* Fetch all tickets and check which tickets have
         been assigned to this tech user
         */
        fetch(apiurl + '/list')
            .then((response) => response.json())
            .then((responseJson) => {
                const myTickets = [];
                for(const ele in responseJson) {
                    firebase.database().ref('ticket/'+responseJson[ele].id).on('value', (snapshot) => {
                        if(snapshot.val() !== null && snapshot.val().user_id === this.props.user.uid) {
                            myTickets.push(responseJson[ele]);

                            /* Force the view to re-render (async problem) */
                            this.forceUpdate();
                        }
                    })
                }
                return myTickets;
            })
            .then((tickets) => {
                this.setState({
                    tickets: tickets
                });
            })
    }

    /* Update comments from dropdown box */
    handleUpdateComment = event => {
        const {value} = event.target;
        this.setState({
            comment: value,
        })
    }

    /* Update the ticket's status from dropdown box */
    handleChangeType = event => {
        // const {value} = event.target;
        // this.setState({
        //     type: value,
        // })

        const { value, name} = event.target;

        fetch(apiurl+"/"+name+"/update", {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: value,
            })
        })
    }
    /* Update the ticket's escalation level from dropdown box */
    handleChangeEscalation = event => {
        // const { value} = event.target;
        // this.setState({
        //     escalation: value,
        // })

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

    /* Clicks submit button */
    handleSubmit = id => event =>{
        console.log(this.state);
        const data = {
            // type: this.state.type,
            // escalation: this.state.escalation,
            comment: this.state.comment,
        }

        /* Updates the data using API */
        fetch(apiurl+"/"+id+"/update", {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })

        alert('Tech successfully assigned to ticket!');
    }

    render () {
        const { tickets } = this.state;
        return (
            <div className="leftSide">
                <h1>My Tickets</h1>
                {/*{JSON.stringify(tickets)}*/}
                {tickets.length < 1 ? (
                    <div className="alert alert-info">You have not been assigned any tickets.</div>
                )
                    : tickets.map((ticket, i) => (
                        <Panel key={i} header={ticket.desc}>
                            <p>Name: {ticket.name}</p>
                            <p>Operating system: {ticket.opsystype}</p>
                            <p>Priority: {ticket.priority}</p>
                            <p>Type:
                                <select className="form-control" name={ticket.id}  onChange={this.handleChangeType} defaultValue="-1">
                                    <option value="-1" defaultValue disabled>{ticket.type}</option>
                                    <option>In Progress</option>
                                    <option>Unresolved</option>
                                    <option>Resolved</option>
                                </select>
                            </p>

                            <p>Escalation Level:
                                <select className="form-control" name={ticket.id}  onChange={this.handleChangeEscalation} defaultValue="-1">
                                    <option value="-1" defaultValue disabled>{ticket.escalation}</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                </select>
                            </p>
                            <p> Comment: <br/>
                                <textarea placeholder={ticket.comment} onChange={this.handleUpdateComment} name={ticket.id}></textarea>
                            </p>
                            <Button bsStyle="success" name={ticket.id} onClick={this.handleSubmit(ticket.id)}>Submit</Button>
                        </Panel>
                    ))}
            </div>
        );
    }
}

export default Tech;