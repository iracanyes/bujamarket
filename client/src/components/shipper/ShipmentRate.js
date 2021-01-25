import React, { Component, Fragment} from "react";
import { connect } from "react-redux";
import {
  Breadcrumbs,
  Button,
  Paper,
  Card,
  CardHeader,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  withStyles, CircularProgress,
} from "@material-ui/core";
import {Link, withRouter} from "react-router-dom";
import {FormattedMessage} from "react-intl";
import {green, orange, red} from "@material-ui/core/colors";
import {Col, Row} from "reactstrap";
import {Field, reduxForm} from "redux-form";
import { list, reset } from "../../actions/shipper/list";
import { create } from "../../actions/orderset/create";
import PropTypes from "prop-types";
import BreadcrumbsPurchase from "../../layout/BreadcrumbsPurchase";
import {BsCheckCircle} from "react-icons/bs";
import {toastError} from "../../layout/component/ToastMessage";
import {upsRate} from "../../actions/orderset/upsRate";
import {FaShippingFast} from "react-icons/all";

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
  loadingAddress: {
    display: 'flex',
    justifyContent:'center',
    "& .MuiTypography-body1": {
      fontFamily: 'Montserrat',
      fontWeight: 400,
      marginLeft: '6px'
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

class ShipmentRate extends Component
{
  static propTypes = {
    retrieved: PropTypes.object,
    retrievedUpsRate: PropTypes.object,
    error: PropTypes.oneOf([PropTypes.string, PropTypes.object]),
    loading: PropTypes.bool.isRequired,
    eventSource: PropTypes.instanceOf(EventSource),
    list: PropTypes.func.isRequired,
    upsRate: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      shippingChoice: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { list, upsRate, history, location} = this.props;
    const address = sessionStorage.getItem('delivery_address') !== 'undefined' ? JSON.parse(sessionStorage.getItem('delivery_address')) : null;


    if(localStorage.getItem('token') !== null){
      if(address){
        /* Récupération des transporteurs disponibles */
        list(history, location.pathname);
        /* Calcul du coût de transport */
        upsRate(address, history, location);
      }else{
        history.push('../../delivery_address');
      }



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
    const { reset, eventSource} = this.props;
    reset(eventSource);
  }

  handleChange(e)
  {
    let value = e.target.value;

    let shipper =  this.props.retrieved && this.props.retrieved['hydra:member'].filter(item => item.id === parseInt(value) )[0];

    let shopping_cart = localStorage.getItem("shopping_cart") ? JSON.parse(localStorage.getItem("shopping_cart")) : [];

    let sum = 0;
    shopping_cart.forEach( item => sum += parseFloat(item.price) * item.quantity );

    document.getElementById('list-shipper-choice-social-reason').innerHTML = shipper.socialReason;

    /* Calcul et affichage du coût de transport*/
    let deliveryCost = 0;

    document.getElementById('list-shipper-choice-price').innerHTML = (deliveryCost) + '€';

    /* Affichage du coût total */
    document.getElementById('list-total-price').innerHTML = (parseFloat(sum ) + deliveryCost).toFixed(2) + '€';


  }

  handleSubmit(e){
    e.preventDefault();
    const {  retrieved, create, history, location } = this.props;
    /* Récupération des données du formulaire */
    const data = new FormData(document.getElementById('shipment-form'));
    const delivery_address = sessionStorage.getItem('delivery_address') != 'undefined' ? JSON.parse(sessionStorage.getItem('delivery_address')) : null;

    const requestData = {
      shipper: data.get('shipper') ? data.get('shipper') : "",
      deliveryAddress: delivery_address
    };

    create(requestData, history, location);
  }

  render() {
    const { classes, loading, loadingCreate, errorCreate, error,retrieved } = this.props;
    const shopping_cart = localStorage.getItem('shopping_cart') ? JSON.parse(localStorage.getItem('shopping_cart')) : [];
    const shippingChoice = this.state.shippingChoice;
    const shippingCost = 0;

    let sum = 0;
    shopping_cart.forEach( item => sum += parseFloat(item.price) * item.quantity );
    sum += shippingCost;

    // Affichage des erreurs
    typeof (error) === 'string' && toastError(error);
    typeof (errorCreate) === 'string' && toastError(errorCreate);

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
            <BreadcrumbsPurchase etape={3}/>
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
                <Card className={classes.formCard}>
                  <CardHeader
                    title={
                      <FormattedMessage
                        id={"app.shipping_choice"}
                        defaultMessage={"Choix du transporteur"}
                      />
                    }
                  />
                  <form
                    id="shipment-form"
                    name="shipment-address"
                    className={" mx-auto px-3"}
                    onSubmit={() => this.handleSubmit()}
                  >
                    {loading && (
                      <div className={classes.loadingAddress}>
                        <CircularProgress size={24}/>
                        <Typography variant={'body1'}>
                          <FormattedMessage
                            id={'app.loading_shippers'}
                            defaultMessage={'Chargement des transporteurs'}
                          />
                        </Typography>
                      </div>
                    )}
                    {/* Transporteur */}
                    {retrieved && (
                      <div className="row px-3">
                        <Row className={'w-100 my-3'}>
                          <Col lg={9}>
                            <label
                              htmlFor={'shipper'}
                              className="form-control-label"
                            >
                              <FormattedMessage  id={"app.form.delivery_address.shipper"}
                                                 defaultMessage="Transporteur"
                                                 description="Form delivery address - shipper"

                              />
                            </label>
                            &nbsp;:&nbsp;
                            <Field
                              component={"select"}
                              name="shipper"
                              type="select"
                              className={'form-control'}
                              onChange={this.handleChange}
                              value={this.state.existingAddress}
                            >
                              <option value="" key={'-1'}>--Choisir parmi nos expéditeurs--</option>
                              {retrieved && retrieved['hydra:member'].map((item, index) => (
                                <option value={ item.id } key={index}>
                                  { item.socialReason }
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
                            primary={parseFloat(item.price).toFixed(2)+'€'}
                            secondary={'x ' + item.quantity}
                            className={classes.listItemText2}
                          />
                        </ListItem>
                      ))}
                      <ListItem className={classes.listItem}>
                        <ListItemAvatar>
                          <Avatar>
                            <FaShippingFast/>
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            shippingChoice ?
                              shippingChoice
                              :
                              <FormattedMessage
                                id={'app.your_shipping_choice'}
                                defaultMessage={'Transporteur choisie'}
                                description={'App - Your shipping choice'}
                              />
                          }
                          id={'list-shipper-choice-social-reason'}
                          className={classes.listItemText1}
                        />
                        <ListItemText
                          className={classes.listItemText2}
                          id={'list-shipper-choice-price'}
                          primary={parseFloat(shippingCost).toFixed(2) + '€'}
                        />
                      </ListItem>
                      <ListItem className={classes.listItem}>
                        <ListItemAvatar>
                          <Avatar>
                            €
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <FormattedMessage
                              id={'app.total_cost'}
                              defaultMessage={'Coût total'}
                              description={'App - Your shipping choice'}
                            />
                          }
                          className={classes.listItemText1}
                        />
                        <ListItemText
                          className={classes.listItemText2}
                          id={'list-total-price'}
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
  retrieved: state.shipper.list.retrieved,
  error: state.shipper.list.error,
  loading: state.shipper.list.loading,
  eventSource: state.shipper.list.eventSource,
  loadingCreate: state.orderset.create.loading,
  errorCreate: state.orderset.create.error,
  created: state.orderset.create.created,
  retrievedUpsRate: state.orderset.upsRate.retrieved
});

const mapDispatchToProps = dispatch => ({
  list: (history, location) => dispatch(list(history, location)),
  create: (values, history, location) => dispatch(create(values, history, location)),
  upsRate: (address, history, location) => dispatch(upsRate(address, history, location)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'shipment',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true
  })(withRouter(withStyles(styles)(ShipmentRate)))
);
