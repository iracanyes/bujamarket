import React from 'react';
import { HydraAdmin, ResourceGuesser  } from '@api-platform/admin';
import parseHydraDocumentation from '@api-platform/api-doc-parser/lib/hydra/parseHydraDocumentation';
import { dataProvider as baseDataProvider, fetchHydra as baseFetchHydra  } from '@api-platform/admin';
import { Redirect } from 'react-router-dom';
import authProvider from "./authProvider";
import AddressesList from "./component/address/AddressesList";
//import Dashboard from "./component/page/Dashboard";
import Dashboard  from "./component/page/dashboard/Dashboard";
import history from "./utils/history";
import isIndex from "lodash-es/_isIndex";
//import AdminDashboardLayout from "./component/page/layout/AdminDashboardLayout";


import {
  AssignmentReturnedTwoTone,
  AssignmentReturnTwoTone,
  CollectionsTwoTone,
  CancelPresentationTwoTone,
  CommentTwoTone,
  FavoriteTwoTone,
  LocalGroceryStoreTwoTone,
  LocalShippingTwoTone,
  LocationCityIcon,
  LocationOnTwoTone,
  PaymentTwoTone,
  PeopleAltTwoTone,
  QuestionAnswerTwoTone,
  AddShoppingCartTwoTone,
  HowToVoteTwoTone,
  ReceiptTwoTone,
  DirectionsBoatTwoTone,
  AssignmentTwoTone,
  AccountCircleTwoTone,
  ThumbsUpDownTwoTone,
  CategoryTwoTone,
  GroupAddTwoTone,
  AccountBoxTwoTone,
  MessageTwoTone, MonetizationOnTwoTone, AllInboxTwoTone, StorageTwoTone, QueueTwoTone,
} from "@material-ui/icons";



const entrypoint = process.env.REACT_APP_API_ENTRYPOINT;
const fetchHeaders = {'Authorization': `Bearer ${window.localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
const fetchHydra = (url, options = {}) => {
  options.headers = new Headers(fetchHeaders);
  return baseFetchHydra(url, options)
          .then(response => {


            /* Corriger une erreur de définitions dans @api-platform/admin/src/hydra/dataProvider */
            response.json['hydra:totalItems'] = response.json['hydra:member'] ? response.json['hydra:member'].length : 0;

            return response;
          })
};
const apiDocumentationParser = entrypoint => parseHydraDocumentation(entrypoint, { headers: new Headers(fetchHeaders) })
  .then(
    ({ api }) => ({api}),
    (result) => {

      switch (result.status) {
        case 401:

          return Promise.resolve({
            api: result.api,
            customRoutes: [{
              props: {
                path: '/',
                render: () => (
                  <Redirect to={{
                      pathname: `../../login`,
                      state: { from: window.location }
                    }}
                  />
                ),
              },
            }],
          });



        case 200:

          return Promise.resolve(result);

        default:

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
    dashboard={Dashboard}
    //appLayout={AdminDashboardLayout}
  >


    <ResourceGuesser name={"addresses"} icon={LocationOnTwoTone} options={{label: 'Adresses'}} list={AddressesList}/>
    <ResourceGuesser name={"bank_accounts"} icon={PaymentTwoTone} options={{label: 'Comptes bancaires'}} />
    <ResourceGuesser name={"bills"} icon={ReceiptTwoTone} options={{label: 'Factures'}} />
    <ResourceGuesser name={"customer_bills"} icon={ReceiptTwoTone} options={{label: 'Factures client'}} />
    <ResourceGuesser name={"supplier_bills"} icon={ReceiptTwoTone} options={{label: 'Factures fournisseurs'}} />
    <ResourceGuesser name={"refund_bills"} icon={ReceiptTwoTone} options={{label: 'Factures remboursement'}} />
    <ResourceGuesser name={"categories"} icon={CategoryTwoTone} options={{label: 'Catégories'}} />
    <ResourceGuesser name={"comments"} icon={ThumbsUpDownTwoTone} options={{label: 'Évaluations'}} />
    <ResourceGuesser name={"customers"} icon={AccountCircleTwoTone} options={{label: 'Clients'}} />
    <ResourceGuesser name={"delivery_details"} icon={HowToVoteTwoTone} options={{label: 'Livraisons - Détail'}} />
    <ResourceGuesser name={"delivery_sets"} icon={LocalShippingTwoTone} options={{label: 'Livraisons - Ensemble'}} />
    <ResourceGuesser name={"favorites"} icon={FavoriteTwoTone} options={{label: 'Favoris'}} />
    <ResourceGuesser name={"forums"} icon={QuestionAnswerTwoTone} options={{label: 'Discussions'}} />
    <ResourceGuesser name={"images"} icon={CollectionsTwoTone} options={{label: 'Images'}} />
    <ResourceGuesser name={"messages"} icon={MessageTwoTone} options={{label: 'Messages'}} />
    <ResourceGuesser name={"order_details"} icon={AssignmentTwoTone} options={{label: 'Commandes - Détail'}} />
    <ResourceGuesser name={"returned_orders"} icon={AssignmentReturnTwoTone} options={{label: 'Commandes - Retour'}} />
    <ResourceGuesser name={"order_sets"} icon={AllInboxTwoTone} options={{label: 'Commandes - Ensemble'}} />
    <ResourceGuesser name={"payments"} icon={MonetizationOnTwoTone} options={{label: 'Paiements'}} />
    <ResourceGuesser name={"products"} icon={StorageTwoTone} options={{label: 'Produits'}} />
    <ResourceGuesser name={"registers"} icon={GroupAddTwoTone} options={{label: 'Inscriptions'}} />
    <ResourceGuesser name={"shippers"} icon={DirectionsBoatTwoTone} options={{label: 'Transporteurs'}} />
    <ResourceGuesser name={"shopping_cards"} icon={LocalGroceryStoreTwoTone} options={{label: 'Paniers de commande'}} />
    <ResourceGuesser name={"shopping_card_supplier_products"} icon={AddShoppingCartTwoTone} options={{label: 'Paniers de commande - produits'}} />
    <ResourceGuesser name={"suppliers"} icon={AccountBoxTwoTone} options={{label: 'Fournisseurs'}} />
    <ResourceGuesser name={"supplier_products"} icon={QueueTwoTone} options={{label: 'Fournisseurs - produits'}} />
    <ResourceGuesser name={"users"} icon={PeopleAltTwoTone} options={{label: 'Utilisateurs'}} />
    <ResourceGuesser name={"withdrawals"} icon={CancelPresentationTwoTone} options={{label: 'Annulations'}} />


  </HydraAdmin>
);


