import React, { Component} from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";

class ButtonAction extends Component{
  constructor(props) {
    super(props);

    this.state = {
      modal: false,

    };

  }

  toggle()
  {
    this.setState(state => ({
      ...state,
      modal: !state.modal
    }));

  }

  render(){
    const { order } = this.props;

    return (
      <Fragment>
        <div>
          <Button>
            <FormattedMessage
              id={"app.order_detail.show_comment"}
              defaultMessage={"Voir le commentaire"}
              description={'Order detail - show comment'}
            />
          </Button>
          <Button>
            <FormattedMessage
              id={"app.order_detail.contact_customer"}
              defaultMessage={"Contacter le client"}
            />
          </Button>
          <Button></Button>
          <Modal>
            <ModalHeader></ModalHeader>
            <ModalBody></ModalBody>
            <ModalFooter>
              <Button>

              </Button>
              <Button></Button>
            </ModalFooter>
          </Modal>
        </div>
      </Fragment>
    );
  }
}

export default connect(null, null)(withRouter(injectIntl(ButtonAction)));
