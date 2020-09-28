import React, { Fragment, Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { withRouter } from "react-router-dom";
import { Table } from 'reactstrap';
import { del } from "../../actions/bankaccount/delete";
import AddPaymentMethodButton from "./AddPaymentMethodButton";
import { MdDeleteForever } from "react-icons/all";
import {
  Button,
  Icon
} from '@material-ui/core';
import {toastError, toastSuccess} from "../../layout/ToastMessage";

class ProfileBankAccountsWidget extends  Component{
  constructor(props) {
    super(props);
    this.state = {
      deleted: false
    }
    this.delete = this.delete.bind(this);
  }

  delete(account){
    const { user, history, location } =this.props;

    this.props.delete(account, history, location);

  }

  render(){
    const { user, deleted } = this.props;

    if(!user.bankAccounts)
      return (<AddPaymentMethodButton />);

    if(deleted){
      toastSuccess('Compte bancaire supprimé avec succès!');
      user.bankAccounts = user.bankAccounts.filter(item => item.id !== deleted.id);
    }


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
              <FormattedMessage id={"app.bank_account.owner_fullname"} />
            </th>
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
            <th>
              <FormattedMessage id={"app.actions"} />
            </th>
          </tr>
          </thead>
          <tbody>
          { user.bankAccounts.map( (item, index) => (
            <tr key={index + 1}>
              <th scope="row">{ index + 1 }</th>
              <td>{ item.ownerFullname }</td>
              <td>
                { "**** **** **** **** " + item.last4 }
              </td>
              <td>{ item.countryCode }</td>
              <td>{ item.funding.includes('debit') ? 'Debit card' : item.brand }</td>
              <td>{ item.expiryMonth !== null && (item.expiryMonth + '/' + item.expiryYear) }</td>
              <td>
                <Button
                  variant={"contained"}
                  color={"primary"}
                  startIcon={<MdDeleteForever/>}
                  className={"delete"}
                  onClick={() => this.delete(item)}
                >
                  <FormattedMessage id={"app.button.delete"} />
                </Button>
              </td>
            </tr>
          ))}

          </tbody>
          <tfoot>
            <tr>
              <td colSpan={7} >
                <AddPaymentMethodButton className={'justify-content-center'}/>
              </td>
            </tr>

          </tfoot>
        </Table>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { deleted, error, loading } = state.bankaccount.del;
  return { deleted, error, loading };
}

const mapDispatchToProps = dispatch => ({
  delete: (account, history, location) => dispatch(del(account, history, location))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(ProfileBankAccountsWidget)));
