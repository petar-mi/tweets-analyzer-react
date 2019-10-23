import React, { Component } from 'react';
import Select from 'react-select';
import styles from './styles/SingleTweet.module.css';

class SingleTweet extends Component {
    state = {
        tweet: {
            text: this.props.text,
            id: this.props.id,
            categoryInput: this.props.category,
        },
        showCategoryInput: false,
        selectedOption: null,
    }

    toggleInputHandler = (e) => {
        console.log(e.target);
        console.log("toggleInputHandler");
        if (e.target.id === "tweetDiv") this.setState(prevState => ({ showCategoryInput: !prevState.showCategoryInput })); // closes select menu only when clicked on tweet text
    }

    handleChange = selectedOption => {
        console.log(selectedOption);
        this.setState(
            { selectedOption },
            () => {
                console.log(`Option selected:`, this.state.selectedOption)
                this.props.categoryEdited({ tweet: this.state.tweet, newCat: this.state.selectedOption.value });
            }
        );
    };

    render() {

        const options = this.props.count.map(item => {
            return {
                value: item.cat, label: item.cat.replace(/\w+/g, function (match) {
                    return match.charAt(0).toUpperCase() + match.substring(1).toLowerCase();
                })
            }
        });

        const { selectedOption } = this.state;

        return (
                <div id="tweetDiv" className={styles.singleTw} onClick={this.toggleInputHandler}> {this.props.text}
                    <span>
                        {this.state.showCategoryInput ? <Select options={options}
                            value={selectedOption}
                            onChange={this.handleChange}
                            styles={{
                                option: base => ({
                                    ...base,
                                    border: `1px solid #ffffff }`,
                                    backgroundColor: '#595959',
                                    height: '100%',
                                    color: "#ffffff"
                                }),
                                control: (base, state) => ({
                                    ...base,
                                    background: "#f2f2f2",
                                    borderColor: "grey"
                                })
                            }} /> : null}
                    </span>
                </div>
        )
    };
}

export default SingleTweet;
