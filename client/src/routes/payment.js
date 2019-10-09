import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show, PaymentSuccess } from '../components/payment/';

export default [
  <Route path="/payment/create" component={Create} exact key="create" />,
  <Route path="/payment/edit/:id" component={Update} exact key="update" />,
  <Route path="/payment/show/:id" component={Show} exact key="show" />,
  <Route path="/payments/" component={List} exact strict key="list" />,
  <Route path="/payments/:page" component={List} exact strict key="page" />,
  <Route path="/payment_success" component={PaymentSuccess} exact strict key='payment_success'/>
];
