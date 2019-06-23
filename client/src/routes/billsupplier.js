import React from 'react';
import { Route } from 'react-router-dom';
import { List } from '../components/billsupplier/';

export default [
  //<Route path="/bill_suppliers/create" component={Create} exact key="create" />,
  //<Route path="/bill_suppliers/edit/:id" component={Update} exact key="update" />,
  //<Route path="/bill_suppliers/show/:id" component={Show} exact key="show" />,
  <Route path="/bill_suppliers/" component={List} exact strict key="list" />,
  <Route path="/bill_suppliers/:page" component={List} exact strict key="page" />
];
