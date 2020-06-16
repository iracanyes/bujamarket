import { combineReducers } from 'redux';
import list from './list';
import authentication from './authentication';
import registration from "./registration";
import subscription from "./subscription";
import update from './update';
import del from './delete';
import show from './show';
import unlockAccount from "./unlockAccount";
import updatePassword from "./updatePassword";
import profile from "./profile";

export default combineReducers({
  list,
  authentication,
  registration,
  subscription,
  update,
  del,
  show,
  unlockAccount,
  updatePassword,
  profile
});
