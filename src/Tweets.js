import React, { Component } from 'react';
import axios from 'axios';
import socketIOClient from "socket.io-client";
import ThreeScene from './ThreeScene';


class Tweets extends Component {
    state = {
        tweets: [],
        count: [
            { cat: "arts, culture and entertainment", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: 4, xPosition: -8 },
            { cat: "crime, law and justice", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: -1.75, xPosition: -6 },
            { cat: "disaster and accident", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: -1.25, xPosition: 2 },
            { cat: "economy, business and finance", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: 2.5, xPosition: 1 },
            { cat: "education", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: -0.25, xPosition: 2.5 },
            { cat: "environmental issue", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: -3, xPosition: -6.5 },
            { cat: "health", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: 3, xPosition: -3 },
            { cat: "human interest", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: -3.5, xPosition: -8.25 },
            { cat: "labour", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: 2, xPosition: -5.5 },
            { cat: "lifestyle and leisure", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: -2.5, xPosition: -1.25 },
            { cat: "politics", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: 3.5, xPosition: 3 },
            { cat: "religion and belief", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: -0.75, xPosition: -5 },
            { cat: "science and technology", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: 0, xPosition: -7.75 },
            { cat: "social issue", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: -3.75, xPosition: 2.25 },
            { cat: "sport", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: 1, xPosition: -2 },
            { cat: "unrest, conflicts and war", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: 1.5, xPosition: -7.5 },
            { cat: "weather", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: 1, xPosition: -7 },
            { cat: "unknown", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: -4.25, xPosition: -4 },
        ],
        twAccountNonExistent: false,
        showTwAccountNonExistentMessage: false,
        userDbObj: this.props.userDbObj,
        showToServerButton: false,
    };

    categorySelectedHandler = (e, catName) => {
        this.setState({ count: this.state.count.map(obj => obj.cat === catName ? Object.assign(obj, { displayTweets: !obj.displayTweets }) : obj) });
    }

    categoryEdited = (e) => {
        console.log("Logging from Tweets.js: " + e.tweet.text + " " + e.tweet.id + " " + e.tweet.categoryInput);
        console.log("Category entered manually: " + e.newCat);
        this.setState(prevState => ({
            tweets: prevState.tweets.map(obj => obj.id === e.tweet.id ? Object.assign(obj, { category: e.newCat }) : obj),
            count: prevState.count.map(obj => // 2 ternary operators, 1st increases count if true, 2nd executes if 1st was evaluated as false & decreases count if true, otherwise just returns the existing object
                obj.cat === e.newCat ? Object.assign(obj, { quantity: obj.quantity + 1, ratio: (obj.quantity + 1) / (this.sumValues(this.state.count) + 1), prevRatio: obj.quantity / this.sumValues(this.state.count) }) : obj.cat === e.tweet.categoryInput ? Object.assign(obj, { quantity: obj.quantity - 1, ratio: (obj.quantity - 1) / (this.sumValues(this.state.count) - 1), prevRatio: obj.quantity / this.sumValues(this.state.count) }) : obj)
        }));
    }

    sumValues = obj => obj.reduce((a, b) => a + b.quantity, 0);

    sendToServerHandler = () => {
        axios.post(`${this.props.connectionString}/feed`, {
            editedTweets: this.state.tweets,
            userDbObj: this.state.userDbObj
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    refreshPage = () => { 
        if (this.props.showSpinner) this.props.hideSpinner();
        if (!this.props.twAccountNonExistentMessageState) this.props.showTwAccountNonExistentMessage();
    }

    componentDidMount() {
        if (this.props.includeArchivedTweets) {
            console.log(this.props.archivedTweets);

            if (this.props.includeArchivedTweets.length > 0) { // so not to add an empty array
                const map2 = new Map();
                let categoryCounterObj = {};
                for (const item of this.props.archivedTweets) {
                    if (!map2.has(item.category)) {
                        map2.set(item.category, true);    // set any value to Map
                        categoryCounterObj = {
                            ...categoryCounterObj,
                            [item.category]: item.category,
                            [item.category + 'Count']: 1
                        }
                    } else {
                        categoryCounterObj = { ...categoryCounterObj, [item.category + 'Count']: categoryCounterObj[item.category + 'Count'] + 1 }
                    }
                }
                console.log(categoryCounterObj);

                this.setState(prevState => ({
                    tweets: [...prevState.tweets, this.props.archivedTweets.map(tweet => {
                        return {
                            text: tweet.text,
                            category: tweet.category,
                            id: tweet._id
                        }
                    })],
                    count: prevState.count.map(obj => {
                        return obj.cat === categoryCounterObj[obj.cat] ? Object.assign(obj, { quantity: categoryCounterObj[obj.cat + 'Count'] }) : obj
                    })
                }));
            }
        };

        console.log(this.props.connectionString);
        const socket = socketIOClient(`${this.props.connectionString}/my-namespace`);

        socket.on('welcome', function (data) {
            console.log(data.message);

            socket.emit('i am client', { data: 'I am client and my id is: ', id: data.id }); // Respond with a message including this clients' id sent from the server
        });

        socket.on('singleTweetAnalysed', function (data) {

            const logAnalysedTweet = message => {
                console.log(this.state);
                console.log(message.text);
                console.log(message.category);
                console.log(message.id);
                console.log('**************');

                this.setState(prevState => ({
                    tweets: [...prevState.tweets, {
                        text: message.text,
                        category: message.category,
                        id: message.id
                    }],
                    count: prevState.count.map(obj => obj.cat === message.category ? Object.assign(obj, { quantity: obj.quantity + 1, ratio: (obj.quantity + 1) / (this.sumValues(this.state.count) + 1), prevRatio: obj.quantity / this.sumValues(this.state.count) }) : Object.assign(obj, { ratio: obj.quantity / (this.sumValues(this.state.count) + 1), prevRatio: obj.quantity / this.sumValues(this.state.count) }))
                }));
            }
            logAnalysedTweet(data);
            console.log(this.state);
        }.bind(this));

        socket.on('error', console.error.bind(console));
        socket.on('message', console.log.bind(console));

        axios.get(`${this.props.connectionString}/user/${this.props.user}`, {  
            params: {
                userDbObj: this.state.userDbObj
            }
        })
            .then(response => {
                console.log(response);
                if (response.data.message) console.log(response.data.message);
                if (response.status === 200 && response.data.message !== "Twitter account doesn't exist") this.setState({ showToServerButton: true });
                if (response.data.message === "Twitter account doesn't exist") {
                    this.setState({ twAccountNonExistent: true });
                }

                if (response.data.newUserObj) {
                    this.setState({ userDbObj: response.data.newUserObj });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        this.state.count.map(item => <p style={{ textAlign: 'center' }}>{this.state.errorMessage}</p>);

        if (!this.state.errorMessage) {
            this.state.count.forEach(item => {
                if (item) return console.log(`${item.cat}: ` + item.quantity + "px");
            });
            console.log("Analysed so far: " + this.sumValues(this.state.count));
        }
        return (
            <section>
                {this.state.twAccountNonExistent ? this.refreshPage() : <ThreeScene count={this.state.count}
                    tweets={this.state.tweets}
                    totalTweetsCount={this.sumValues(this.state.count)}
                    categoryEdited={(e) => this.categoryEdited(e)}
                    sendToServer={(e) => this.sendToServerHandler(e)}
                    showToServerButton={this.state.showToServerButton}
                    showSpinner={this.props.showSpinner}
                    hideSpinner={() => this.props.hideSpinner()} />}
            </section>
        )
    }
}

export default Tweets;
