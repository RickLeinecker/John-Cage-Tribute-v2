import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Register from '../auth/Register';
import Login from '../auth/Login';
import Alert from '../layout/Alert';
import Dashboard from '../dashboard/Dashboard';
import ProfileForm from '../profile-forms/ProfileForm';
import AddExperience from '../profile-forms/AddExperience';
import AddEducation from '../profile-forms/AddEducation';
import Search from '../compositions/Search';
import Rooms from '../compositions/Rooms';
import Profile from '../profile/Profile';
import Posts from '../posts/Posts';
import Post from '../post/Post';
import NotFound from '../layout/NotFound';
import PrivateRoute from '../routing/PrivateRoute';
import Landing from '../layout/Landing';
import AdminLogin from '../auth/AdminLogin';

const Routes = props => {
  return (
    <section className="container">
      <Alert />
      <Switch>
        <PrivateRoute exact path="/landing" component={Landing} />      // Route
        <PrivateRoute exact path="/register" component={Register} />   // Route
        <PrivateRoute exact path="/login" component={Login} />         // Route
        <PrivateRoute exact path="/search" component={Search} />       // Route
        <PrivateRoute exact path="/rooms" component={Rooms} />         // Route
        <PrivateRoute exact path="/profile/:id" component={Profile} /> // Route
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute exact path="/create-profile" component={ProfileForm} />
        <PrivateRoute exact path="/edit-profile" component={ProfileForm} />
        <PrivateRoute exact path="/add-experience" component={AddExperience} />
        <PrivateRoute exact path="/add-education" component={AddEducation} />
        <PrivateRoute exact path="/posts" component={Posts} />
        <PrivateRoute exact path="/posts/:id" component={Post} />
        <Route component={NotFound} />
      </Switch>
    </section>
  );
};

export default Routes;
