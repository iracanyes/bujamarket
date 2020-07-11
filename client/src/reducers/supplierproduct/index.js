import { combineReducers } from 'redux';
import list from './list';
import listByProductId from "./listByProductId";
import listBySupplier from "./listBySupplier";
import create from './create';
import update from './update';
import del from './delete';
import show from './show';
import listBySupplierId from "./listBySupplierId";

export default combineReducers({ list, listByProductId, listBySupplier, listBySupplierId, create, update, del, show });
