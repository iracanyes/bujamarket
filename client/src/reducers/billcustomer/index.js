import { combineReducers } from 'redux';
import list from './list';
import del from './delete';
//import show from './show';
import download from "./download";

//export default combineReducers({ list, create, update, del, show });
export default combineReducers({ list, del, download });
