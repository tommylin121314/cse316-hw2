// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import Close from '@material-ui/icons/Close';
import TaskName from './TaskName';
import DueDate from './DueDate';
import Status from './Status';

class ToDoItem extends Component {
    constructor(props) {
        super(props);
        
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tToDoItem " + this.props.toDoListItem.id + " constructor");
    }

    componentDidMount = () => {
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tToDoItem " + this.props.toDoListItem.id + " did mount");
    }

    handleDeleteItem = (e) => {
        let id = e.currentTarget.parentElement.parentElement.id;
        this.props.deleteItemCallback(id.slice(15));
    }

    handleMoveItemUp = (e) => {
        let id = e.currentTarget.parentElement.parentElement.id.slice(15);
        this.props.swapItemCallback(id, true);
    }

    handleMoveItemDown = (e) => {
        let id = e.currentTarget.parentElement.parentElement.id.slice(15);
        this.props.swapItemCallback(id, false);
    }

    render() {
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tToDoItem render");
        let listItem = this.props.toDoListItem;

        return (
            <div id={'todo-list-item-' + listItem.id} className='list-item-card'>
                <TaskName item={listItem}/>
                <DueDate item={listItem}/>
                <Status item={listItem}/>
                <div className='item-col test-4-col'></div>
                <div className='item-col list-controls-col'>
                    <KeyboardArrowUp className='list-item-control todo-button' 
                        onClick={this.handleMoveItemUp}
                    />
                    <KeyboardArrowDown className='list-item-control todo-button' 
                        onClick={this.handleMoveItemDown}
                    />
                    <Close className='list-item-control todo-button' 
                        onClick={this.handleDeleteItem}
                    />
                    <div className='list-item-control'></div>
        <div className='list-item-control'></div>
                </div>
            </div>
        )
    }
}

export default ToDoItem;