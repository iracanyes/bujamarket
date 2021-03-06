/**
 * Author: iracanyes
 * Date: 11/11/19
 * Description:
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
//import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
//import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { mainListItems, secondaryListItems } from './listItems';
import Chart from './Chart';
import Deposits from './Deposits';
import Orders from './Orders';
import {Card, CardContent, CardHeader} from "@material-ui/core";
import Copyright from "../Copyright";
import NewSuppliers from "./NewSuppliers";
import {Title} from 'react-admin';


class Dashboard extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      open: true
    }

    //this.getAuthData = this.getAuthData.bind(this);

  }

  getAuthData()
  {
    const user = localStorage.getItem('token') !== null ?  JSON.parse(atob(localStorage.getItem('token').split('.')[1])) : null;

    if(localStorage.getItem('token') === null || !user || !user.roles.includes('ROLE_ADMIN') )
    {
      this.props.history.push('login');
    }

    return user;
  };


  render() {

    //const { classes } = this.props;

    const user = this.getAuthData();

    return (
      <div id={'dashboard'}>
        <CssBaseline />
        <main className={'dashboard-content'}>
          <Title title="Buja Market - Admin | Accueil " />
          <div className={'container'}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper >
                  <Card>
                    <CardHeader title="Bienvenue sur la plateforme Admin de Buja Market" />
                    <CardContent>Lorem ipsum sic dolor amet...</CardContent>
                  </Card>
                </Paper>
              </Grid>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper className={'fixed-height-paper'}>
                  <Chart />
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper className={'fixed-height-paper'}>
                  <Deposits />
                </Paper>
              </Grid>
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper className={'paper'}>
                  <Orders />
                </Paper>
              </Grid>
              {/* New Suppliers */}
              <Grid item xs={12}>
                <Paper className={'paper'}>
                  <NewSuppliers />
                </Paper>
              </Grid>
            </Grid>
          </div>
          <Copyright />
        </main>
      </div>
    );
  }
}

export default withRouter(Dashboard);
