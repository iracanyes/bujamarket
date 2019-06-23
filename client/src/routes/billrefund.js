import React from 'react';
import { Route } from 'react-router-dom';
import { List } from '../components/billrefund/';

export default [
  //<Route path="/bill_refunds/create" component={Create} exact key="create" />,
  //<Route path="/bill_refunds/edit/:id" component={Update} exact key="update" />,
  //<Route path="/bill_refunds/show/:id" component={Show} exact key="show" />,
  <Route path="/bill_refunds/" component={List} exact strict key="list" />,
  <Route path="/bill_refunds/:page" component={List} exact strict key="page" />
];
