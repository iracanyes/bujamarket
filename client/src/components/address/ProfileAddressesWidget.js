import React, { Fragment, Component } from 'react';
import { FormattedMessage, injectIntl } from "react-intl";
import { withRouter } from "react-router-dom";
import { Table } from 'reactstrap';

class ProfileAddressesWidget extends  Component{

  render(){
    const { user } = this.props;
    return (
      <Fragment>
        <h4>
          <FormattedMessage id={"app.button.your_addresses"} />
        </h4>
        <Table hover>
          <thead>
          <tr>
            <th>#</th>
            { user.brandName && (
              <th>
                <FormattedMessage id={"app.address.item.location_name"} />
              </th>
            ) }
            <th>
              <FormattedMessage id={"app.address"} />
            </th>
            <th>
              <FormattedMessage id={"app.address.item.zip_code"} />
            </th>
            <th>
              <FormattedMessage id={"app.address.item.town"} />
            </th>
            <th>
              <FormattedMessage id={"app.address.item.state"} />
            </th>
            <th>
              <FormattedMessage id={"app.address.item.country"} />
            </th>
          </tr>
          </thead>
          <tbody>
          { user.addresses.map( (item, index) => (
            <tr key={index}>
              <th scope="row">{ index + 1 }</th>
              <td>
                { item.locationName }
              </td>
              <td>
                { item.street + " " + item.number }
              </td>
              <td>{ item.zipCode }</td>
              <td>{ item.town }</td>
              <td>{ item.state }</td>
              <td>{ item.country }</td>
            </tr>
          ))}

          </tbody>
        </Table>
      </Fragment>
    );
  }
}

export default withRouter(injectIntl(ProfileAddressesWidget));
