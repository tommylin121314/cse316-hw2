import React, { Component } from 'react'

export default class DueDate extends Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='item-col due-date-col'>{this.props.item.due_date}</div>
        )
    }
}