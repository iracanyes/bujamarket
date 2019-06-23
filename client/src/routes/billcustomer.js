import React from 'react';
import { Route } from 'react-router-dom';
import { List } from '../components/billcustomer/';

export default [
  //<Route path="/bill_customers/create" component={Create} exact key="create" />,
  //<Route path="/bill_customers/edit/:id" component={Update} exact key="update" />,
  //<Route path="/bill_customers/show/:id" component={Show} exact key="show" />,
  <Route path="/bill_customers/" component={List} exact strict key="list" />,
  <Route path="/bill_customers/:page" component={List} exact strict key="page" />
];
