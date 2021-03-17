// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react'

class ListLink extends Component {
    constructor(props) {
        super(props);
        
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tListLink " + this.props.toDoList.key + " constructor");
    }

    componentDidMount = () => {
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tListLink " + this.props.toDoList.key + " did mount");
    }

    handleLoadList = (e) => {
        this.props.loadToDoListCallback(this.props.toDoList);
    }

    render() {
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tListLink render");

        return (
            <div 
                className='todo-list-button'
                onClick={this.handleLoadList}
                style={this.props.toDoList.highlighted ? {backgroundColor: '#ffc819', color: '#000000'} : {backgroundColor: '#353a44', color: '#e9edf0'}}
            >
                {this.props.toDoList.name}<br />
            </div>
        )
    }
}

export default ListLink;