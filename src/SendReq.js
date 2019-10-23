import React, { Component } from 'react';
import axios from 'axios';
import Tweets from './Tweets';
import Spinner from './Spinner';
import styles from './styles/SendReq.module.scss';


class SendReq extends Component {
    state = {
        username: '',
        showTweetsComponent: false,
        showQuestion: false,
        archivedTweets: [],
        includeArchivedTweets: false,
        userDbObj: {},
        showSpinner: false,
        showTwAccountNonExistentMessage: false,
        hideInputDiv: false,
        connectionString: ""
    }

    componentDidMount() {
        // console.log(this.props); // logs props given by react-router such as history, location & match

        // checks for env var REACT_APP_MY_MACHINE to set the connection string
        // react env vars must start with REACT_APP to be recognized by react app (the var is stored in hidden .bashrc file in Home directory)
        process.env.REACT_APP_MY_MACHINE && process.env.REACT_APP_MY_MACHINE === "zekan" ? this.setState({ connectionString: "http://127.0.0.1:8080" }) : this.setState({ connectionString: "https://my-express-server.herokuapp.com" });
    }

    componentDidUpdate() {
        //console.log("componentDidUpdate", this.state.showSpinner);
    }

    postDataHandler = (username) => {
        this.setState({ showSpinner: true });

        axios.get(`${this.state.connectionString}/checkUser/${username}`)
            .then(response => {
                console.log(response);
                console.log(this.state.userDbObj);
                if (response.data.message === "doesn't exist in db") {
                    console.log(this.state);
                    this.setState({ showTweetsComponent: true })
                    console.log(this.state);
                } else if (response.data.message === "exists in db") {

                    console.log(response.data.tweetsArray);
                    this.setState({
                        showQuestion: true,
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

    withOutArchivedTweetsHandler = () => {
        this.setState({
            showSpinner: true,
            showQuestion: false,
            hideInputDiv: true,
        });

        setTimeout(() => this.setState({ showTweetsComponent: true }), 200); // some time is needed for spinner to load completely
    }

    withArchivedTweetsHandler = () => {
        this.setState({
            includeArchivedTweets: true,
            showSpinner: true,
            showQuestion: false,
            hideInputDiv: true,
        });

        setTimeout(() => this.setState({ showTweetsComponent: true }), 200); // some time is needed for spinner to load completely
    }

    showTwAccountNonExistentMessageHandler = () => {
        this.setState({ // resets this.state to initial values
            showTwAccountNonExistentMessage: true,
            username: '',
            showTweetsComponent: false,
            showQuestion: false,
            archivedTweets: [],
            includeArchivedTweets: false,
            userDbObj: {},
            showSpinner: false,
        })
    }


    render() {
        let question = (
            <div className={styles.centered} style={{ textAlign: 'center', color: '#999999' }}>
                <div style={{ marginBottom: '25px' }}>
                    <p>User exists in a database.</p>
                    <p>Would you like to include archived tweets in the analysis?</p>
                </div>
                <button className={styles.noYesButton} style={{ float: 'left', marginLeft: '130px' }} onClick={this.withOutArchivedTweetsHandler} >No</button>
                <button className={styles.noYesButton} style={{ float: 'right', marginRight: '130px' }} onClick={this.withArchivedTweetsHandler} >Yes</button>
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

        const twAccountNonExistentMessage = <div className={styles.twAccountNonExistentMessage}>Twitter account doesn't exist. Please try again.</div>;// styles.twAccountNonExistentMessage is the same as styles.centered (applied above), but takes the value top: 400px so to be placed under input

        return (
            <div style={{ textAlign: "center" }}>
                {this.state.showQuestion ? question : this.state.hideInputDiv ? null : inputDiv}
                {this.state.showTwAccountNonExistentMessage ? twAccountNonExistentMessage : null}
                {this.state.showSpinner ? <Spinner /> : null}
                {this.state.showTweetsComponent ? <Tweets user={this.state.username}
                    userDbObj={this.state.userDbObj}
                    archivedTweets={this.state.archivedTweets}
                    includeArchivedTweets={this.state.includeArchivedTweets}
                    showTwAccountNonExistentMessage={() => this.showTwAccountNonExistentMessageHandler()}
                    twAccountNonExistentMessageState={this.state.showTwAccountNonExistentMessage}
                    connectionString={this.state.connectionString}
                    showSpinner={this.state.showSpinner}
                    hideSpinner={() => this.setState({ showSpinner: false })} /> : null}
            </div>
        );
    }
}

export default SendReq;