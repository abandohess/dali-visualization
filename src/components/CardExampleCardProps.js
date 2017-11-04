import React from 'react'
import { Button, Header, Image, Modal } from 'semantic-ui-react'
import '../css/EmployeeModal.css';

class EmployeeModal extends React.Component {
  render() {
    return (
      <Modal trigger={<Button id={this.props.id} className="invisible">Show Modal</Button>}>
        <Modal.Content image>
          <Image wrapped size='medium' src={this.props.image} />
          <Modal.Description>
            <Header className="larger">{this.props.name}</Header>
            <p className="lessLarge">My project is {this.props.projects}</p>
            <p className="lessLarge">I am on campus {this.props.term}</p>
            <p className="lessLarge">My message is {this.props.message}</p>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}


export default EmployeeModal;
