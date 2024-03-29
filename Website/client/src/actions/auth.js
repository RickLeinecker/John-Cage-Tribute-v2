import api from '../utils/api';
import Axios from "axios";
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from './types';

// Load User
export const loadUser = () => async dispatch => {
  try {
    console.log("form data is: ", res.data);
    const res = await api.get('/auth');
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Login User
export const login = (email, password) => async dispatch => {
  const body = { email, password };

  try {
    const res = await api.post('/auth', body);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL
    });
  }
};

// Admin Login for testing
export const admin_login = (username, password) => async dispatch => {
  const body = { username, password };

  if (username == process.env.REACT_APP_ADMIN_USR && password == process.env.REACT_APP_ADMIN_PSWRD)
  {
    console.log('Admin login success!');

    dispatch({
      type: LOGIN_SUCCESS
    })

    return;
  }

  console.log('Admin login was a failure.');

  dispatch({
    type: LOGIN_FAIL
  })
}

// Logout
export const logout = () => {
	console.log("logout")
	if(window.confirm("Are you sure you want to logout?"))	
		return {type: LOGOUT}; 
	return {type: ""};
};
