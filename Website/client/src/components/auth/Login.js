import React, { Fragment, useEffect, useState } from 'react';
import { Link, Redirect, useHistory} from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });


  const { email, password } = formData;
  const [msg, setMsg] = useState('');
  const history = useHistory();

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://johncagetribute.org/login/', {
          email: email,
          password: password
      });
      history.push("/dashboard");
    } catch (error) {
        if (error.response) {
            setMsg(error.response.data.msg);
        }
    }
  };

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


export default Login;
