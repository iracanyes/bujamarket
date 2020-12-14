import React from 'react';
import { Route } from 'react-router-dom';
import { Subscribe, Show, UnlockAccount, UpdatePassword, Profile, UpdateProfile, ProfileAddresses, Unsubscribe } from '../components/user/';

export default [
  <Route path={'/subscribe/:token'} component={Subscribe} exact key="subscribe"  />,
  <Route path={'/unlock_account/:token'} component={UnlockAccount} exact key="unlockAccount" />,
  <Route path={'/profile'} component={Profile} exact key="profile" />,
  <Route path={'/profile/update'} component={UpdateProfile} exact key={"update"} />,
  <Route path={'/profile/update_password'} component={UpdatePassword} exact key='updatePassword' />,
  <Route path={'/profile/addresses'} component={ProfileAddresses} exact key='profileAddresses'/>,
  <Route path="/unsubscribe" component={Unsubscribe} exact key="unsubscribe" />,
  <Route path="/users/show/:id" component={Show} exact key="show" />,
  //<Route path="/users/" component={List} exact strict key="list" />,
  //<Route path="/users/:page" component={List} exact strict key="page" />
];
