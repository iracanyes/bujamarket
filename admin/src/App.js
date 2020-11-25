import React from 'react';
import { HydraAdmin, ResourceGuesser, hydraDataProvider as baseDataProvider, fetchHydra as baseFetchHydra  } from '@api-platform/admin';
import { parseHydraDocumentation } from "@api-platform/api-doc-parser";
import { Redirect, Route } from 'react-router-dom';
import authProvider from "./utils/authProvider";
import AddressesList from "./component/address/AddressesList";
import CategoriesList from "./component/category/CategoriesList";
import { messages, i18nProvider } from "./config/i18n";
import Dashboard  from "./component/page/dashboard/Dashboard";
import history from "./utils/history";
/* Styles */
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import './assets/scss/index.scss';


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
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse
} from "@material-ui/core";
import MainMenuLeft from "./component/layout/MainMenuLeft";
import * as fetchUtils from "./utils/fetchUtils";
import LoginPage from "./component/page/LoginPage";

const entrypoint = process.env.REACT_APP_API_ENTRYPOINT;

const fetchHeaders = {'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/ld+json' };

const fetchHydra = (url, options = {}) => {
  return baseFetchHydra(url, {
    ...options,
    headers: new Headers(fetchHeaders),
  })
  .then(response => {
    // Corriger une erreur de définitions dans @api-platform/admin/src/hydra/dataProvider
    response.json['hydra:totalItems'] = response.json['hydra:member'] ? response.json['hydra:member'].length : 0;

    return response;
  })
  .catch(e => {

  })


};


const apiDocumentationParser = entrypoint => parseHydraDocumentation(entrypoint, { headers: new Headers(fetchHeaders) })
    .then(
        ({ api }) => ({ api }),
        (result) => {
          
          switch (result.status) {
            case 401:
                // Prevent infinite loop if the token is expired
                localStorage.removeItem("token");
                return Promise.resolve({
                  ...result,
                  customRoutes: [
                    <Route path="/" render={() => {
                      switch (true) {
                        case  window.localStorage.getItem("token") !== null  && !window.location.href.includes( 'login'):
                          window.location.reload();
                          break;
                        default:
                          return  <Redirect to="login" />;
                      }

                    }} />
                  ]
                });
              default:
                  return Promise.reject(result);
          }
        },
    );


const dataProvider = baseDataProvider(entrypoint, fetchHydra, apiDocumentationParser);

export default () => (
  <HydraAdmin
    entrypoint={process.env.REACT_APP_API_ENTRYPOINT}
    authProvider={authProvider}
    dataProvider={dataProvider}
    loginPage={LoginPage}
    dashboard={Dashboard}
    title={"Buja Market - Admin"}
    //i18nProvider={i18nProvider}
    menu={MainMenuLeft}
    history={history}
  >


    <ResourceGuesser name={"addresses"} icon={LocationOnTwoTone} options={{label: 'Adresses'}} list={AddressesList}/>
    <ResourceGuesser name={"bank_accounts"} icon={PaymentTwoTone} options={{label: 'Comptes bancaires'}} />
    <ResourceGuesser name={"bills"} icon={ReceiptTwoTone} options={{label: 'Factures'}} />
    <ResourceGuesser name={"customer_bills"} icon={ReceiptTwoTone} options={{label: 'Factures client'}} />
    <ResourceGuesser name={"supplier_bills"} icon={ReceiptTwoTone} options={{label: 'Factures fournisseurs'}} />
    <ResourceGuesser name={"refund_bills"} icon={ReceiptTwoTone} options={{label: 'Factures remboursement'}} />
    <ResourceGuesser name={"categories"} icon={CategoryTwoTone} options={{label: 'Catégories'}} list={CategoriesList} />
    <ResourceGuesser name={"comments"} icon={ThumbsUpDownTwoTone} options={{label: 'Évaluations'}} />
    <ResourceGuesser name={"customers"} icon={AccountCircleTwoTone} options={{label: 'Clients'}} />
    <ResourceGuesser name={"delivery_details"} icon={HowToVoteTwoTone} options={{label: 'Livraisons - Détail'}} />
    <ResourceGuesser name={"delivery_sets"} icon={LocalShippingTwoTone} options={{label: 'Livraisons - Ensemble'}} />
    <ResourceGuesser name={"favorites"} icon={FavoriteTwoTone} options={{label: 'Favoris'}} />
    <ResourceGuesser name={"forums"} icon={QuestionAnswerTwoTone} options={{label: 'Discussions'}} />
    <ResourceGuesser name={"images"} icon={CollectionsTwoTone} options={{label: 'Images'}} />
    <ResourceGuesser name={"messages"} icon={MessageTwoTone} options={{label: 'Messages'}} />
    <ResourceGuesser name={"order_sets"} icon={AllInboxTwoTone} options={{label: 'Commandes - Ensemble'}} />
    <ResourceGuesser name={"order_details"} icon={AssignmentTwoTone} options={{label: 'Commandes - Détail'}} />
    <ResourceGuesser name={"withdrawals"} icon={CancelPresentationTwoTone} options={{label: 'Commandes - Annulations'}} />
    <ResourceGuesser name={"returned_orders"} icon={AssignmentReturnTwoTone} options={{label: 'Commandes - Retour'}} />
    <ResourceGuesser name={"payments"} icon={MonetizationOnTwoTone} options={{label: 'Paiements'}} />
    <ResourceGuesser name={"products"} icon={StorageTwoTone} options={{label: 'Produits'}} />
    <ResourceGuesser name={"registers"} icon={GroupAddTwoTone} options={{label: 'Inscriptions'}} />
    <ResourceGuesser name={"shippers"} icon={DirectionsBoatTwoTone} options={{label: 'Transporteurs'}} />
    <ResourceGuesser name={"shopping_cards"} icon={LocalGroceryStoreTwoTone} options={{label: 'Paniers de commande'}} />
    <ResourceGuesser name={"shopping_card_supplier_products"} icon={AddShoppingCartTwoTone} options={{label: 'Paniers de commande - produits'}} />
    <ResourceGuesser name={"suppliers"} icon={AccountBoxTwoTone} options={{label: 'Fournisseurs'}} />
    <ResourceGuesser name={"supplier_products"} icon={QueueTwoTone} options={{label: 'Fournisseurs - produits'}} />
    <ResourceGuesser name={"users"} icon={PeopleAltTwoTone} options={{label: 'Utilisateurs'}} />


  </HydraAdmin>
);


