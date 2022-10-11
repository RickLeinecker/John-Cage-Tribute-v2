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
          <h1 className='x-large'>John Cage Tribute</h1>
          <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
          <div className='landing-box'>
			    <p className="landing-text">
            Welcome to the John Cage Tribute! 
            Here you can listen to (and maybe even participate in) performances inspired by the works of John Cage. 
            To achieve this, our site utilizes a mobile app to record audio from up to 5 different devices and mixes them to produce a piece in John Cage's style.
          </p>
          <br/>
          <div className='landing-bottom'>
            <div className='buttons'>
              <h1 className='medium'>Listen to Recordings!</h1>
              <Link to='/search' className='btn btn-primary'>
                Past Performances
              </Link>
            </div>
            <br/>
            <div className='buttons'>
              <h1 className='medium'>Sign Up to Create Your Own Concert!</h1>
              <Link to='/register' className='btn btn-primary'>
                Sign Up
              </Link>
              <Link to='/login' className='btn btn-primary'>
                Login
              </Link>
            </div>
            <div className='buttons'>
              <h1 className='medium'>Want to learn more about John Cage?</h1>
              <Link className='btn btn-primary'>
                Learn More
              </Link>
            </div>
          </div>
          </div>
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
