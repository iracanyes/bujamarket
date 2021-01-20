import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show, PaymentSuccess, PaymentFailure } from '../components/payment/';

export default [
  <Route path="/payment/create" component={Create} exact key="create" />,
  <Route path="/payment/edit/:id" component={Update} exact key="update" />,
  <Route path="/payment/show/:id" component={Show} exact key="show" />,
  <Route path="/payment_success/:sessionId" component={PaymentSuccess} exact strict key='payment_success'/>,
  <Route path="/payment_failure" component={PaymentFailure} exact strict key='payment_failure'/>,
  <Route path="/payments/" component={List} exact strict key="list" />,
  <Route path="/payments/:page" component={List} exact strict key="page" />
];
