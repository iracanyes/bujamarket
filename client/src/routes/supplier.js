import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show, Search } from '../components/supplier/';

export default [
  <Route path="/suppliers/create" component={Create} exact key="create" />,
  <Route path="/suppliers/edit/:id" component={Update} exact key="update" />,
  <Route path="/suppliers/show/:id" component={Show} exact key="show" />,
  <Route path="/suppliers/" component={List} exact strict key="list" />,
  <Route path="/suppliers/:page" component={List} exact strict key="page" />,
  <Route path="/suppliers" component={Search} exact strict key="search"/>
];
