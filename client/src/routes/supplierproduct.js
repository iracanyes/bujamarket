import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Show, SupplierList, Update } from '../components/supplierproduct/';

export default [
  <Route path="/supplier_product/create" component={Create} exact key="create" />,
  <Route path="/supplier_product/edit/:id" component={Update} exact key="update" />,
  <Route path={"/my_products"} component={SupplierList} exact key={"supplierList"} />,
  <Route path={"/my_products/:page"} component={SupplierList} exact key={"supplierList"} />,
  <Route path="/supplier_product/show/:id" component={Show} exact key="show" />,
  <Route path="/supplier_products/" component={List} exact strict key="list" />,
  <Route path="/supplier_products/:page" component={List} exact strict key="page" />
];
