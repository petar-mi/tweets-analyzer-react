import React, { Component } from 'react';
import axios from 'axios';
import socketIOClient from "socket.io-client";
import Category from './Category';
import ThreeScene from './ThreeScene';



class Posts extends Component {
    state = {
        tweets: [],
        count: [
            { cat: "arts, culture and entertainment", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: 4, xPosition: -8, sphereY: -1, sphereX: -3 },
            { cat: "crime, law and justice", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: -1.75, xPosition: -6, sphereY: -0.5, sphereX: -2 },
            { cat: "disaster and accident", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: -1.25, xPosition: 2, sphereY: 0, sphereX: -1 },
            { cat: "economy, business and finance", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: 2.5, xPosition: 1, sphereY: 0.5, sphereX: 0 },
            { cat: "education", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: -0.25, xPosition: 2.5, sphereY: 1, sphereX: 1 },
            { cat: "environmental issue", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: -3, xPosition: -6.5, sphereY: -1, sphereX: 2 },
            { cat: "health", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: 3, xPosition: -3, sphereY: -0.5, sphereX: 3 },
            { cat: "human interest", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: -3.5, xPosition: -8.25, sphereY: 0.5, sphereX: -3 },
            { cat: "labour", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: 2, xPosition: -5.5, sphereY: 1, sphereX: -2 },
            { cat: "lifestyle and leisure", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: -2.5, xPosition: -1.25, sphereY: -1, sphereX: -1 },
            { cat: "politics", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: 3.5, xPosition: 3, sphereY: -0.5, sphereX: 0 },
            { cat: "religion and belief", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: -0.75, xPosition: -5, sphereY: 0.5, sphereX: 1 },
            { cat: "science and technology", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: 0, xPosition: -7.75, sphereY: 1, sphereX: 2 },
            { cat: "social issue", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: -3.75, xPosition: 2.25, sphereY: -1, sphereX: 3 },
            { cat: "sport", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: 1, xPosition: -2, sphereY: -0.5, sphereX: -3 },
            { cat: "unrest, conflicts and war", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: 1.5, xPosition: -7.5, sphereY: 0.5, sphereX: -2 },
            { cat: "weather", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: 1, xPosition: -7, sphereY: 1, sphereX: -1 },
            { cat: "unknown", quantity: 0, ratio: 0, prevRatio: 0, displayTweets: false, yPosition: -4.25, xPosition: -4, sphereY: -1, sphereX: 0 },
        ],
        //endpoint: "http://192.168.0.16:8080/my-namespace", // // lokalna adresa za Buska Linux on lenovo laptop 
        //endpoint: "http://127.0.0.1:8080/my-namespace", // lokalna adresa za Zec Linux on desktop nvme M.2
        endpoint: "https://my-express-server.herokuapp.com/my-namespace",
        twAccountNonExistent: false,
        showTwAccountNonExistentMessage: false,
        userDbObj: this.props.userDbObj,
        showToServerButton: false,
    };

    categorySelectedHandler = (e, catName) => {
        console.log(e);
        this.setState({ count: this.state.count.map(obj => obj.cat === catName ? Object.assign(obj, { displayTweets: !obj.displayTweets }) : obj) });
    }

    categoryEdited = (e) => {
        console.log("ispisivanje iz Posts.js: " + e.tweet.text + " " + e.tweet.id + " " + e.tweet.categoryInput);
        console.log("rucno unesena kategorija: " + e.newCat);
        this.setState(prevState => ({
            tweets: prevState.tweets.map(obj => obj.id === e.tweet.id ? Object.assign(obj, { category: e.newCat }) : obj),
            count: prevState.count.map(obj => // ovde su dva ternarna operatora, prvi uvecava count ako je true, drugi se izvrsava ako je prvi evaluisan kao false i umanjuje count ako je true, inace, samo vraca postojeci objekat obj
                obj.cat === e.newCat ? Object.assign(obj, { quantity: obj.quantity + 1, ratio: (obj.quantity + 1) / (this.sumValues(this.state.count) + 1), prevRatio: obj.quantity / this.sumValues(this.state.count) }) : obj.cat === e.tweet.categoryInput ? Object.assign(obj, { quantity: obj.quantity - 1, ratio: (obj.quantity - 1) / (this.sumValues(this.state.count) - 1), prevRatio: obj.quantity / this.sumValues(this.state.count) }) : obj)
        }));
    }

    sumValues = obj => obj.reduce((a, b) => a + b.quantity, 0);

    sendToServerHandler = () => {
        // axios.post('http://localhost:8080/feed', {
        axios.post('https://my-express-server.herokuapp.com/feed', {
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

    refreshPage = () => { // reloaduje celu React app 
        if (this.props.showSpinner) this.props.hideSpinner();
        if (!this.props.twAccountNonExistentMessageState) this.props.showTwAccountNonExistentMessage();
    }

    componentDidMount() {
        if (this.props.includeArchivedTweets) {
            console.log(this.props.archivedTweets);

            if (this.props.includeArchivedTweets.length > 0) { // da ne bi bio dodat prazan niz
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

        const endpoint = this.state.endpoint;
        const socket = socketIOClient(endpoint);

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

        // axios.get(`http://localhost:8080/user/${this.props.user}`, {
        axios.get(`https://my-express-server.herokuapp.com/user/${this.props.user}`, {
            params: {
                userDbObj: this.state.userDbObj
            }
        })
            .then(response => {
                console.log(response);
                if (response.data.message) console.log(response.data.message);
                if (response.status === 200 && response.data.message !== "Ne postoji takav twitter profil") this.setState({ showToServerButton: true });
                if (response.data.message === "Ne postoji takav twitter profil") {
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

        let categories = <p style={{ textAlign: 'center' }}>{this.state.errorMessage}</p>;


        let toServerButton = <button onClick={this.sendToServerHandler} >Send all back to server</button>;

        this.state.count.map(item => <p style={{ textAlign: 'center' }}>{this.state.errorMessage}</p>);


        if (!this.state.errorMessage) {
            this.state.count.forEach(item => {
                if (item) return console.log(`${item.cat}: ` + item.quantity + "px");
            });
            console.log("ukupno analizirano do sada: " + this.sumValues(this.state.count));

            categories = this.state.count.map(item => item.quantity > 0 ? <Category clicked={(e) => this.categorySelectedHandler(e, item.cat)}
                quantity={item.quantity}
                display={item.displayTweets}
                totalTweetsCount={this.sumValues(this.state.count)}
                categoryName={item.cat}
                categoryEdited={(e) => this.categoryEdited(e)}
                tweets={this.state.tweets}
                key={item.cat} /> : null)
        }
        return (
            <section className="Posts">
                {this.state.showToServerButton ? toServerButton : null}
                {categories}

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

export default Posts;
