import { combineReducers } from 'redux';
import list from './list';
import create from './create';
import update from './update';
import del from './delete';
import show from './show';
import getClientSecret from "./getClientSecret";

export default combineReducers({ list, create, update, del, show, getClientSecret });
