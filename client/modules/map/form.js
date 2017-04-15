import React, { Component } from 'react';
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  ModalFooter,
} from 'react-modal-bootstrap';


export default class Form extends Component {

  constructor(props) {
    super(props);

    this.state = { isOpen: false,
      donor: {
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: '',
        address: '',
        bloodGroup: '',
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen !== this.state.isOpen) {
      this.setState({ isOpen: nextProps.isOpen });
    }
  }

  hideModal = () => {
    this.props.hideModal();
  };

  onSubmit = () =>{
    this.props.onSubmit(this.state.donor);
  }

  handleChange = ({ target }) =>{
     const donor = this.state.donor;
     donor[target.id] = target.value

     this.setState( donor);
  }

  render() {
    return (
      <Modal isOpen={this.state.isOpen} onRequestHide={this.hideModal}>
        <ModalHeader>
          <ModalClose onClick={this.hideModal} />
          <ModalTitle>Modal title</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <form>
            <div className="form-group">
              <label htmlFor="firstName">First Name:</label>
              <input type="text" className="form-control" id="firstName"
                value={this.state.donor.firstName}  onChange={this.handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name:</label>
              <input type="text" className="form-control"
              id="lastName" onChange={this.handleChange}
              value={this.state.donor.lastName} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email address:</label>
              <input type="email" className="form-control" id="email"
              onChange={this.handleChange} value={this.state.donor.email} />
            </div>
            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number:</label>
              <input type="text" className="form-control" id="contactNumber"
              onChange={this.handleChange} value={this.state.donor.contactNumber} />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address:</label>
              <input type="text" className="form-control" id="address"
              onChange={this.handleChange} value={this.state.donor.address} />
            </div>
            <div className="form-group">
              <label htmlFor="bloodGroup">Blood Group:</label>
              <input type="text" className="form-control" id="bloodGroup"
              onChange={this.handleChange} value={this.state.donor.bloodGroup} />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-default" onClick={this.hideModal}>
            Close
          </button>
          <button className="btn btn-primary" onClick={this.onSubmit}>
            Save
          </button>
        </ModalFooter>
    </Modal>);
  }

}
