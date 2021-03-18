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

    handleOnBlur = (e) => {
        let name = e.currentTarget.innerText;
        console.log(name);
        this.props.changeListNameCallback(this.props.toDoList.id, name);
    }

    render() {
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tListLink render");

        return (
            <div 
                onBlur={this.handleOnBlur}
                contentEditable
                className='todo-list-button overflow-scroll'
                onClick={this.handleLoadList}
                style={this.props.toDoList.highlighted ? {backgroundColor: '#ffc819', color: '#000000'} : {backgroundColor: '#353a44', color: '#e9edf0'}}
            >
                {this.props.toDoList.name}
            </div>
        )
    }
}

export default ListLink;