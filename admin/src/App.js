import React from 'react';
import { HydraAdmin, ResourceGuesser  } from '@api-platform/admin';
import parseHydraDocumentation from '@api-platform/api-doc-parser/lib/hydra/parseHydraDocumentation';
import { dataProvider as baseDataProvider, fetchHydra as baseFetchHydra  } from '@api-platform/admin';
import { Redirect } from 'react-router-dom';
import authProvider from "./authProvider";
import AddressesList from "./component/address/AddressesList";

const entrypoint = process.env.REACT_APP_API_ENTRYPOINT;
const fetchHeaders = {'Authorization': `Bearer ${window.localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
const fetchHydra = (url, options = {}) => {
  options.headers = new Headers(fetchHeaders);
  return baseFetchHydra(url, options)
          .then(response => {
            console.log("fetchHydra - response", response);

            /* Corriger une erreur de définitions dans @api-platform/admin/src/hydra/dataProvider */
            response.json['hydra:totalItems'] = response.json['hydra:member'] ? response.json['hydra:member'].length : 0;

            return response;
          })
};
const apiDocumentationParser = entrypoint => parseHydraDocumentation(entrypoint, { headers: new Headers(fetchHeaders) })
  .then(
    ({ api }) => ({api}),
    (result) => {
      console.log(result);
      switch (result.status) {
        case 401:
          return Promise.resolve({
            api: result.api,
            customRoutes: [{
              props: {
                path: '/',
                render: () => <Redirect to={`/login`}/>,
              },
            }],
          });

        case 200:
          console.log("apiDocumentationParser - result",result);
          return Promise.resolve(result);

        default:
          console.log(result);
          return Promise.reject(result);
      }
    },
  );


const dataProvider = baseDataProvider(entrypoint, fetchHydra, apiDocumentationParser);

export default () => (
  <HydraAdmin
    apiDocumentationParser={ apiDocumentationParser }
    entrypoint={process.env.REACT_APP_API_ENTRYPOINT}
    authProvider={authProvider}
    dataProvider={dataProvider}
  >
    <ResourceGuesser name={"addresses"} list={AddressesList}/>
    <ResourceGuesser name={"bank_accounts"}/>
    <ResourceGuesser name={"bills"}/>
    <ResourceGuesser name={"customer_bills"}/>
    <ResourceGuesser name={"supplier_bills"}/>
    <ResourceGuesser name={"refund_bills"}/>
    <ResourceGuesser name={"categories"}/>
    <ResourceGuesser name={"comments"}/>
    <ResourceGuesser name={"customers"}/>
    <ResourceGuesser name={"delivery_details"}/>
    <ResourceGuesser name={"delivery_sets"}/>
    <ResourceGuesser name={"favorites"}/>
    <ResourceGuesser name={"forums"}/>
    <ResourceGuesser name={"images"}/>
    <ResourceGuesser name={"messages"}/>
    <ResourceGuesser name={"order_details"}/>
    <ResourceGuesser name={"returned_orders"}/>
    <ResourceGuesser name={"order_sets"}/>
    <ResourceGuesser name={"payments"}/>
    <ResourceGuesser name={"products"}/>
    <ResourceGuesser name={"registers"}/>
    <ResourceGuesser name={"shippers"}/>
    <ResourceGuesser name={"shopping_cards"}/>
    <ResourceGuesser name={"shopping_card_supplier_products"}/>
    <ResourceGuesser name={"suppliers"}/>
    <ResourceGuesser name={"supplier_products"}/>
    <ResourceGuesser name={"users"}/>
    <ResourceGuesser name={"withdrawals"}/>


  </HydraAdmin>
);


