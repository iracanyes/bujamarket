import React, { Fragment, Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { withRouter } from "react-router-dom";
import {

  Card,
  CardBody,
  CardTitle,
  Table,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import {
  Button,
  Paper
} from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getProfileAddresses, reset } from "../../actions/address/profileAddresses";
import { UpdateForm } from  "../address";
import { del } from "../../actions/address/delete";
import {toastSuccess} from "../../layout/ToastMessage";

class ProfileAddresses extends  Component{
  static propTypes = {
    getProfileAddresses: PropTypes.func.isRequired,
    retrieved: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    eventSource: PropTypes.instanceOf(EventSource),
    deleteLoading: PropTypes.bool.isRequired,
    deleteError: PropTypes.string,
    deleted: PropTypes.object,
    delete: PropTypes.func.isRequired,

  };
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      modal: false,
      deletedAddress: false,
      addressToUpdate: null,
      addressToDelete: null
    };

    this.closeForm = this.closeForm.bind(this);
    this.updatedAddress = this.updatedAddress.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
  }

  componentDidMount() {
    if(!this.props.user)
      this.props.getProfileAddresses(this.props.history, this.props.location)
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  confirmDelete(address)
  {
    this.setState(state => ({
      ...state,
      modal: !state.modal,
      addressToDelete: address
    }));

  }

  closeForm()
  {
    this.setState( state => ({
      ...state,
      isOpen: false
    }));
  }

  updatedAddress()
  {
    this.setState( state => ({
      ...state,
      addressToUpdate: null,
      isOpen: false
    }));
  }

  showUpdateForm(address){
    this.setState( state => ({
      ...state,
      isOpen: true,
      addressToUpdate: address
    }));
  }

  delete(item)
  {
    const { intl } = this.props;
    this.props.delete(item, this.props.history, this.props.location);
    this.setState(state => ({
      ...state,
      modal: !state.modal,
      deletedAddress: true,
      addressToDelete: item
    }));

    toastSuccess(intl.formatMessage({
      id: 'app.address.deleted',
      defaultMessage: 'Adresse supprimée!',
      description: 'Address - Deleted'
    }));

  }

  updateTable(retrieved)
  {
    const { addressToDelete, addressToUpdate } = this.state;
    const { updated: addressUpdated, deleted } = this.props;

    console.log('ProfileAddresses updateTable - addressToUpdate', addressToUpdate);
    console.log('ProfileAddresses updateTable - addressUpdated', addressUpdated);

    /* Mise à jour du produit */
    if(addressUpdated && addressUpdated.id){
      const index = retrieved.findIndex(address => address.id === addressUpdated.id);
      retrieved[index] = addressUpdated;
    }

    // Suppression de l'adresse supprimé
    return (addressToDelete && deleted)
      ? retrieved.filter(address => address.id !== deleted.id )
      : retrieved;
  }

  render(){

    const retrieved = this.props.retrieved && this.props.retrieved['hydra:member'];

    const {
      isOpen,
      modal,
      addressToUpdate,
      addressToDelete,
    } = this.state;

    const addresses = this.updateTable(retrieved);


    return (
      <Fragment>
        <Container id={"profile-addresses-table"} className={"my-4"}>
          <div className={"d-flex flex-row position-relative tab-title"}>
            <h2>
              <FormattedMessage id={"app.button.your_addresses"}/>
            </h2>
            <Button variant={'contained'} onClick={() => this.showUpdateForm({})} className={'btn'}>
              <FontAwesomeIcon icon={["far", "edit"]} className={'mr-2'}/>
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
                      <ModalHeader toggle={() => this.confirmDelete(item)}>
                        <FormattedMessage
                          id={'app.form.confirm_deletion'}
                          defaultMessage={'Confirmer la suppression'}
                          description={'Form - Confirm deletion'}
                        />
                      </ModalHeader>
                      <ModalBody>
                        {addressToDelete && (
                          <Paper elevation={3}>
                            <Card>
                              <CardTitle className={'mt-2'}>
                                <h2 className={'text-center'}>
                                  { addressToDelete.locationName }
                                </h2>
                              </CardTitle>
                              <CardBody>
                                <p>
                                  <FormattedMessage id={'app.address.item.street'} />
                                  &nbsp;:&nbsp;
                                  <strong className={'ml-2'}>
                                    { addressToDelete.street }
                                  </strong>
                                </p>
                                <p>
                                  <FormattedMessage id={'app.address.item.number'} />
                                  &nbsp;:&nbsp;
                                  <strong className={'ml-2'}>
                                    { addressToDelete.number }
                                  </strong>

                                </p>
                                <p>
                                  <FormattedMessage id={'app.address.item.town'} />
                                  &nbsp;:&nbsp;
                                  <strong className={'ml-2'}>
                                    { addressToDelete.town }
                                  </strong>

                                </p>
                                <p>
                                  <FormattedMessage id={'app.address.item.state'} />
                                  &nbsp;:&nbsp;
                                  <strong className={'ml-2'}>
                                    { addressToDelete.state }
                                  </strong>

                                </p>
                                <p>
                                  <FormattedMessage id={'app.address.item.zip_code'} />
                                  &nbsp;:&nbsp;
                                  <strong className={'ml-2'}>
                                    { addressToDelete.zipCode }
                                  </strong>

                                </p>
                                <p>
                                  <FormattedMessage id={'app.address.item.country'} />
                                  &nbsp;:&nbsp;
                                  <strong className={'ml-2'}>
                                    { addressToDelete.country }
                                  </strong>

                                </p>
                              </CardBody>
                            </Card>
                          </Paper>
                        )}

                      </ModalBody>
                      <ModalFooter className={'justify-content-center'}>
                        <Button variant={'contained'} className={'bg-light mx-2'} onClick={() => this.delete(addressToDelete)}>
                          <FontAwesomeIcon icon={'check-circle'} className={'text-success mr-2'}/>
                          <FormattedMessage id={'app.button.validate'}/>
                        </Button>{' '}
                        <Button variant={'contained'} className={'bg-light mx-2'} onClick={ () => this.confirmDelete({}) }>
                          <FontAwesomeIcon icon={'minus-circle'} className={'text-danger mr-2'}/>
                          <FormattedMessage id={'app.button.cancel'}/>
                        </Button>
                      </ModalFooter>
                    </Modal>
                  </td>
                </tr>
              ))}
              { this.props.created && this.props.created.locationName && (
                <tr key={this.props.created.id}>
                  <th scope="row">{ this.props.created.id + 1 }</th>
                  <td>
                    { this.props.created.locationName }
                  </td>
                  <td>
                    { this.props.created.street + " " + this.props.created.number }
                  </td>
                  <td>{ this.props.created.zipCode }</td>
                  <td>{ this.props.created.town }</td>
                  <td>{ this.props.created.state }</td>
                  <td>{ this.props.created.country }</td>
                  <td className={"d-flex flex-row"}>
                    <Button onClick={() => this.showUpdateForm(this.props.created)} className={"text-primary"}>
                      <FontAwesomeIcon icon={'edit'}/>
                    </Button>
                    <Button onClick={() =>this.delete(this.props.created)} className={"text-danger"}>
                      <FontAwesomeIcon icon={'trash-alt'} />
                    </Button>
                    <Modal isOpen={modal} toggle={() => this.confirmDelete(this.props.created)} className={'modal-delete'}>
                      <ModalHeader toggle={this.confirmDelete}>Confirmer la suppression</ModalHeader>
                      <ModalBody>
                        <Card>
                          <CardTitle>
                            <h2 className={'text-center'}>{ this.props.created.locationName }</h2>
                          </CardTitle>
                          <CardBody>
                            <p>
                              <FormattedMessage id={'app.address.item.street'} />
                              &nbsp;:&nbsp;
                              { this.props.created.street }
                            </p>
                            <p>
                              <FormattedMessage id={'app.address.item.number'} />
                              &nbsp;:&nbsp;
                              { this.props.created.number }
                            </p>
                            <p>
                              <FormattedMessage id={'app.address.item.town'} />
                              &nbsp;:&nbsp;
                              { this.props.created.town }
                            </p>
                            <p>
                              <FormattedMessage id={'app.address.item.state'} />
                              &nbsp;:&nbsp;
                              { this.props.created.state }
                            </p>
                            <p>
                              <FormattedMessage id={'app.address.item.zip_code'} />
                              &nbsp;:&nbsp;
                              { this.props.created.zipCode }
                            </p>
                            <p>
                              <FormattedMessage id={'app.address.item.country'} />
                              &nbsp;:&nbsp;
                              { this.props.created.country }
                            </p>
                          </CardBody>
                        </Card>
                      </ModalBody>
                      <ModalFooter>
                        <Button variant={'contained'} className={'bg-light '} onClick={() => this.delete(this.props.created)}>
                          <FontAwesomeIcon icon={'check-circle'} className={'text-success mr-2'}/>
                          <FormattedMessage id={'app.button.validate'}/>
                        </Button>{' '}
                        <Button variant={'contained'} className={'bg-light'} onClick={ () => this.confirmDelete({}) }>
                          <FontAwesomeIcon icon={'minus-circle'} className={'text-danger mr-2'}/>
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
            {console.log('ProfileAddresses render - state.isOpen', isOpen)}
            { isOpen && (
              <UpdateForm
                address={addressToUpdate.id ? addressToUpdate : undefined}
                closeForm={this.closeForm}
              />
            )}
          </div>
        </Container>

      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { retrieved, loading, error, eventSource } = state.address.profileAddresses;
  const { created, loading: createLoading, error: createError } = state.address.create;
  const { updated, loading: updateLoading, error: updateError } = state.address.update;
  const { deleted, error: deleteError, loading: deleteLoading  } = state.address.del;

  return {
    retrieved,
    loading,
    error,
    eventSource,
    created,
    createLoading,
    createError,
    updated,
    updateLoading,
    updateError,
    deleted,
    deleteLoading,
    deleteError
  };
};

const mapDispatchToProps = dispatch => ({
  getProfileAddresses: (history, location) => dispatch(getProfileAddresses(history, location)),
  delete: (item, history, location) => dispatch(del(item, history, location)),
  reset: (eventSource) => dispatch(reset(eventSource))
});

export default connect( mapStateToProps, mapDispatchToProps )(withRouter(injectIntl(ProfileAddresses)));
