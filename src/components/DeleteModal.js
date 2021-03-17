import React, {Component} from 'react'

export default class DeleteModal extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div id='delete-modal' style={this.props.visible ? {display: 'block'} : {display: 'none'}}>
                <div id='delete-modal-contents'>
                    <div id='delete-prompt'>Delete List?</div>
                    <div className='modal-button' id='close-modal' onClick={this.props.closeModal}>X</div>
                    <div id='line'>------------------------------------</div>
                    <div className='modal-button' id='confirm' onClick={this.props.deleteListCallback}>Confirm</div>
                    <div className='modal-button' id='cancel' onClick={this.props.closeModal}>Cancel</div>
                </div>
            </div>
        )
    }

}