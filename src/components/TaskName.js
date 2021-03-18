import React, { Component } from 'react'

export default class TaskName extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            oldName: ''
        }
    }

    handleOnBlur = (e) => {
        let id = e.currentTarget.parentElement.id.slice(15);
        let newName = e.currentTarget.innerText;
        if(newName !== this.state.oldName) {
            this.props.editDescriptionCallback(id, newName, this.state.oldName);
        }
    }

    handleOnFocus = (e) => {
        let oldName = e.currentTarget.innerHTML;
        this.setState({
            oldName: oldName
        })
    }

    render() {
        return (
            <div className='item-col task-col overflow-scroll' contentEditable onBlur={this.handleOnBlur} onFocus={this.handleOnFocus}>{this.props.item.description}</div>
        )
    }
}