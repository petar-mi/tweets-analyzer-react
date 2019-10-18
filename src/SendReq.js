import React, { Component } from 'react';
import axios from 'axios';
import Posts from './Posts';
// import socketIOClient from "socket.io-client";
// import { Redirect } from 'react-router-dom'; // ako zelimo da koristimo Redirect komponentu
//import ThreeScene from './ThreeScene';
import Spinner from './Spinner';
import styles from './SendReq.module.scss';
// import { Route, NavLink, Link, Switch } from 'react-router-dom';
// import { BrowserRouter } from 'react-router-dom';


class SendReq extends Component {
    state = {
        username: '',
        showComponent: false,
        prikaziUpitnik: false,
        response: false,
        archivedTweets: [],
        includeArchivedTweets: false,
        userDbObj: {},
        showSpinner: false,
        showTwAccountNonExistentMessage: false,

        // endpoint: "http://192.168.0.16:8080/my-namespace"
        //submitted: false // ovo je za slucaj da koristimo Redirect
    }

    componentDidMount() {
        console.log(this.props); // ovde mozemo videti props koje nam daje react-router kao sto su history, location i match
        console.log(this.state);
        // const endpoint = this.state.endpoint;
        // const socket = socketIOClient(endpoint);
        // socket.on('welcome', function(data) {
        //     addMessage(data.message);

        //     // Respond with a message including this clients' id sent from the server
        //     socket.emit('i am client', {data: 'foo!', id: data.id});
        // });
        // // socket.on('time', function(data) {
        // //     addMessage(data.time);
        // // });

        // socket.on('singleTweetAnalysed', function(data) {
        //     logAnalysedTweet(data);
        // });

        // socket.on('error', console.error.bind(console));
        // socket.on('message', console.log.bind(console));

        // function addMessage(message) {
        //     console.log(message);
        // }
        // function logAnalysedTweet(message) {
        //     console.log(message.text);
        //     console.log(message.category);
        //     console.log(message.id);
        //     console.log('**************');
        // }
    }

    componentDidUpdate() {
        console.log("componentDidUpdate", this.state.showSpinner); // ovde mozemo videti props koje nam daje react-router kao sto su history, location i match
        // const endpoint = this.state.endpoint;
        // const socket = socketIOClient(endpoint);
        // socket.on('welcome', function(data) {
        //     addMessage(data.message);

        //     // Respond with a message including this clients' id sent from the server
        //     socket.emit('i am client', {data: 'foo!', id: data.id});
        // });
        // // socket.on('time', function(data) {
        // //     addMessage(data.time);
        // // });

        // socket.on('singleTweetAnalysed', function(data) {
        //     logAnalysedTweet(data);
        // });

        // socket.on('error', console.error.bind(console));
        // socket.on('message', console.log.bind(console));

        // function addMessage(message) {
        //     console.log(message);
        // }
        // function logAnalysedTweet(message) {
        //     console.log(message.text);
        //     console.log(message.category);
        //     console.log(message.id);
        //     console.log('**************');
        // }
    }

    postDataHandler = (username) => {
        this.setState({ showSpinner: true });

        // axios.get(`http://localhost:8080/checkUser/${username}`)
            axios.get(`https://my-express-server.herokuapp.com/checkUser/${username}`)
            .then(response => {
                console.log(response);
                console.log(this.state.userDbObj);
                if (response.data.message === "NE postoji u bazi") {
                    console.log(this.state);
                    this.setState({ showComponent: true })
                    console.log(this.state);
                } else if (response.data.message === "postoji u bazi") {

                    console.log(response.data.tweetsArray);
                    this.setState({
                        prikaziUpitnik: true,
                        showSpinner: false,
                        archivedTweets: response.data.tweetsArray,
                        userDbObj: response.data.user,
                        showTwAccountNonExistentMessage: false
                    });
                    console.log(this.state.userDbObj);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    bezArhiviranihPodatakaHandler = () => {
        this.setState({
            //showComponent: true,
            showSpinner: true
        });

        setTimeout(() => this.setState({ showComponent: true }), 200); // potrebno je dati vremena da se ucita spinner
    }

    saArhiviranimPodatacimaHandler = () => {
        this.setState({
            // showComponent: true,
            includeArchivedTweets: true,
            showSpinner: true
        });

        setTimeout(() => this.setState({ showComponent: true }), 200); // potrebno je dati vremena da se ucita spinner
    }

    showTwAccountNonExistentMessageHandler = () => {
        this.setState({
            showTwAccountNonExistentMessage: true,
            username: '',
            showComponent: false,
            prikaziUpitnik: false,
            response: false,
            archivedTweets: [],
            includeArchivedTweets: false,
            userDbObj: {},
            showSpinner: false,
        })
    }


    render() {
        let upitnik = (
            // <div style={{ clear: 'both', color: '#999999', paddingTop: '20px', textAlign: 'center' }}>
            <div className={styles.centered} style={{ textAlign: 'center', color: '#999999' }}>
                <div style={{ marginBottom: '25px' }}>
                    <p>User exists in a database.</p>
                    <p>Would you like to include archived tweets in the analysis?</p>
                </div>
                <button className={styles.noYesButton} style={{ float: 'left', marginLeft: '130px' }} onClick={this.bezArhiviranihPodatakaHandler} >No</button>
                <button className={styles.noYesButton} style={{ float: 'right', marginRight: '130px' }} onClick={this.saArhiviranimPodatacimaHandler} >Yes</button>
            </div>
        );

        let inputDiv = (
            <div className={styles.centered}>
                <div className={styles.group}><input type="text" id="name" required="required" value={this.state.username} onChange={(event) => this.setState({ username: event.target.value })} /><label htmlFor="name">Enter twitter username</label>
                    <div className={styles.bar}></div>
                </div>
                <button onClick={() => this.postDataHandler(this.state.username)} className={styles.sendButton}>Retrieve tweets</button>
            </div>
        );

        const twAccountNonExistentMessage = <div style={{ fontSize: "35px", top: "400px", bottom: 0, right: 0, left: 0, margin: 'auto', width: "550px", height: "110px", position: "absolute", fontWeight: "bold", color: "#FF0000" }}>Twitter account doesn't exist. Please try again.</div>;// styles imitira stil centered klase od inputa iznad, s tim sto dodaje top=400px kako bi se smestilo ispod

        // let spinner = null;

        // if (this.state.showSpinner) spinner = <Spinner />;

        // let posts = null;

        // if (this.state.showComponent) {
        //     posts = (<Posts user={this.state.username} 
        //             userDbObj={this.state.userDbObj}
        //             archivedTweets={this.state.archivedTweets} 
        //             includeArchivedTweets={this.state.includeArchivedTweets}
        //             hideSpinner={() => this.setState({ showSpinner: false }) }/>)
        // }

        // let redirect = null; // ako se ne koristi this.props.history
        //if (this.state.submitted) redirect = <Redirect to="/" />; // ovo nam omogucava uslovni redirect, koji se izvrsava nakon sto postujemo formu (ako se ne koristi this.props.history)
        return (
            <div className="NewPost" style={{ backgroundColor: '#333333', textAlign: "center" }}>

                {/* <label>Enter twitter username</label>
                <input type="text" value={this.state.username} onChange={(event) => this.setState({ username: event.target.value })} /> */}


                {this.state.prikaziUpitnik ? upitnik : inputDiv}
                {this.state.showTwAccountNonExistentMessage ? twAccountNonExistentMessage : null}



                {this.state.showSpinner ? <Spinner /> : null}
                {this.state.showComponent ? <Posts user={this.state.username}
                    userDbObj={this.state.userDbObj}
                    archivedTweets={this.state.archivedTweets}
                    includeArchivedTweets={this.state.includeArchivedTweets}
                    showTwAccountNonExistentMessage={() => this.showTwAccountNonExistentMessageHandler()}
                    twAccountNonExistentMessageState={this.state.showTwAccountNonExistentMessage}
                    showSpinner={this.state.showSpinner}
                    hideSpinner={() => this.setState({ showSpinner: false })} /> : null}
            </div>
        );
    }
}

export default SendReq;