import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/message/';

export default [
  <Route path="/messages/create" component={Create} exact key="create" />,
  <Route path="/messages/edit/:id" component={Update} exact key="update" />,
  <Route path="/messages/show/:id" component={Show} exact key="show" />,
  <Route path="/messages/" component={List} exact strict key="list" />,
  <Route path="/messages/:page" component={List} exact strict key="page" />
];
