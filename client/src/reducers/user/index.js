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
import unsubscribe from "./unsubscribe";
import googleUserAuthentication from "./googleUserAuthentication";
import googleUserRegistration from "./googleUserRegistration";

export default combineReducers({
  list,
  authentication,
  googleUserAuthentication,
  googleUserRegistration,
  registration,
  subscription,
  update,
  del,
  show,
  unlockAccount,
  updatePassword,
  profile,
  unsubscribe
});
