import React from 'react';
import { Route } from 'react-router-dom';
import {List, Create, Update, Show, ShipmentRate} from '../components/shipper/';

export default [
  <Route path="/shippers/create" component={Create} exact key="create" />,
  <Route path="/shippers/edit/:id" component={Update} exact key="update" />,
  <Route path="/shippers/show/:id" component={Show} exact key="show" />,
  <Route path="/shippers/" component={List} exact strict key="list" />,
  <Route path="/shippers/:page" component={List} exact strict key="page" />,
  <Route path={'/shipment_rate'} component={ShipmentRate} exact strict key='shipment_rate'/>
];
