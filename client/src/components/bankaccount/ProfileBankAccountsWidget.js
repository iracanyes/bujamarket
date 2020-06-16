import React, { Fragment, Component } from 'react';
import { FormattedMessage, injectIntl } from "react-intl";
import { withRouter } from "react-router-dom";
import { Table } from 'reactstrap';
import AddPaymentMethodButton from "./AddPaymentMethodButton";

class ProfileBankAccountsWidget extends  Component{
  constructor(props) {
    super(props);
  }

  render(){
    const { user } = this.props;

    if(!user.bankAccounts)
      return (<AddPaymentMethodButton />);

    return (
      <Fragment>
        <h4>
          <FormattedMessage id={"app.bank_accounts.used"} />
        </h4>
        <Table hover>
          <thead>
          <tr>
            <th>#</th>
            <th>
              <FormattedMessage id={"app.bank_account.last4"} />
            </th>
            <th>
              <FormattedMessage id={"app.bank_account.country_code"} />
            </th>
            <th>
              <FormattedMessage id={"app.bank_account.brand"} />
            </th>
            <th>
              <FormattedMessage id={"app.bank_account.expiry_date"} />
            </th>
          </tr>
          </thead>
          <tbody>
          { user.bankAccounts.map( (item, index) => (
            <tr key={index + 1}>
              <th scope="row">{ index + 1 }</th>
              <td>
                { "**** **** **** **** " + item.last4 }
              </td>
              <td>{ item.countryCode }</td>
              <td>{ item.brand }</td>
              <td>{ item.expiryMonth + '/' + item.expiryYear }</td>
            </tr>
          ))}

          </tbody>
        </Table>
      </Fragment>
    );
  }
}

export default withRouter(injectIntl(ProfileBankAccountsWidget));
