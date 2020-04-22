/**
 * Author: Iracanyes
 * Date: 9/22/19
 * Description:
 */
import React from 'react';
import { Route } from "react-router-dom";
import { Show } from '../components/shoppingcart/';

export default [
  <Route path={"/shopping_cart"} component={Show} exact key={"show"} />
];
