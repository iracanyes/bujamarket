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

    if(sessionStorage.getItem('flash-message') !== null){
      sessionStorage.removeItem('flash-message');
    }

    if(sessionStorage.getItem('flash-message-error') !== null )
    {
      sessionStorage.removeItem('flash-message-error');
    }

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
