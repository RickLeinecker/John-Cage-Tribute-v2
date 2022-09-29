import React, { Fragment, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;
  const history = useHistory();
  const [msg, setMsg] = useState('');

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
        await Axios.post('http://localhost:3001/login', {
            email: email,
            password: password
        });
        history.push("/dashboard");
    } catch (error) {
        if (error.response) {
            setMsg(error.response.data.msg);
        }
    }
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user" /> Sign Into Your Account
      </p>
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
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
    </Fragment>
  );
};

export default Login
