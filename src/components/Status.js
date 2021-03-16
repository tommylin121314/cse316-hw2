import React, { Component } from 'react'

export default class Status extends Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        let listItem = this.props.item;
        let statusType = "status-complete";
        if (listItem.status === "incomplete")
            statusType = "status-incomplete";

        return (
            <div className='item-col status-col' className={statusType}>{listItem.status}</div>
        )
    }
}