import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from './components/layout/Landing';
import AdminLogin from './components/auth/AdminLogin';
import Login from './components/auth/Login';
import Routes from './components/routing/Routes';
import Navbar from './components/layout/Navbar';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';


import './App.css';

const App = () => {

  return (  
    <Provider store={store}> 
      <Router>
     
          <Switch>
            <Route exact path="/" component={AdminLogin} />
            <Route component={Routes} />
          </Switch> 

 <Navbar>
</Navbar>

      </Router>   
    </Provider>
  );
};

export default App;
