/**
 * Author: Iracanyes
 * Date: 9/22/19
 * Description:
 */
import React from 'react';
import { Route } from "react-router-dom";
import { Show } from '../components/shoppingcard/';

export default [
  <Route path={"/shopping_card"} component={Show} exact key={"show"} />
];
