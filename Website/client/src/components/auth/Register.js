import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';
import Axios from "axios";

const Register = ({ setAlert, register, isAuthenticated }) => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const displayInfo = () => {
    console.log(username + email + password + password2);
  }

  const onSubmit = async (e) => {
    e.preventDefault();
	var success = true;
	if(!/^[a-zA-Z0-9]{3,}$/.test(username)) {
		setAlert("Username is not valid", "danger");
		success = false;
	}
	if(!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password)) {
		setAlert("Password is not valid", "danger");
		success = false;
	}
    if(password !== password2) {
      setAlert('Passwords do not match', 'danger');
	  success = false;
    } 
	if(success) {
      Axios.post('http://localhost:3001/registration', {
        username: username,
        email: email,
        password: password
      })
      .then(res => {
        console.log("Getting from ::::", res.data)
      })
      .catch(err => console.log(err));
    }
  };

  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }
  var grav = (
	<small className='form-text'>
		This site uses Gravatar so if you want a profile image, use a
		Gravatar email
	</small>
  );
  grav = null;
  return (
    <div className='loginSignup'>
      <div className='dark-overlay'>
        <div className='loginSignup-inner'>
          <div className='loginSignup-box'>
            <Fragment>
              <h1 className='large text-primary'>
                Sign Up
              </h1>
              <br/>
              <form className='form' onSubmit={onSubmit}>
                <div className='form-group'>
                  <input
                    type='text'
                    placeholder='Username'
                    name='username'
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                </div>
                <div className='form-group'>
                  <input
                    type='email'
                    placeholder='Email Address'
                    name='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  {grav}
                </div>
                <div className='form-group'>
                  <input
                    type='password'
                    placeholder='Password'
                    name='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
                <div className='form-group'>
                  <input
                    type='password'
                    placeholder='Confirm Password'
                    name='password2'
                    value={password2}
                    onChange={e => setPassword2(e.target.value)}
                  />
                </div>
                <input type='submit' onClick={displayInfo} className='btn btn-primary' value='Register' />
              </form>
              <br/>
              <div className='loginSignup-bottom'>
                <h1 className='medium'>
                  Already have an account?
                </h1>
                <Link to='/login' className='btn btn-primary'>
                  Log In
                </Link>
              </div>
            </Fragment>
          </div>
        </div>
      </div>
    </div>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { setAlert, register })(Register);
