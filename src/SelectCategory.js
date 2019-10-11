import React, { Component } from 'react'
import Select from 'react-select'



const SelectCategory = (props) => {
    console.log(props);
    console.log(props.count);

    // let options = [
    //     { value: 'chocolate', label: 'Chocolate' },
    //     { value: 'strawberry', label: 'Strawberry' },
    //     { value: 'vanilla', label: 'Vanilla' }
    // ]

    let options = props.count.map(item=>{
        console.log(item);
       return {value: item.cat, label: item.cat}
    })
    console.log(options);


    return (
        <Select options={options} />
    )
}
export default SelectCategory;