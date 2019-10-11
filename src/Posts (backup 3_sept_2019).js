import React, { Component } from 'react';
import axios from 'axios';
import socketIOClient from "socket.io-client";
//import Post from '../../../components/Post/Post';
// import { Link } from 'react-router-dom'; ukoliko koristimo <Link> da postovi budu klikabilni tj. ako ne koristimo this.props.history.push
//import './Posts.css';


class Posts extends Component {
    state = {
        tweets: [],
        count: {
            artsCultureAndEntertainment: 0,
            crimeLawAndJustice: 0,
            disasterAndAccident: 0,
            economyBusinessAndFinance: 0,
            education: 0,
            environmentalIssue: 0,
            health: 0,
            humanInterest: 0,
            labour: 0,
            lifestyleAndLeisure: 0,
            politics: 0,
            religionAndBelief: 0,
            scienceAndTechnology: 0,
            socialIssue: 0,
            sport: 0,
            unrestConflictsAndWar: 0,
            weather: 0
        },
        endpoint: "http://192.168.0.16:8080/my-namespace",
        sumValues: null,
        displaySport: false,
        displaySocialIssue: false,
    }

    sportSelectedHandler = id => {
        this.setState({displaySport: !this.state.displaySport});
    }

    socialIssueSelectedHandler = id => {
        this.setState({displaySocialIssue: !this.state.displaySocialIssue});
    }

    sumValues = obj => Object.values(obj).reduce((a, b) => a + b);

    


    componentDidMount() {
        //console.log(this.props);
        
        const endpoint = this.state.endpoint;
        const socket = socketIOClient(endpoint);

        socket.on('welcome', function (data) {
            addMessage(data.message);

            // Respond with a message including this clients' id sent from the server
            socket.emit('i am client', { data: 'foo!', id: data.id });
        });

        socket.on('singleTweetAnalysed', function (data) {

            const logAnalysedTweet = message => {
                console.log(this.state);
                console.log(message.text);
                console.log(message.category);
                console.log(message.id);
                console.log('**************');

                let artsCultureAndEntertainmentCounter, crimeLawAndJusticeCounter, disasterAndAccidentCounter, economyBusinessAndFinanceCounter, educationCounter,
                    environmentalIssueCounter, healthCounter, humanInterestCounter, labourCounter, lifestyleAndLeisureCounter, politicsCounter, religionAndBeliefCounter,
                    scienceAndTechnologyCounter, socialIssueCounter, sportCounter, unrestConflictsAndWarCounter, weatherCounter;

                artsCultureAndEntertainmentCounter = crimeLawAndJusticeCounter = disasterAndAccidentCounter = economyBusinessAndFinanceCounter = educationCounter = environmentalIssueCounter = healthCounter = humanInterestCounter = labourCounter = lifestyleAndLeisureCounter = politicsCounter = religionAndBeliefCounter = scienceAndTechnologyCounter = socialIssueCounter = sportCounter = unrestConflictsAndWarCounter = weatherCounter = 0;

                if (message.category === "arts, culture and entertainment") artsCultureAndEntertainmentCounter++;
                if (message.category === "crime, law and justice") crimeLawAndJusticeCounter++;
                if (message.category === "disaster and accident") disasterAndAccidentCounter++;
                if (message.category === "economy, business and finance") economyBusinessAndFinanceCounter++;
                if (message.category === "education") educationCounter++;
                if (message.category === "environmental issue") environmentalIssueCounter++;
                if (message.category === "health") healthCounter++;
                if (message.category === "human interest") humanInterestCounter++;
                if (message.category === "labour") labourCounter++;
                if (message.category === "lifestyle and leisure") lifestyleAndLeisureCounter++;
                if (message.category === "politics") politicsCounter++;
                if (message.category === "religion and belief") religionAndBeliefCounter++;
                if (message.category === "science and technology") scienceAndTechnologyCounter++;
                if (message.category === "social issue") socialIssueCounter++;
                if (message.category === "sport") sportCounter++;
                if (message.category === "unrest, conflicts and war") unrestConflictsAndWarCounter++;
                if (message.category === "weather") weatherCounter++;

                // submit(){ // primer setState pomocu funkcije koja koristi prevState (naziv funkcije submit() ovde je proizvoljno dat)
                //     this.setState(function(prevState, props){
                //        return {showForm: !prevState.showForm}
                //     });

                this.setState({
                    //posts: updatePosts
                    tweets: [...this.state.tweets, {
                        text: message.text,
                        category: message.category,
                        id: message.id
                    }],
                    count: {
                        artsCultureAndEntertainment: this.state.count.artsCultureAndEntertainment + artsCultureAndEntertainmentCounter,
                        crimeLawAndJustice: this.state.count.crimeLawAndJustice + crimeLawAndJusticeCounter,
                        disasterAndAccident: this.state.count.disasterAndAccident + disasterAndAccidentCounter,
                        economyBusinessAndFinance: this.state.count.economyBusinessAndFinance + economyBusinessAndFinanceCounter,
                        education: this.state.count.education + educationCounter,
                        environmentalIssue: this.state.count.environmentalIssue + environmentalIssueCounter,
                        health: this.state.count.health + healthCounter,
                        humanInterest: this.state.count.humanInterest + humanInterestCounter,
                        labour: this.state.count.labour + labourCounter,
                        lifestyleAndLeisure: this.state.count.lifestyleAndLeisure + lifestyleAndLeisureCounter,
                        politics: this.state.count.politics + politicsCounter,
                        religionAndBelief: this.state.count.religionAndBelief + religionAndBeliefCounter,
                        scienceAndTechnology: this.state.count.scienceAndTechnology + scienceAndTechnologyCounter,
                        socialIssue: this.state.count.socialIssue + socialIssueCounter,
                        // sport: { abs: this.state.count.sport.abs + sportCounter, rel: null},
                        sport: this.state.count.sport + sportCounter,
                        unrestConflictsAndWar: this.state.count.unrestConflictsAndWar + unrestConflictsAndWarCounter,
                        weather: this.state.count.weather + weatherCounter
                    },
                    // summedValues: this.sumValues(this.state.count)
                })
            }
            logAnalysedTweet(data);
            console.log(this.state);
            // console.log(this.state.summedValues);
        }.bind(this));

        socket.on('error', console.error.bind(console));
        socket.on('message', console.log.bind(console));

        function addMessage(message) {
            console.log(message);
        }

        axios.get(`http://localhost:8080/user/${this.props.user}`)
            .then(response => {
                console.log(response);
                // deo koji sledi je za varijantu bez socket.io u kom slucaju se tek nakon obrade svih tvitova vraca odgovor sa servera
                // const updatePosts = response.data.map((tweet, index) => { // stvaramo novi niz objekata
                //     return {
                //         text: tweet, // tako sto spreadujemo postojece propertije objekata dobijenih sa servera
                //         id: index, // i dodajemo jos jedan property
                //     }
                // })


                // this.setState({
                //     //posts: updatePosts
                //     posts: { tweets: response.data.tweets },
                //     count: {
                //         artsCultureAndEntertainment: response.data.classificationCount.artsCultureAndEntertainmentCounter,
                //         crimeLawAndJustice: response.data.classificationCount.crimeLawAndJusticeCounter,
                //         disasterAndAccident: response.data.classificationCount.disasterAndAccidentCounter,
                //         economyBusinessAndFinance: response.data.classificationCount.economyBusinessAndFinanceCounter,
                //         education: response.data.classificationCount.educationCounter,
                //         environmentalIssue: response.data.classificationCount.environmentalIssueCounter,
                //         health: response.data.classificationCount.healthCounter,
                //         humanInterest: response.data.classificationCount.humanInterestCounter,
                //         labour: response.data.classificationCount.labourCounter,
                //         lifestyleAndLeisure: response.data.classificationCount.lifestyleAndLeisureCounter,
                //         politics: response.data.classificationCount.politicsCounter,
                //         religionAndBelief: response.data.classificationCount.religionAndBeliefCounter,
                //         scienceAndTechnology: response.data.classificationCount.scienceAndTechnologyCounter,
                //         socialIssue: response.data.classificationCount.socialIssueCounter,
                //         sport: response.data.classificationCount.sportCounter,
                //         unrestConflictsAndWar: response.data.classificationCount.unrestConflictsAndWarCounter,
                //         weather: response.data.classificationCount.weatherCounter
                //     }
                // })

            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        //let posts = <p style={{ textAlign: 'center' }}>{this.state.errorMessage}</p>;
        let sportTweets = this.state.tweets.map(tweet => { 
            return tweet.category === "sport" ? <p key={tweet.id}> {tweet.text}<strong>  {tweet.category}</strong></p> : null;
        });
        let socialIssueTweets = this.state.tweets.map(tweet => { 
            return tweet.category === "social issue" ? <p key={tweet.id}> {tweet.text}<strong>  {tweet.category}</strong></p> : null;
        });

        // let sportTweets2 = this.state.count.map(counter => { 
        //     return counter.category > 0 ? <p key={counter.id}> {counter.text}<strong>  {counter.category}</strong></p> : null;
        // });

        let quantifierArtsCultureAndEntertainment = <p style={{ textAlign: 'center' }}>{this.state.errorMessage}</p>;
        let quantifierCrimeLawAndJustice = <p style={{ textAlign: 'center' }}>{this.state.errorMessage}</p>;
        let quantifierDisasterAndAccident = <p style={{ textAlign: 'center' }}>{this.state.errorMessage}</p>;
        let quantifierEconomyBusinessAndFinance = <p style={{ textAlign: 'center' }}>{this.state.errorMessage}</p>;
        let quantifierEducation = <p style={{ textAlign: 'center' }}>{this.state.errorMessage}</p>;
        let quantifierEnvironmentalIssue = <p style={{ textAlign: 'center' }}>{this.state.errorMessage}</p>;
        let quantifierHealth = <p style={{ textAlign: 'center' }}>{this.state.errorMessage}</p>;
        let quantifierHumanInterest = <p style={{ textAlign: 'center' }}>{this.state.errorMessage}</p>;
        let quantifierLabour = <p style={{ textAlign: 'center' }}>{this.state.errorMessage}</p>;
        let quantifierLifestyleAndLeisure = <p style={{ textAlign: 'center' }}>{this.state.errorMessage}</p>;
        let quantifierPolitics = <p style={{ textAlign: 'center' }}>{this.state.errorMessage}</p>;
        let quantifierReligionAndBelief = <p style={{ textAlign: 'center' }}>{this.state.errorMessage}</p>;
        let quantifierScienceAndTechnology = <p style={{ textAlign: 'center' }}>{this.state.errorMessage}</p>;
        let quantifierSocialIssue = <p style={{ textAlign: 'center' }}>{this.state.errorMessage}</p>;
        let quantifierSport = <p style={{ textAlign: 'center' }} >{this.state.errorMessage}</p>;
        let quantifierUnrestConflictsAndWar = <p style={{ textAlign: 'center' }}>{this.state.errorMessage}</p>;
        let quantifierWeather = <p style={{ textAlign: 'center' }}>{this.state.errorMessage}</p>;
        if (!this.state.errorMessage) {

            console.log("quantifierArtsCultureAndEntertainment: " + this.state.count.artsCultureAndEntertainment + "px");
            console.log("quantifierCrimeLawAndJustice: " + this.state.count.crimeLawAndJustice + "px");
            console.log("quantifierDisasterAndAccident: " + this.state.count.disasterAndAccident + "px");
            console.log("quantifierEconomyBusinessAndFinance: " + this.state.count.economyBusinessAndFinance + "px");
            console.log("quantifierEducation: " + this.state.count.education + "px");
            console.log("quantifierEnvironmentalIssue: " + this.state.count.environmentalIssue + "px");
            console.log("quantifierHealth: " + this.state.count.health + "px");
            console.log("quantifierHumanInterest: " + this.state.count.humanInterest + "px");
            console.log("quantifierLabour: " + this.state.count.labour + "px");
            console.log("quantifierLifestyleAndLeisure: " + this.state.count.lifestyleAndLeisure + "px");
            console.log("quantifierPolitics: " + this.state.count.politics + "px");
            console.log("quantifierReligionAndBelief: " + this.state.count.religionAndBelief + "px");
            console.log("quantifierScienceAndTechnology: " + this.state.count.scienceAndTechnology + "px");
            console.log("quantifierSocialIssue: " + this.state.count.socialIssue + "px");
            console.log("quantifierSport: " + this.state.count.sport + "px");
            console.log("quantifierUnrestConflictsAndWar: " + this.state.count.unrestConflictsAndWar + "px");
            console.log("quantifierWeather: " + this.state.count.weather + "px");
            console.log("ukupno analizirano do sada: " + this.sumValues(this.state.count));

            quantifierArtsCultureAndEntertainment = <p style={{ fontSize: this.state.count.artsCultureAndEntertainment * 100 / this.sumValues(this.state.count) + 'px' }}><strong> ARTS, CULTURE AND ENTERTAINMENT </strong></p>
            quantifierCrimeLawAndJustice = <p style={{ fontSize: this.state.count.crimeLawAndJustice * 100 / this.sumValues(this.state.count) + 'px' }}><strong> CRIME, LAW AND JUSTICE </strong></p>
            quantifierDisasterAndAccident = <p style={{ fontSize: this.state.count.disasterAndAccident * 100 / this.sumValues(this.state.count) + 'px' }}><strong> DISASTER AND ACCIDENT </strong></p>
            quantifierEconomyBusinessAndFinance = <p style={{ fontSize: this.state.count.economyBusinessAndFinance * 100 / this.sumValues(this.state.count) + 'px' }}><strong> ECONOMY, BUSINESS AND FINANCE </strong></p>
            quantifierEducation = <p style={{ fontSize: this.state.count.education * 100 / this.sumValues(this.state.count) + 'px' }}><strong> EDUCATION </strong></p>
            quantifierEnvironmentalIssue = <p style={{ fontSize: this.state.count.environmentalIssue * 100 / this.sumValues(this.state.count) + 'px' }}><strong> ENVIRONMENTAL ISSUE </strong></p>
            quantifierHealth = <p style={{ fontSize: this.state.count.health * 100 / this.sumValues(this.state.count) + 'px' }}><strong> HEALTH </strong></p>
            quantifierHumanInterest = <p style={{ fontSize: this.state.count.humanInterest * 100 / this.sumValues(this.state.count) + 'px' }}><strong> HUMAN INTEREST </strong></p>
            quantifierLabour = <p style={{ fontSize: this.state.count.labour * 100 / this.sumValues(this.state.count) + 'px' }}><strong> LABOUR </strong></p>
            quantifierLifestyleAndLeisure = <p style={{ fontSize: this.state.count.lifestyleAndLeisure * 100 / this.sumValues(this.state.count) + 'px' }}><strong> LIFESTYLE AND LEISURE </strong></p>
            quantifierPolitics = <p style={{ fontSize: this.state.count.politics * 100 / this.sumValues(this.state.count) + 'px' }}><strong> POLITICS </strong></p>
            quantifierReligionAndBelief = <p style={{ fontSize: this.state.count.religionAndBelief * 100 / this.sumValues(this.state.count) + 'px' }}><strong> RELIGION AND BELIEF </strong></p>
            quantifierScienceAndTechnology = <p style={{ fontSize: this.state.count.scienceAndTechnology * 100 / this.sumValues(this.state.count) + 'px' }}><strong> SCIENCE AND TECHNOLOGY </strong></p>
            quantifierSocialIssue = <div style={{ fontSize: this.state.count.socialIssue * 100 / this.sumValues(this.state.count) + 'px' }}><strong onClick={this.socialIssueSelectedHandler}> SOCIAL ISSUE </strong><div>{this.state.displaySocialIssue ? socialIssueTweets : null}</div></div>
            quantifierSport = <div style={{ fontSize: this.state.count.sport * 100 / this.sumValues(this.state.count) + 'px' }}><strong onClick={this.sportSelectedHandler}> SPORT </strong><div>{this.state.displaySport ? sportTweets : null}</div></div>
            quantifierUnrestConflictsAndWar = <p style={{ fontSize: this.state.count.unrestConflictsAndWar * 100 / this.sumValues(this.state.count) + 'px' }}><strong> UNREST, CONFLICTS AND WAR </strong></p>
            quantifierWeather = <p style={{ fontSize: this.state.count.weather * 100 / this.sumValues(this.state.count) + 'px' }}><strong> WEATHER </strong></p>
            // posts = this.state.tweets.map(tweet => { // dole u clicked atributu ako je potrebno da metodi prosledimo argument pisemo kao arrow funkciju koja se poziva, da ne treba argument pisali bismo samo clicked={this.postSelectedHandler}
            //     return ( // key atribut stavljamo u Link komponentu jer key mora biti u obavijajucem elementu sto je ovde Link
            //         //<Link to={'/' + post.id} key={post.id}> {/* Link komponentom uvezenom iz react-router-dom obavijamo <Post> tako da ona postaje link sa id-em u url-u */}
            //         <p key={tweet.id}> {tweet.text}  <strong>   {tweet.category} </strong></p>
            //         //</Link>; // ovo mozemo da zakomentarisemo ukoliko koristimo this.props.history.push
            //     )
            // });
            //console.log(posts);
        } /* u gore navedene atribute mogli bismo da rucno spreadujemo i one koje dobijamo preko props-a {...this.props} kako bismo <Post> komponenti prosledili router props */
        return (
            <section className="Posts">
                {this.state.count.artsCultureAndEntertainment > 0 ? quantifierArtsCultureAndEntertainment : null}
                {this.state.count.crimeLawAndJustice > 0 ? quantifierCrimeLawAndJustice : null}
                {this.state.count.disasterAndAccident > 0 ? quantifierDisasterAndAccident : null}
                {this.state.count.economyBusinessAndFinance > 0 ? quantifierEconomyBusinessAndFinance : null}
                {this.state.count.education > 0 ? quantifierEducation : null}
                {this.state.count.environmentalIssue > 0 ? quantifierEnvironmentalIssue : null}
                {this.state.count.health > 0 ? quantifierHealth : null}
                {this.state.count.humanInterest > 0 ? quantifierHumanInterest : null}
                {this.state.count.labour > 0 ? quantifierLabour : null}
                {this.state.count.lifestyleAndLeisure > 0 ? quantifierLifestyleAndLeisure : null}
                {this.state.count.politics > 0 ? quantifierPolitics : null}
                {this.state.count.religionAndBelief > 0 ? quantifierReligionAndBelief : null}
                {this.state.count.scienceAndTechnology > 0 ? quantifierScienceAndTechnology : null}
                {this.state.count.socialIssue > 0 ? quantifierSocialIssue : null}
                {this.state.count.sport > 0 ? quantifierSport : null}
                {this.state.count.unrestConflictsAndWar > 0 ? quantifierUnrestConflictsAndWar : null}
                {this.state.count.weather > 0 ? quantifierWeather : null}
                {/* {posts} */}
            </section>
        )
    }
}

export default Posts;
