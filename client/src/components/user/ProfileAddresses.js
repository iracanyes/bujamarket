import React, { Fragment, Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { NavLink as RRDNavLink, withRouter } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Table,
  Container,
  NavLink,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getProfileAddresses } from "../../actions/address/profileAddresses";
import { UpdateForm } from  "../address";
import { del } from "../../actions/address/delete";

class ProfileAddresses extends  Component{
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      modal: false,
      updatedAddress: false,
      deletedAddress: false,
      addressToUpdate: {},
      addressCreated: {},
      addressToDelete: {}
    };

    this.addNewAddress = this.addNewAddress.bind(this);
    this.updatedAddress = this.updatedAddress.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
  }

  componentDidMount() {
    if(!this.props.user)
      this.props.getProfileAddresses(this.props.history, this.props.location)
  }

  confirmDelete(address)
  {
    this.setState(state => ({
      ...state,
      modal: !state.modal,
      addressToDelete: address
    }));
  }

  addNewAddress(address)
  {
    this.setState( state => ({
      ...state,
      newAddress: address
    }));
  }

  updatedAddress()
  {
    this.setState( state => ({
      ...state,
      addressToUpdate: {},
      updatedAddress: true
    }));
  }

  showUpdateForm(address){
    this.setState({
      isOpen: true,
      addressToUpdate: address
    });
  }

  delete(item)
  {
    this.props.delete(item, this.props.history, this.props.location);
    this.setState(state => ({
      ...state,
      modal: !state.modal,
      deletedAddress: true
    }))
  }

  updateTable(retrieved)
  {
    const { deletedAddress, addressToDelete } = this.state;

    const addresses = deletedAddress
      ? retrieved.filter(address => address.street !== addressToDelete.street && address.number !== addressToDelete.number )
      : retrieved;

    return addresses;
  }

  render(){

    const retrieved = this.props.retrieved && this.props.retrieved['hydra:member'];
    console.log("user", addresses);
    const { isOpen, modal, addressToUpdate, addressToDelete, deletedAddress } = this.state;

    const addresses = this.updateTable(retrieved);

    return (
      <Fragment>
        <Container id={"profile-addresses-table"} className={"my-4"}>
          <div className={"d-flex flex-row position-relative tab-title"}>
            <h2>
              <FormattedMessage id={"app.button.your_addresses"}/>
            </h2>
            <Button onClick={() => this.showUpdateForm({})} className={'btn'}>
              <FontAwesomeIcon icon={["far", "edit"]} />
              <FormattedMessage id={"app.address.add"} defaultMessage={"Ajouter une adresse"} />
            </Button>
          </div>

          { addresses && (
            <Table hover>
              <thead>
              <tr>
                <th>#</th>
                <th>
                  <FormattedMessage id={"app.address.item.location_name"} />
                </th>
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
                <th>
                  <FormattedMessage id={"app.actions"} />
                </th>
              </tr>
              </thead>
              <tbody>
              { addresses.map( (item, index) => (
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
                  <td className={"d-flex flex-row"}>
                    <Button onClick={() => this.showUpdateForm(item)} className={"text-primary"}>
                      <FontAwesomeIcon icon={'edit'}/>
                    </Button>
                    <Button onClick={() => this.confirmDelete(item)} className={"text-danger"}>
                      <FontAwesomeIcon icon={'trash-alt'} />
                    </Button>
                    <Modal isOpen={modal} toggle={() => this.confirmDelete(item)} className={'modal-delete'}>
                      <ModalHeader toggle={() => this.confirmDelete(item)}>Confirmer la suppression</ModalHeader>
                      <ModalBody>
                        <Card>
                          <CardTitle>
                            <h2 className={'text-center'}>{ addressToDelete.locationName }</h2>
                          </CardTitle>
                          <CardBody>
                            <p>
                              <FormattedMessage id={'app.address.item.street'} />
                              &nbsp;:&nbsp;
                              { addressToDelete.street }
                            </p>
                            <p>
                              <FormattedMessage id={'app.address.item.number'} />
                              &nbsp;:&nbsp;
                              { addressToDelete.number }
                            </p>
                            <p>
                              <FormattedMessage id={'app.address.item.town'} />
                              &nbsp;:&nbsp;
                              { addressToDelete.town }
                            </p>
                            <p>
                              <FormattedMessage id={'app.address.item.state'} />
                              &nbsp;:&nbsp;
                              { addressToDelete.state }
                            </p>
                            <p>
                              <FormattedMessage id={'app.address.item.zip_code'} />
                              &nbsp;:&nbsp;
                              { addressToDelete.zipCode }
                            </p>
                            <p>
                              <FormattedMessage id={'app.address.item.country'} />
                              &nbsp;:&nbsp;
                              { addressToDelete.country }
                            </p>
                          </CardBody>
                        </Card>
                      </ModalBody>
                      <ModalFooter>
                        <Button color="primary" onClick={() => this.delete(addressToDelete)}>
                          <FormattedMessage id={'app.button.validate'}/>
                        </Button>{' '}
                        <Button color="secondary" onClick={ () => this.confirmDelete({}) }>
                          <FormattedMessage id={'app.button.cancel'}/>
                        </Button>
                      </ModalFooter>
                    </Modal>
                  </td>
                </tr>
              ))}
              { this.state.addressCreated.locationName && (
                <tr key={this.state.addressCreated.id}>
                  <th scope="row">{ this.state.addressCreated.id + 1 }</th>
                  <td>
                    { this.state.addressCreated.locationName }
                  </td>
                  <td>
                    { this.state.addressCreated.street + " " + this.state.addressCreated.number }
                  </td>
                  <td>{ this.state.addressCreated.zipCode }</td>
                  <td>{ this.state.addressCreated.town }</td>
                  <td>{ this.state.addressCreated.state }</td>
                  <td>{ this.state.addressCreated.country }</td>
                  <td className={"d-flex flex-row"}>
                    <Button onClick={() => this.showUpdateForm(this.state.addressCreated)} className={"text-primary"}>
                      <FontAwesomeIcon icon={'edit'}/>
                    </Button>
                    <Button onClick={this.delete(this.state.addressCreated.id)} className={"text-danger"}>
                      <FontAwesomeIcon icon={'trash-alt'} />
                    </Button>
                    <Modal isOpen={modal} toggle={() => this.confirmDelete(this.state.addressCreated)} className={'modal-delete'}>
                      <ModalHeader toggle={this.confirmDelete}>Confirmer la suppression</ModalHeader>
                      <ModalBody>
                        <Card>
                          <CardTitle>
                            <h2 className={'text-center'}>{ this.state.addressCreated.locationName }</h2>
                          </CardTitle>
                          <CardBody>
                            <p>
                              <FormattedMessage id={'app.address.item.street'} />
                              &nbsp;:&nbsp;
                              { this.state.addressCreated.street }
                            </p>
                            <p>
                              <FormattedMessage id={'app.address.item.number'} />
                              &nbsp;:&nbsp;
                              { this.state.addressCreated.number }
                            </p>
                            <p>
                              <FormattedMessage id={'app.address.item.town'} />
                              &nbsp;:&nbsp;
                              { this.state.addressCreated.town }
                            </p>
                            <p>
                              <FormattedMessage id={'app.address.item.state'} />
                              &nbsp;:&nbsp;
                              { this.state.addressCreated.state }
                            </p>
                            <p>
                              <FormattedMessage id={'app.address.item.zip_code'} />
                              &nbsp;:&nbsp;
                              { this.state.addressCreated.zipCode }
                            </p>
                            <p>
                              <FormattedMessage id={'app.address.item.country'} />
                              &nbsp;:&nbsp;
                              { this.state.addressCreated.country }
                            </p>
                          </CardBody>
                        </Card>
                      </ModalBody>
                      <ModalFooter>
                        <Button color="primary" onClick={() => this.delete(this.state.addressCreated)}>
                          <FormattedMessage id={'app.button.validate'}/>
                        </Button>{' '}
                        <Button color="secondary" onClick={ () => this.confirmDelete({}) }>
                          <FormattedMessage id={'app.button.cancel'}/>
                        </Button>
                      </ModalFooter>
                    </Modal>
                  </td>
                </tr>
              )}
              </tbody>
            </Table>
          )}
          <div id="update-address-container">
            {isOpen && <UpdateForm address={addressToUpdate} addNewAddress={this.addNewAddress}/>}
          </div>
        </Container>

      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { retrieved, loading, error } = state.address.profileAddresses;
  return { retrieved, loading, error };
};

const mapDispatchToProps = dispatch => ({
  getProfileAddresses: (history, location) => dispatch(getProfileAddresses(history, location)),
  delete: (item) => dispatch(del(item))
});

export default connect( mapStateToProps, mapDispatchToProps )(withRouter(injectIntl(ProfileAddresses)));
