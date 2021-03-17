import React, { Component } from 'react'

export default class Status extends Component {
    
    constructor(props) {
        super(props);
    }

    handleSelectOnChange = (e) => {
        let id = e.currentTarget.parentElement.parentElement.id.slice(15);
        this.props.changeStatusCallback(id);
    }

    render() {
        let listItem = this.props.item;
        let statusType = "status-complete";
        let statusBool = true;
        if (listItem.status === "incomplete") {
            statusBool = false;
            statusType = "status-incomplete";
        }

        return (
            <div className='item-col status-col' className={statusType}>
                <select onChange={this.handleSelectOnChange}>
                    <option selected={!statusBool}>incomplete</option>
                    <option selected={statusBool}>complete</option>
                </select>
            </div>
        )
    }
}