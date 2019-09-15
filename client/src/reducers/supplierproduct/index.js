import { combineReducers } from 'redux';
import list from './list';
import listByProductId from "./listByProductId";
import create from './create';
import update from './update';
import del from './delete';
import show from './show';

export default combineReducers({ list, listByProductId, create, update, del, show });
