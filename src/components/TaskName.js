import React, { Component } from 'react'

export default class TaskName extends Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='item-col task-col'>{this.props.item.description}</div>
        )
    }
}