import { combineReducers } from 'redux';

let token = localStorage.getItem("token") !== null && JSON.parse(localStorage.getItem("token"));
const initialState = token ? { loggingIn: true, token } : {};


export function notify( state = initialState, action){
  switch(action.type){
    case 'GOOGLE_USER_REGISTER_NOTIFICATION':
      return action.notification;
    default:
      return state;
  }
}

export function error(state = initialState, action) {
  switch (action.type) {
    case 'GOOGLE_USER_REGISTER_ERROR':
      return action.error;

    default:
      return state;
  }
}

export function request(state = initialState, action) {
  switch (action.type) {
    case 'GOOGLE_USER_REGISTER_REQUEST':
      return { loggingIn: true, user: action.user };

    default:
      return state;
  }
}

export function loading(state = initialState, action) {
  switch (action.type) {
    case 'GOOGLE_USER_REGISTER_LOADING':
      return action.loading;

    default:
      return state;
  }
}

export function registerGoogleUser(state = initialState, action) {
  switch (action.type) {
    case 'GOOGLE_USER_REGISTER_SUCCESS':
        return { loggedIn: true, user: action.user};

    default:
      return state;
  }
}



export default combineReducers({ error, loading, request, registerGoogleUser, notify });
