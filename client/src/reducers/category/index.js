import { combineReducers } from 'redux';
import list from './list';
import create from './create';
import show from './show';

export default combineReducers({ list, create, show });
