import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Show, DeliveryAddressForm } from '../components/address/';

export default [
  //<Route path="/addresses/create" component={Create} exact key="create" />,
  //<Route path="/addresses/show/:id" component={Show} exact key="show" />,
  //<Route path="/addresses/:page" component={List} exact strict key="page" />,
  <Route path="/delivery_address" component={DeliveryAddressForm} exact strict key="delivery_address" />
];
