import { combineReducers } from 'redux';
import list from './list';
import create from './create';
import update from './update';
import del from './delete';
import show from './show';
import profile from "./profile";
import supplier from "./supplier";

export default combineReducers({ list, create, update, del, show, profile, supplier });
