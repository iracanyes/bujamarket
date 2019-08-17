import { combineReducers } from 'redux';
import list from './list';
import authentication from './authentication';
import registration from "./registration";
import update from './update';
import del from './delete';
import show from './show';

export default combineReducers({ list, authentication, registration, update, del, show });
