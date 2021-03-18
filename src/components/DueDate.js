import React, { Component } from 'react'

export default class DueDate extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            oldDate: ''
        }
    }

    handleChangeDate = (e) => {
        let id = e.currentTarget.parentElement.parentElement.id.slice(15);
        this.props.changeDateCallback(id, this.state.oldDate, e.currentTarget.value);
    }

    handleOnFocus = (e) => {
        let currentDate = e.currentTarget.value;

        this.setState({
            oldDate:currentDate
        })

    }

    render() {
        return (
            <div className='item-col due-date-col'>
                <input class='due-date-field' type='date' onChange={this.handleChangeDate} onClick={this.handleOnFocus} value={this.props.item.due_date}></input>
            </div>
        )
    }
}