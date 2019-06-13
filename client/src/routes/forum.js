import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/forum/';

export default [
  <Route path="/forums/create" component={Create} exact key="create" />,
  <Route path="/forums/edit/:id" component={Update} exact key="update" />,
  <Route path="/forums/show/:id" component={Show} exact key="show" />,
  <Route path="/forums/" component={List} exact strict key="list" />,
  <Route path="/forums/:page" component={List} exact strict key="page" />
];
