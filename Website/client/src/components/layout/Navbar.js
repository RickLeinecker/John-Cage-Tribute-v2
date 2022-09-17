import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  
  const authLinks = (
	<ul>
	  <li>
        <Link to='/rooms'>Rooms</Link>
      </li>
	  <li>
        <Link to='/search'>Search</Link>
      </li>
	  <li>
		<Link to='/dashboard'>
		  <i className='fas fa-user' />{' '}
		  <span>Dashboard</span>
		</Link>
	  </li>
	  <li>
		<a onClick={logout} href='#!'>
		  <span>Logout</span>
		</a>
	  </li>
	</ul>
  );

  const guestLinks = (
	<ul>
	  <li>
        <Link to='/rooms'>Rooms</Link>
      </li>
	  <li>
        <Link to='/search'>Search</Link>
      </li>
	</ul>
  );

  return (
	<nav className='navbar bg-dark'>
	  <h1>
		<Link to='/'>
		  John Cage Tribute
		</Link>
	  </h1>
	  {!loading && (
		<Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
	  )}
	</nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(Navbar);
