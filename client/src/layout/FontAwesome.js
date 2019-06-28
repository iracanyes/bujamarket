/**
 * Author: iracanyes
 * Date: 24/06/19
 * Description: Font Awesome library of icons used by the App
 */

import ReactDOM from 'react-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import {
  faComments,
  faHeart,
  faUser,
  faSearch,
  faShoppingCart,
  faSignInAlt,
  faUserAlt,
  faUserCheck,
  faUserEdit,
  faUserCog,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";

import {
  faUser as farUser
} from '@fortawesome/free-regular-svg-icons';

library.add([
  faComments,
  faGoogle,
  faHeart,
  faSearch,
  faShoppingCart,
  faSignInAlt,
  faUser,
  faUserAlt,
  faUserCheck,
  faUserCog,
  faSignOutAlt,
  faUserEdit
]);