/**
 * Author: iracanyes
 * Description: Shopping cart of the customer
 */
import React,{ Fragment } from 'react';
import { connect } from 'react-redux';
import {
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Spinner
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Paper,
  Card,
  CardHeader,
  CardContent,
  Grid,
  List,
  ListItemText,
  ListItem,
  ListItemAvatar,
  Avatar,
  Breadcrumbs,
  CircularProgress,
  Typography,
  withStyles, ListItemSecondaryAction, Badge
} from "@material-ui/core";
import { FormattedMessage } from 'react-intl';
import { create } from '../../actions/shoppingcart/create';
import {toastError} from "../../layout/component/ToastMessage";
import {Link} from "react-router-dom";
import {ButtonLink} from "../../layout/component/ButtonLink";
import {green, orange, red} from "@material-ui/core/colors";

const styles = theme => ({
  root: {
    paddingTop: theme.spacing(5)
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
  contentWrapper:{
    marginTop: theme.spacing(4)
  },
  card:  {},
  badge: {
    "& .MuiBadge-badge":{
      backgroundColor: orange[500]
    }
  },
  cardHeader: {
    "& .MuiCardHeader-title": {
      fontFamily: 'Raleway !important'
    }
  },
  cardContent: {},
  
  buttonDelete:{
    color: 'white',
    backgroundColor: red[400],
    "&:hover":{
      backgroundColor: red[600],
    }
  },
  buttonGroup: {
    display: 'flex',
    padding: '1rem 0',
    justifyContent: 'center'
  },
  buttonValidate: {
    color: 'white',
    backgroundColor: green[500],
    margin: '0 1rem',
    "&:hover":{
      color: 'white',
      backgroundColor: green[700]
    }
  },
  buttonCancel: {
    color: 'white',
    backgroundColor: red[500],
    margin: '0 1rem',
    "&:hover":{
      color: 'white',
      backgroundColor: red[700]
    }
  }
});

class Show extends React.Component {
  constructor(props)
  {
    super(props);

    this.state = {
      update: false
    };

    this.deleteProduct = this.deleteProduct.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({update: false});
    if(localStorage.getItem('token') !== null)
    {
      ;
    }else{
      this.props.history.push({ pathname: 'login', state: { from: this.props.location.pathname } });
    }
  }

  deleteProduct(id)
  {
    let shopping_cart = localStorage.getItem("shopping_cart") ? JSON.parse(localStorage.getItem("shopping_cart")) : [];

    let index = shopping_cart.findIndex(value => value.id === id);
    // Suppression du produit dans le panier de commande
    shopping_cart.splice(index, 1);
    // Mise à jour du panier de commade
    localStorage.removeItem('shopping_cart');
    localStorage.setItem('shopping_cart', JSON.stringify(shopping_cart));
    this.props.history.push('shopping_cart');

  }

  onSubmit()
  {
    let locationState = { from : this.props.location.pathname};
    this.props.create(JSON.parse(localStorage.getItem('shopping_cart')), this.props.history, locationState);

  }

  render() {
    const { errorCreate, loadingCreate, classes } = this.props;
    let shopping_cart = localStorage.getItem("shopping_cart") ? JSON.parse(localStorage.getItem("shopping_cart")) : [];

    let sum = 0;
    shopping_cart.forEach( item => sum += parseFloat(item.price) * item.quantity );

    // Affichage des erreurs
    typeof errorCreate === "string" && toastError(errorCreate);

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
            <Breadcrumbs separator={'>>'} aria-label={'breadcrumbs'}>
              <Link
                to={'../../shopping_cart'}
                component={ButtonLink}
                className={classes.buttonLink}
              >
                <FormattedMessage
                  id={'app.page.shopping_cart.shopping_cart_validation'}
                  defaultMessage={"Validation du panier de commande"}
                />
              </Link>
              <Link
                to={'../../delivery_address'}
                component={ButtonLink}
                className={classes.buttonLink}
              >
                <FormattedMessage
                  id={"app.address.item.location_name.delivery_address"}
                  defaultMessage={"Adresse de livraison"}
                />
              </Link>
              <Link
                to={'../../shipment_rate'}
                component={ButtonLink}
                className={classes.buttonLink}
              >
                <FormattedMessage
                  id={"app.shipping"}
                  defaultMessage={"Transport"}
                />
              </Link>
              <Link
                to={'../../validate_order'}
                component={ButtonLink}
                className={classes.buttonLink}
                disabled={true}
              >
                <FormattedMessage
                  id={"app.button.payments"}
                  defaultMessage={"Paiement"}
                />
              </Link>
              <Link
                to={'../../delivery_address'}
                component={ButtonLink}
                disabled={true}
                className={classes.buttonLink}
              >
                <FormattedMessage
                  id={"app.bill"}
                  defaultMessage={"Facture"}
                />
              </Link>
            </Breadcrumbs>
          </Grid>
          <Grid
            item
            xs={12}
            className={classes.contentWrapper}
          >
            <Grid
              item
              xs={12}
              md={10}
              className={classes.content}
            >
              <Paper elevation={3} className={classes.resumePaper}>
                <Card
                  className={classes.card}
                >

                    <CardHeader
                      title={
                        <Badge badgeContent={shopping_cart.length} className={classes.badge}>
                          <FormattedMessage
                            id={"app.button.shopping_cart"}
                            defaultMessage={"Panier de commande"}
                            description={"App - Shopping cart"}
                          />
                        </Badge>
                      }
                      className={classes.cardHeader}
                    />


                  <CardContent>
                    <List>
                      {shopping_cart && shopping_cart.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemAvatar>
                            <Avatar
                              src={item.image}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={item.title}
                            secondary={item.description}
                            className={classes.ListItemText}
                          />
                          <ListItemSecondaryAction>
                            <Typography>
                              {item.price}
                            </Typography>
                            <Typography>
                              {'x '+item.quantity}
                            </Typography>
                            <Button
                              variant={'contained'}
                              className={classes.buttonDelete}
                            >
                              <FormattedMessage
                                id={"app.button.delete"}
                                defaultMessage={"Supprimer"}
                              />
                            </Button>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                  <div
                    spacing={2}
                    className={classes.buttonGroup}
                  >
                    <Button
                      variant={'contained'}
                      className={classes.buttonValidate}
                      onClick={() => this.onSubmit()}
                    >
                      <FormattedMessage
                        id={"app.button.validate"}
                        defaultMessage={"Valider"}
                      />
                    </Button>
                    <Link
                      component={ButtonLink}
                      variant={'contained'}
                      className={classes.buttonCancel}
                      to={'..'}
                    >
                      <FormattedMessage
                        id={"app.button.cancel"}
                        defaultMessage={"Annuler"}
                      />
                    </Link>
                  </div>
                </Card>

              </Paper>
            </Grid>
          </Grid>

        </Grid>
        <div className={"col-9 mx-auto"}>
          <div className={"order-md-4 my-4"}>
            <h4 className="d-flex justify-content-between align-items-center mb-3 pl-1">
              <span className="text-muted">Vos choix</span>
              <span className="badge badge-secondary badge-pill">{shopping_cart.length}</span>
            </h4>
            <ListGroup>
              {shopping_cart.map((item, index) => (
                <ListGroupItem className={'d-flex'} key={index}>
                  <div className="col-9">
                    <ListGroupItemHeading>{item.title}</ListGroupItemHeading>
                    <ListGroupItemText>
                      {item.description}
                    </ListGroupItemText>
                  </div>
                  <div>
                    <p>
                      <span className="text-muted">{ parseFloat(item.price).toFixed(2)  + ' €'}</span>
                    </p>
                    <p>
                      <FormattedMessage  id={"app.form.quantity"}
                                         defaultMessage="Quantité"
                                         description="Form - quantity"
                      />
                      &nbsp;:&nbsp;
                      {item.quantity}
                    </p>
                    <Button outline color={'danger'} onClick={() => this.deleteProduct(item.id)}>
                      <FormattedMessage  id={"app.button.delete"}
                                         defaultMessage="Supprimer"
                                         description="Button - delete"
                      />
                    </Button>
                  </div>
                </ListGroupItem>
              ))}
            </ListGroup>
            <div className="col-4 d-flex mx-auto mt-3">
              {shopping_cart.length > 0 && (
                <Button color={"success"} className={'mr-3 border-success'} onClick={this.onSubmit}>
                  {loadingCreate && <Spinner color={'info'} className={'spinner mr-2'}/>}
                  <FormattedMessage  id={"app.button.validate"}
                                     defaultMessage="Valider"
                                     description="Button - validate"
                  />
                </Button>
              )}

              <Button outline color={"danger border-danger"} onClick={() => this.props.history.goBack()}>
                <FormattedMessage  id={"app.button.return"}
                                   defaultMessage="Retour"
                                   description="Button - return"
                />
              </Button>
            </div>

          </div>
        </div>
      </Fragment>


    );
  }
}

const mapStateToProps = state => {
  const { error: errorCreate, loading: loadingCreate } = state.shoppingcart.create;

  return { errorCreate, loadingCreate };
};

const mapDispatchToProps = dispatch => ({
  create: (values, history, currentRoute) => dispatch( create(values, history, currentRoute))
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Show));
