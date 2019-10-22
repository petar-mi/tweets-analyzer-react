import React, { Component } from 'react';
import axios from 'axios';
import Posts from './Posts';
import Spinner from './Spinner';
import styles from './SendReq.module.scss';


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
    }

    componentDidMount() {
        // console.log(this.props); // ovde mozemo videti props koje nam daje react-router kao sto su history, location i match
        // console.log(this.state);
    }

    componentDidUpdate() {
        //console.log("componentDidUpdate", this.state.showSpinner); // ovde mozemo videti props koje nam daje react-router kao sto su history, location i match
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
            showSpinner: true
        });

        setTimeout(() => this.setState({ showComponent: true }), 200); // potrebno je dati vremena da se ucita spinner
    }

    saArhiviranimPodatacimaHandler = () => {
        this.setState({
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

        return (
            <div className="NewPost" style={{ backgroundColor: '#333333', textAlign: "center" }}>

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