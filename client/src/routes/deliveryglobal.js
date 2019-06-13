import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/deliveryglobal/';

export default [
  <Route path="/delivery_globals/create" component={Create} exact key="create" />,
  <Route path="/delivery_globals/edit/:id" component={Update} exact key="update" />,
  <Route path="/delivery_globals/show/:id" component={Show} exact key="show" />,
  <Route path="/delivery_globals/" component={List} exact strict key="list" />,
  <Route path="/delivery_globals/:page" component={List} exact strict key="page" />
];
