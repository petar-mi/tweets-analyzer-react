import React from 'react';
//import { withRouter } from 'react-router-dom';
//import './Post.css';
import SingleTweet from './SingleTweet';

const Category = (props) => {
    function  categorySelectedHandler(e){
        console.log("ispisivanje iz Category.js: " + e.tweet.text + " " + e.tweet.id + " " + e.tweet.categoryInput);
        console.log("rucno unesena kategorija: " + e.newCat);
        props.categoryEdited(e);
     }
    return (
    <article className="Category" >
        <div style={{ fontSize: props.quantity / props.totalTweetsCount * 100  + 'px' }} >
            <strong onClick={(e) => props.clicked(e)}> {props.categoryName}</strong>
            {props.display ? props.tweets.map(tweet => {
            return tweet.category === props.categoryName ? 
            <SingleTweet key={tweet.id} 
                         id={tweet.id} 
                         text={tweet.text} 
                         category={tweet.category}
                         categoryEdited={(e) => categorySelectedHandler(e)} /> : null}) : null}
        </div>
    </article>
)};

export default Category;