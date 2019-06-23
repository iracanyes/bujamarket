/**
 * Author: iracanyes
 * Date: 13/06/19
 * Description:
 */
import React from 'react';
import { Route } from 'react-router-dom';
import { List } from '../components/customer/';

export default [
    <Route path={"/customers/"} component={ List } exact strict key="list"/>,
    //<Route path={"/customers/show/:id"} component={ Show } exact key="show" />,
    //<Route path={"customers/:page"} component={ List } exact strict key="page"/>,
    //<Route path={"customers/edit/:id"} component={ Update } exact key="update" />,
    //<Route path={"customers/create"} component={ Create } exact key="create" />
];