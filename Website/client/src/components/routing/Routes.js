import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Register from '../auth/Register';
import Login from '../auth/Login';
import Alert from '../layout/Alert';
import Dashboard from '../newDashboard/Dashboard';
import Schedule from '../compositions/Schedule';
import ProfileForm from '../profile-forms/ProfileForm';
import AddExperience from '../profile-forms/AddExperience';
import AddEducation from '../profile-forms/AddEducation';
import Search from '../compositions/Search';
import Rooms from '../compositions/Rooms';
import Profile from '../compositions/Profile';
import Posts from '../posts/Posts';
import Post from '../post/Post';
import NotFound from '../layout/NotFound';
import PrivateRoute from '../routing/PrivateRoute';
import Landing from '../layout/Landing';
import AdminDashboard from '../newDashboard/AdminDashboard';
import MaestroRequests from '../compositions/MaestroRequests';
import ContestPage from '../compositions/ContestPage';
import AdminLogin from '../auth/AdminLogin';

const Routes = props => {
  return (
    <section className="container">
      <Alert />
      <Switch>
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/search" component={Search} />
        <Route exact path="/rooms" component={Rooms} />
        <Route exact path="/Profile" component={Profile} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/admindashboard" component={AdminDashboard} />
        <Route exact path="/maestrorequests" component={MaestroRequests} />
        <Route exact path="/schedule" component={Schedule} />
        <Route exact path="/contestpage" component={ContestPage} />
        <PrivateRoute exact path="/landing" component={Landing} />     
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
