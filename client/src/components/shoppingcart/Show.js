/**
 * Author: iracanyes
 * Description: Shopping cart of the customer
 */
import React,{ Fragment } from 'react';
import { connect } from 'react-redux';
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
import BreadcrumbsPurchase from "../../layout/BreadcrumbsPurchase"
import {BsCheckCircle} from "react-icons/bs";
import {IoMdBackspace} from "react-icons/io";

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
  contentWrapper:{
    display: 'flex',
    justifyContent: 'center',
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
  listItemContent: {
    display: 'flex',
    flexDirection: 'row'
  },
  listItemText: {
    fontFamily: 'Montserrat'
  },
  listItemNumber: {
    fontFamily: 'Montserrat',
    textAlign: 'right'
  },
  listAction: {
    flexGrow: 1
  },
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
            <BreadcrumbsPurchase etape={1} />
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
                            primary={
                              <Fragment>
                                <Typography className={classes.listItemText}>
                                  {item.title}
                                </Typography>
                                <Typography className={classes.listItemText}>
                                  {item.description}
                                </Typography>
                              </Fragment>
                            }
                            secondary={
                              <Fragment>
                                <div className={classes.listAction}>
                                  <Typography className={classes.listItemNumber}>
                                    {parseFloat(item.price).toFixed(2) + "€"}
                                  </Typography>
                                  <Typography className={classes.listItemNumber}>
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
                                </div>

                              </Fragment>
                            }
                            className={classes.listItemContent}
                          />
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
                      { loadingCreate ? (<CircularProgress size={16} color={'primary'} className={'spinner mr-2'} />) : <BsCheckCircle className={'mr-2'}/>}
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
                      <IoMdBackspace className={"mr-2"}/>
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
