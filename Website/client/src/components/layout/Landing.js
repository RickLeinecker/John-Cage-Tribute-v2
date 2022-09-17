import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return (
      <section className='landing'>
        <div className='dark-overlay'>
          <div className='landing-inner'>
            <h1 className='x-large'>John Cage Tribute</h1>
            <p className="landing-text">Hello, and welcome to the John Cage Tribute! Here is where you can listen to past and live recordings that have happened or are happening right now from the John Cage Tribute mobile application. This application was created to celebrate the life and teachings of John Milton Cage Jr. His works spread into the areas of not only music but also mathematics, computing, and modern technology. Now, in the world where modern technology has advanced even more since his time, we are given an opportunity to use it to bring his works to life and make them everlasting. With these in mind, we hope to offer a medium in which an audience can digitally attend and join in on an original John Cage composition :)</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <h1 className='x-large'>John Cage Tribute hehe</h1>
          <div className='buttons'>
            <Link to='/register' className='btn btn-primary'>
              Sign Up
            </Link>
            <Link to='/login' className='btn btn-light'>
              Login
            </Link>
          </div>
			<p className="landing-text">Hello, and welcome to the John Cage Tribute! Here is where you can listen to past and live recordings that have happened or are happening right now from the John Cage Tribute mobile application. This application was created to celebrate the life and teachings of John Milton Cage Jr. His works spread into the areas of not only music but also mathematics, computing, and modern technology. Now, in the world where modern technology has advanced even more since his time, we are given an opportunity to use it to bring his works to life and make them everlasting. With these in mind, we hope to offer a medium in which an audience can digitally attend and join in on an original John Cage composition :)</p>
        </div>
      </div>
    </section>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Landing);
