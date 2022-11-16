import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ProSidebarProvider } from 'react-pro-sidebar';
import  {useState, useEffect} from "react";

const Landing = () => {
  const [isAuthenticated, setAuth] = useState(false);

  useEffect(() =>
    {
        getToken();
    },[]);

    const getToken =() => {
      let tokenData = localStorage.getItem("token")
      var parsedData = JSON.parse(tokenData);
  
      if (parsedData != null){
        setAuth(true);
      }
      else{
        setAuth(false);

      }
    }

    let authui

    if(isAuthenticated == false){
      authui = <div>
      <h1 className='medium'>Sign Up to Create Your Own Concert!</h1>
      <Link to='/register' className='btn btn-primary'>
        Sign Up
      </Link>
      <Link to='/login' className='btn btn-primary'>
        Log In
      </Link>
    </div>
    } else{
      authui = <div>
      <h1 className='medium'>Dashboard</h1>
      <Link to='/dashboard' className='btn btn-primary'>
        Dashboard
      </Link>
    </div>
    }

  return (
    <ProSidebarProvider>
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
              {authui}
              </div>
              <div className='buttons'>
                <h1 className='medium'>Want to learn more about John Cage?</h1>
                <Link to='/infopage' className='btn btn-primary'>
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </ProSidebarProvider>
  );
};

export default Landing;
