import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/admin/';

export default [
  <Route path="/admins/create" component={Create} exact key="create" />,
  <Route path="/admins/edit/:id" component={Update} exact key="update" />,
  <Route path="/admins/show/:id" component={Show} exact key="show" />,
  <Route path="/admins/" component={List} exact strict key="list" />,
  <Route path="/admins/:page" component={List} exact strict key="page" />
];
