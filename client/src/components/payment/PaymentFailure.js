import React, { Fragment, Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { ButtonLink } from "../../layout/component/ButtonLink";
import {
  Grid,
  Paper,
  Card,
  Button,
  Typography,
  CardHeader,
  Toolbar,
  CardActions,
  CardContent,
  Avatar,
} from "@material-ui/core";
import { orange } from "@material-ui/core/colors";
import { withStyles } from "@material-ui/core/styles";
import {FormattedMessage} from "react-intl";
import {BiErrorAlt, GiReturnArrow, GoHome} from "react-icons/all";

const styles = theme => ({
  root: {
    fontFamily: 'Montserrat'
  },
  gridContainer:{
    fontFamily: 'Montserrat'
  },
  cardHeader: {
    backgroundColor: orange[500],
    color: 'white',
    "& .MuiCardHeader-title": {
      fontFamily: 'Raleway',
      fontSize: '1.5rem',
      fontWeight: 700
    }
  },
  avatar:{
    color: 'white',
    backgroundColor: theme.palette.error.main,
    fontSize: '1.9rem'
  },
  cardContent: {
     fontFamily: 'Montserrat',
    "& .MuiTypography-body1": {
       fontFamily: 'Montserrat'
    }
  },
  cardActions: {
    justifyContent: 'center',
    "& .MuiTypography-body1": {
      fontFamily: 'Montserrat'
    }
  },
  buttonReturn:{
    backgroundColor: orange[500],
    color: 'white',
    "&:hover":{
      color: 'white',
      backgroundColor: orange[700],
    }
  },
  buttonContact: {
    backgroundColor: theme.palette.info.main,
    color: 'white',
    "&:hover": {
      color: 'white',
      backgroundColor: theme.palette.info.dark,
    }
  },
  buttonCancel: {
    backgroundColor: theme.palette.error.main,
    color: 'white',
    "&:hover": {
      color: 'white',
      backgroundColor: theme.palette.error.dark,
    }
  }
});



class PaymentFailure extends Component{
  componentDidMount() {
    if(localStorage.getItem('token') === null  )
    {
      if(this.props.location.state){
        this.props.history.push({
          pathname:'../../login',
          state: {
            from: this.props.location.pathname,
            params: {
              orderSet: this.props.location.state.params.orderSet ? this.props.location.state.params.orderSet : null
            }
          }

        });
      }else{
        this.props.history.push({pathname: '../../login'});
      }

    }
  }

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Toolbar/>
        <Grid
          container
          spacing={2}
          className={classes.gridContainer}
        >
          <Grid
            item
            xs={12}
            className={classes.gridContent}
          >
            <Paper
              elevation={3}
              className={classes.paper}
            >
              <Card>
                <CardHeader
                  avatar={
                    <Avatar
                      className={classes.avatar}
                    >
                      <BiErrorAlt/>
                    </Avatar>
                  }
                  title={
                    <FormattedMessage
                      id={"app.error_while_processing_payment"}
                      defaultMessage={"Échec du processus de paiement sur la plateforme Stripe"}
                      description={"App - Error while processing payment"}
                    />
                  }
                  className={classes.cardHeader}
                />
                <CardContent className={classes.cardContent}>
                  <Typography variant={'body1'}>
                    <Typography paragraph>
                      <FormattedMessage
                        id={"app.error_processing_payment_message"}
                        defaultMessage={"Une erreur est survenue durant le processus de paiement sur la plateforme Stripe."}
                        description={"App - Error while processing payment message"}
                      />
                    </Typography>
                    <Typography paragraph>
                      <FormattedMessage
                        id={"app.error_processing_payment_message2"}
                        defaultMessage={"Dans le cas où, la connexion à la plateforme Stripe est temporairement indisponible, Vous pouvez réessayer la procédure ou vous connectez plus tard pour finaliser vos achats."}
                        description={"App - Error while processing payment message"}
                      />
                    </Typography>
                    <Typography paragraph>
                      <FormattedMessage
                        id={"app.error_processing_payment_message3"}
                        defaultMessage={"Dans les autres cas, vous pouvez contacter notre service technique pour tout assistance."}
                        description={"App - Error while processing payment message"}
                      />
                    </Typography>

                  </Typography>
                </CardContent>
                <CardActions
                  className={classes.cardActions}
                >
                  <Link
                    to={'../validate_order'}
                    component={ButtonLink}
                    color={'info'}
                    variant={'contained'}
                    startIcon={<GiReturnArrow/>}
                    className={classes.buttonReturn}
                  >
                    <Typography variant={'body1'}>
                      <FormattedMessage
                        id={"app.retry_to_order"}
                        defaultMessage={"Réessayer à la commande"}
                      />
                    </Typography>
                  </Link>
                  <Link
                    to={'../chat/admin'}
                    component={ButtonLink}
                    color={'info'}
                    variant={'contained'}
                    startIcon={<GoHome/>}
                    className={classes.buttonContact}
                    disabled={true}
                  >
                    <Typography variant={'body1'}>
                      <FormattedMessage
                        id={"app.contact_admin"}
                        defaultMessage={"Contacter un administrateur"}
                      />
                    </Typography>
                  </Link>
                  <Link
                    to={'..'}
                    component={ButtonLink}
                    color={'success'}
                    variant={'contained'}
                    startIcon={<GoHome/>}
                    className={classes.buttonCancel}
                  >
                    <Typography variant={'body1'}>
                      <FormattedMessage
                        id={"app.return_homepage"}
                        defaultMessage={"Retourner à la page d'accueil"}
                      />
                    </Typography>
                  </Link>
                </CardActions>
              </Card>

            </Paper>
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default withRouter(withStyles(styles)(PaymentFailure));
