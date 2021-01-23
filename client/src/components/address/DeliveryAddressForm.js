
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {
  Row,
  Col,
} from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { injectIntl } from 'react-intl';
import { list, reset } from '../../actions/address/list';
import { create } from '../../actions/address/create';
import {toastError} from "../../layout/component/ToastMessage";
import {
  Avatar,
  Card,
  Button,
  CardContent,
  CardHeader,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  CircularProgress, Typography
} from "@material-ui/core";
import BreadcrumbsPurchase from "../../layout/BreadcrumbsPurchase";
import {withStyles} from "@material-ui/core/styles";
import {green, orange, red} from "@material-ui/core/colors";
import {withRouter} from "react-router-dom";
import {BsCheckCircle} from "react-icons/bs";
import {IoMdBackspace} from "react-icons/io";
import countryCode from "../../config/ISOCode/countries-en.json";

const styles = theme => ({
  root: {
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(5),
  },
  breadcrumbs:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.main,
    "& nav": {
      fontFamily: 'Carter One !important',
      color: 'white'
    }

  },
  buttonLink: {
    fontFamily: 'Montserrat !important',
    color: 'white !important',
    fontWeight: 700,
    "&:hover": {
      color: orange[500] + '!important'
    }
  },
  loadingAddress: {
    display: 'flex',
    justifyContent:'center',
    "& .MuiTypography-body1": {
      fontFamily: 'Montserrat',
      fontWeight: 400,
      marginLeft: '6px'
    }
  },
  buttonAddAddress: {
    color: 'white',
    backgroundColor: orange[500],
    fontFamily: 'Montserrat',
    "&:hover":{
      color: 'white',
      backgroundColor: orange[700],
    }
  },
  buttonValidate: {
    color: 'white',
    backgroundColor: green[500],
    fontFamily: 'Montserrat',
    marginRight: theme.spacing(3),
    "&:hover":{
      color: 'white',
      backgroundColor: green[700],
    }
  },
  buttonCancel: {
    color: 'white',
    backgroundColor: red[500],
    fontFamily: 'Montserrat',
    "&:hover":{
      color: 'white',
      backgroundColor: red[700],
    }
  },
  contentWrapper:{
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(4)
  },
  content:{

  },
  formCard:  {
    paddingBottom: theme.spacing(4)
  },
  cardHeader: {
    "& .MuiCardHeader-title": {
      fontFamily: 'Raleway !important'
    }
  },
  cardContent: {
    padding: '0 8px 0 8px'
  },
  listItem: {
    paddingBottom: 0
  },
  listItemText1:{
    width: '75%',
    "& .MuiTypography-body1":{
      fontSize: '0.8rem',
      fontFamily: 'Montserrat !important'
    }
  },
  listItemText2:{
    "& .MuiTypography-body1":{
      fontSize: '0.8rem',
      fontFamily: 'Montserrat !important'
    }
  }
});

class DeliveryAddressForm extends React.Component {
  static propTypes = {
    retrieved: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    list: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    eventSource: PropTypes.instanceOf(EventSource),
    errorCreate: PropTypes.string,
  };

  constructor(props)
  {
    super(props);

    this.state = {
      existingAddress: 0,
      toggleNewAddressForm: false,
      newAddress: {}
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.showFormNewAddress = this.showFormNewAddress.bind(this);
  }

  componentDidMount() {
    /* Si token existant, on charge les adresses existantes. Sinon redirection vers la page de connexion */
    if(localStorage.getItem('token') !== null )
    {
      /* Récupération des adresses existantes  */
      this.props.list(this.props.history);
    }else{
      this.props.history.push({
        pathname: 'login',
        state: {
          from: this.props.location.pathname
        }
      });
    }
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  showFormNewAddress()
  {
    if(this.state.toogleNewAddressForm === false){
      // Désactivation du choix parmi les adresses existantes
      document.getElementsByName('existingAddress')[0].setAttribute('disabled', "");
      // Remise à zéro du choix parmi les adresses existantes
      document.getElementsByName('existingAddress')[0].getElementsByTagName('option')['-1'].selected = true;
      this.setState(state => ({
        ...state,
        toggleNewAddressForm: !state.toggleNewAddressForm
      }));
    }else{
      document.getElementsByName('existingAddress')[0].removeAttribute('disabled');
      this.setState(state => ({
        ...state,
        toggleNewAddressForm: !state.toggleNewAddressForm
      }));
    }
  }

  renderField = data => {
    data.input.className = 'form-control';

    const isInvalid = data.meta.touched && !!data.meta.error;
    if (isInvalid) {
      data.input.className += ' is-invalid';
      data.input['aria-invalid'] = true;
    }

    if (this.props.error && data.meta.touched && !data.meta.error) {
      data.input.className += ' is-valid';
    }

    return (
      <div className={`form-group`}>
        <label
          htmlFor={`user_${data.input.name}`}
          className="form-control-label"
        >
          {data.labelText}
        </label>
        <input
          {...data.input}
          type={data.type}
          step={data.step}
          required={data.required}
          placeholder={data.placeholder}
          id={`user_${data.input.name}`}
        />
        {isInvalid && <div className="invalid-feedback">{data.meta.error}</div>}
      </div>
    );
  };



  handleSubmit(e)
  {
    e.preventDefault();
    const {  retrieved } = this.props;
    /* Récupération des données du formulaire */
    const data = new FormData(document.getElementById('delivery-address-form'));

    const existingAddressId = typeof data.get('existingAddress') === "string" ? parseInt(data.get('existingAddress')) : 0;

    const delivery_address = {
      locationName: data.get('locationName') ? data.get('locationName') : "",
      street: data.get('street') ? data.get('street') : "",
      number: data.get('streetNumber') ? data.get('streetNumber') : "",
      town: data.get('town') ? data.get('town') : "",
      state: data.get('state') ? data.get('state') : "",
      zipCode: data.get('zipCode') ? data.get('zipCode') : "",
      country: data.get('country') ? data.get('country') : ""
    };

    if(existingAddressId === 0 && delivery_address.street === ""){
      toastError("Choix de l'adresse de livraison manquant!");
      return;
    }

    if(existingAddressId !== 0){
      const address = retrieved['hydra:member'].find(el => el.id === existingAddressId);
      sessionStorage.removeItem('delivery_address');
      sessionStorage.setItem('delivery_address', JSON.stringify(address));
      this.props.history.push({pathname: '../shipment_rate', state: {from: this.props.location.pathname}});
      return;
    }

    if(!(delivery_address.locationName !== "" && delivery_address.street !== "" && delivery_address.town !== "" && delivery_address.state !== "" && delivery_address.zipCode !== "" && delivery_address.country !== "" )){
      toastError("Nouvelle adresse de livraison incomplète!");
      return;
    }

    this.props.create(delivery_address, this.props.history, this.props.location);


  }


  render() {
    const { intl, loading, loadingCreate, created, errorCreate, classes } = this.props;

    // Redirection si l'adresse a été enregisté
    if(created){
      sessionStorage.removeItem('delivery_address');
      sessionStorage.setItem('delivery_address', JSON.stringify(created));
      this.props.history.push({pathname:'../shipment_rate', from: this.props.location.pathname});
    }

    // affichage des erreurs serveurs
    typeof errorCreate === "string" && toastError(errorCreate);
    /* Clé pour la liste des courses */
    let key= 1;
    /* Récupération du panier de commande */
    let shopping_cart = localStorage.getItem("shopping_cart") ? JSON.parse(localStorage.getItem("shopping_cart")) : [];

    /* Calcul de la somme du panier de commande */
    let sum = 0;
    shopping_cart.forEach( item => sum += parseFloat(item.price) * item.quantity );


    return (
      <Fragment>
        <Grid
          container
          spacing={2}
          className={classes.root}
        >
          <Grid
            item
            xs={12}
            className={classes.breadcrumbs}
          >
            <BreadcrumbsPurchase etape={2}/>
          </Grid>
          <Grid
            container
            spacing={2}
            className={classes.contentWrapper}
          >
            <Grid
              item
              xs={12}
              md={8}
              className={classes.content}
            >
              <Paper
                elevation={3}
                className={classes.contentPaper}
              >
                <Card
                  className={classes.formCard}
                >
                  <CardHeader
                    title={
                      <FormattedMessage
                        id={"app.delivery_address"}
                        defaultMessage={"Adresse de livraison"}
                      />
                    }
                  />
                  <form
                    id="delivery-address-form"
                    name="delivery-address"
                    className={" mx-auto px-3"}
                    onSubmit={() => this.handleSubmit()}
                  >
                    {loading && (
                      <div className={classes.loadingAddress}>
                        <CircularProgress size={24}/>
                        <Typography variant={'body1'}>
                          <FormattedMessage
                            id={'app.loading_addresses'}
                            defaultMessage={'Chargement des adresses'}
                          />
                        </Typography>
                      </div>
                    )}



                    {/* Adresses existantes */}
                    {this.props.retrieved && this.props.retrieved['hydra:member'] !== null && (
                      <div className="row px-3">
                        <Row className={'w-100 my-3'}>
                          <Col lg={9}>
                            <label
                              htmlFor={'existingAddress'}
                              className="form-control-label"
                            >
                              <FormattedMessage  id={"app.form.delivery_address.existing_address"}
                                                 defaultMessage="Adresse enregistrée"
                                                 description="Form delivery address - existing address"

                              />
                            </label>
                            &nbsp;:&nbsp;
                            <Field
                              component={"select"}
                              name="existingAddress"
                              type="select"
                              className={'form-control'}
                              value={this.state.existingAddress}
                              disabled={this.state.toggleNewAddressForm}
                            >
                              <option value="" key={"-1"}>--Choisir parmi les adresses déjà enregistrées--</option>
                              {this.props.retrieved && this.props.retrieved['hydra:member'] && this.props.retrieved['hydra:member'].map((item, index) => (
                                <option value={ item.id } key={index}>
                                  { item.street.toLowerCase().trim().split(' ')
                                    .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
                                    .join(' ') + " " + item.number + " "
                                  + item.town +" " + item.state + " "
                                  + item.zipCode + " " + item.country }
                                </option>
                              ))}


                            </Field>
                          </Col>
                          <Col>
                            <Button
                              variant={'contained'}
                              id={'add-address'}
                              className={classes.buttonAddAddress} onClick={this.showFormNewAddress}>Livrer à une autre adresse</Button>
                          </Col>
                        </Row>
                      </div>

                    )}
                    {this.state.toggleNewAddressForm === true && (
                      <div id={'newAddress'} className={'row pl-3'}>
                        <Row className={'w-100 my-3'}>
                          <Col lg={9}>
                            <label
                              htmlFor={'location_name'}
                              className="form-control-label"
                            >
                              <FormattedMessage  id={"app.form.delivery_address.location_name"}
                                                 defaultMessage="Type d'adresse"
                                                 description="Form delivery address - location name"

                              />
                            </label>
                            &nbsp;:&nbsp;
                            <Field
                              component={"select"}
                              name="locationName"
                              type="select"
                              className={'form-control'}
                              value={this.state.existingAddress}
                              disabled={!this.state.toggleNewAddressForm}
                            >
                              <option value="" key={"-1"}>--Type d'adresse--</option>
                              {['Adresse de livraison','Adresse de dépôt'].map((item, index) => (
                                <option value={ item } key={index}>
                                  { item }
                                </option>
                              ))}


                            </Field>
                          </Col>
                        </Row>
                        <Row className={'w-100'}>
                          <Col>
                            <Field
                              component={this.renderField}
                              name="street"
                              type="text"
                              placeholder="Rue neuve"
                              labelText={intl.formatMessage({
                                id: "app.address.item.street",
                                defaultMessage: "Rue",
                                description: "Address item - street"
                              })}
                            />
                          </Col>
                          <Col>
                            <Field
                              component={this.renderField}
                              name="streetNumber"
                              type="text"
                              placeholder="9/101  "
                              labelText={intl.formatMessage({
                                id: "app.address.item.street_number",
                                defaultMessage: "N° de rue",
                                description: "Address item - street number"
                              })}
                            />
                          </Col>
                        </Row>
                        <Row className={'w-100'}>
                          <Col>
                            <Field
                              component={this.renderField}
                              name="town"
                              type="text"
                              placeholder="Schaerbeek"
                              labelText={intl.formatMessage({
                                id: "app.address.item.town",
                                defaultMessage: "Ville",
                                description: "Address item - town"
                              })}
                            />
                          </Col>
                          <Col>
                            <Field
                              component={this.renderField}
                              name="state"
                              type="text"
                              placeholder="Bruxelles"
                              labelText={intl.formatMessage({
                                id: "app.address.item.state",
                                defaultMessage: "Province/Région/État",
                                description: "Address item - state"
                              })}
                            />
                          </Col>
                        </Row>
                        <Row className={'w-100'}>
                          <Col>
                            <Field
                              component={this.renderField}
                              name="zipCode"
                              type="text"
                              placeholder="1000"
                              labelText={intl.formatMessage({
                                id: "app.address.item.zip_code",
                                defaultMessage: "Code postal",
                                description: "Address item - zip code"
                              })}
                            />
                          </Col>
                          <Col>
                            <label
                              htmlFor={'country'}
                              className="form-control-label"
                            >
                              <FormattedMessage  id={"app.form.delivery_address.country"}
                                                 defaultMessage="Pays"
                                                 description="Form delivery address - Country"

                              />
                            </label>
                            <Field
                              component={"select"}
                              name="country"
                              type="select"
                              placeholder="Belgique"
                              labelText={intl.formatMessage({
                                id: "app.address.item.country",
                                defaultMessage: "Pays",
                                description: "Address item - country"
                              })}
                              className={'form-control'}
                            >
                              <option value="" key={'-1'}>--Choisir le pays--</option>
                              {countryCode && countryCode.map((item, index) => (
                                <option value={ item.name } key={index}>
                                  { item.name }
                                </option>
                              ))}
                            </Field>
                          </Col>
                        </Row>
                      </div>
                    )}




                  </form>
                  <div className="col-4 d-flex mx-auto mt-3">
                    {/* Créer une fonction qui vérifie que tout le formulaire soit complet (adresse existante ou nouvel adresse ) */}
                    <Button variant={'contained'} className={classes.buttonValidate} onClick={this.handleSubmit}>
                      { loadingCreate ? (<CircularProgress size={16} color={'primary'} className={'spinner mr-2'} />) : <BsCheckCircle className={'mr-2'}/>}
                      <FormattedMessage  id={"app.button.validate"}
                                         defaultMessage="Valider"
                                         description="Button - validate"
                      />
                    </Button>

                    <Button variant={'contained'} className={classes.buttonCancel} onClick={() => this.props.history.push('..')}>
                      <IoMdBackspace className={"mr-2"}/>
                      <FormattedMessage  id={"app.button.cancel"}
                                         defaultMessage="Annuler"
                                         description="Button - cancel"
                      />
                    </Button>
                  </div>
                </Card>
              </Paper>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              className={classes.resume}
            >
              <Paper elevation={3} className={classes.resumePaper}>
                <Card>
                  <CardHeader
                    title={
                      <FormattedMessage
                        id={"app.total_cost"}
                        defaultMessage={"Coût total"}
                        description={"App - Total cost"}
                      />
                    }
                    className={classes.cardHeader}
                  />
                  <CardContent className={classes.cardContent}>
                    <List>
                      {shopping_cart && shopping_cart.map((item, index) => (
                        <ListItem key={index} className={classes.listItem}>
                          <ListItemAvatar>
                            <Avatar
                              src={item.image}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={item.title}
                            className={classes.listItemText1}
                          />
                          <ListItemText
                            primary={parseFloat(item.price).toFixed(2) + '€'}
                            secondary={'x '+item.quantity}
                            className={classes.listItemText2}
                          />
                        </ListItem>
                      ))}
                      <ListItem className={classes.listItem}>
                        <ListItemAvatar>
                          <Avatar>
                            €
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <FormattedMessage
                              id={'app.cost_exclude_tax_and_shipping'}
                              defaultMessage={'Coût hors taxe & transport'}
                              description={'App - Cost Exc. VAT & Shipping'}
                            />
                          }
                          className={classes.listItemText1}
                        />
                        <ListItemText
                          className={classes.listItemText2}
                          primary={parseFloat(sum).toFixed(2) + '€'}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  retrieved: state.address.list.retrieved,
  error: state.address.list.error,
  loading: state.address.list.loading,
  eventSource: state.address.list.eventSource,
  loadingCreate: state.address.create.loading,
  errorCreate: state.address.create.error,
  created: state.address.create.created
});

const mapDispatchToProps = dispatch => ({
  list: (history) => dispatch( list(history)),
  create: (values, history, prevRoute) => dispatch(create(values, history, prevRoute)),
  reset: eventSource => dispatch(reset(eventSource)),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'delivery-address',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true
  })(injectIntl(withRouter(withStyles(styles)(DeliveryAddressForm))))
);
