import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    login(email, password);
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className='loginSignup'>
      <div className='dark-overlay'>
        <div className='loginSignup-inner'>
          <div className='loginSignup-box'>
            <Fragment>
              <h1 className="large text-primary">
                Log In
              </h1>
              <br/>
              <form className="form" onSubmit={onSubmit}>
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    value={email}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    minLength="6"
                  />
                </div>
                <input type="submit" className="btn btn-primary" value="Log In" />
              </form>
              <br/>
              <div className='loginSignup-bottom'>
                <h1 className="medium">
                  Don't have an account?
                </h1>
                <Link to="/register" className='btn btn-primary'>
                  Sign Up
                </Link>
              </div>
            </Fragment>
          </div>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);
