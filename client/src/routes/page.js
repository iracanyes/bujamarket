import React, {Fragment} from 'react';
import { Route } from "react-router-dom";
import { Homepage, Error404Cat, Terms, Rgpd, Credits } from '../page/';

export default [
  <Route path={"/"} component={Homepage} exact key="homepage" />,
  <Route path={"/credits"} component={Credits} exact key="credits" />,
  <Route path={"/terms"} component={Terms} exact key="terms" />,
  <Route path={"/rgpd"} component={Rgpd} exact key="rgpd" />,

  <Route key={'notfound'} render={() => (
    <Fragment>
      <Error404Cat/>
    </Fragment>

  )} />
];
