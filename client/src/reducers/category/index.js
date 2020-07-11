import { combineReducers } from 'redux';
import list from './list';
import create from './create';
import show from './show';
import getNames from "./getNames";

export default combineReducers({ list, create, show, getNames });
