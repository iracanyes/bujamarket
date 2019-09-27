/**
 * Author: dashouney
 * Date: 9/27/19
 * Description:
 */
import React from 'react';
import { Alert } from 'reactstrap';

class FlashInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: true
    };

    this.onDismiss = this.onDismiss.bind(this);
  }

  onDismiss() {
    this.setState({ visible: false });
    sessionStorage.removeItem('flash-message');
  }

  render() {
    return (
      <Alert color={this.props.color} isOpen={this.state.visible} toggle={this.onDismiss}>
        {this.props.message}
      </Alert>
    );
  }
}

export default FlashInfo;
