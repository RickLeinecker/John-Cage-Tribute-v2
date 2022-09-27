import React, { Fragment, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Axios from "axios";

const Register = () => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const history = useHistory();
  const [msg, setMsg] = useState('');

  const displayInfo = () => {
    console.log(username + email + password + password2);
  }

  const onSubmit = async (e) => {
    e.preventDefault();
	var success = true;
	if(!/^[a-zA-Z0-9]{3,}$/.test(username)) {
		success = false;
	}
	if(!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password)) {
		success = false;
	}
    if(password !== password2) {
	  success = false;
    } 
	if(success) {
    console.log("Register has been called");
    e.preventDefault();
    try {
        await Axios.post('http://localhost:3001/users', {
            username: username,
            email: email,
            password: password,
            confPassword: password2
        });
        history.push("/");
    } catch (error) {
        if (error.response) {
            setMsg(error.response.data.msg);
        }
    }
    }
  };

  var grav = (
	<small className='form-text'>
		This site uses Gravatar so if you want a profile image, use a
		Gravatar email
	</small>
  );
  grav = null;
  return (
    <Fragment>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Create Your Account
      </p>
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
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </Fragment>
  );
};

export default Register
