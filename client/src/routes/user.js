import React from 'react';
import { Route } from 'react-router-dom';
import { List, Login, Register, Subscribe, Update, Show, UnlockAccount, UpdatePassword, Profile } from '../components/user/';

export default [
  <Route path="/login" component={Login} exact key="login"/>,
  <Route path="/register" component={Register} exact key="register" />,
  <Route path={'/subscribe/:token'} component={Subscribe} exact key="subscribe"  />,
  <Route path={'/unlock_account/:token'} component={UnlockAccount} exact key="unlockAccount" />,
  <Route path={'/profile'} component={Profile} exact key="profile" />,
  <Route path={'/profile/update_password'} component={UpdatePassword} exact key='updatePassword' />,
  <Route path="/users/edit/:id" component={Update} exact key="update" />,
  <Route path="/users/show/:id" component={Show} exact key="show" />,
  <Route path="/users/" component={List} exact strict key="list" />,
  <Route path="/users/:page" component={List} exact strict key="page" />
];
