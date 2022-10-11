import React, { Fragment, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import api from '../../utils/api';
import CompList from '../compositions/CompList';

const deleteAccount = () => (dispatch) => {
	if(window.confirm("Are you sure you want to delete your account?")) {
		api.delete("/compositions/removeuser")
			.then(res => {
				dispatch({type: "LOGOUT"})
			})
	}
}

const Dashboard = ({
  deleteAccount,
  auth: { user }
}) => {
	const [list, setList] = useState([]);
	
	const update = () => {
		api.get("/compositions/usercompositions").then(r => {
			setList(r.data)
		}, rej => {
			document.getElementById("dash-err").innerHTML = "Error getting compositions"
		})
	}
	
	useEffect(() => {
		update();
	}, []);
	
	return (
		<Fragment>
				<div className='search'>
			<h1 className="large text-primary">Dashboard</h1>
			<div style={{marginBottom:"35px"}}>
				<p className="lead">Welcome, {user && user.name}</p>
				<p>Email: {user && user.email}</p>
			</div>
			<div style={{minWidth:"700px"}}>
				<div style={{width:"100%",borderBottom:"2px solid #17a2b8"}}>
					<p style={{fontSize:"2em"}}>My Compositions</p>
				</div>
				<div style={{textAlign:"center",padding:"10px"}}>
					<CompList list={list} dash={true} user={user} update={update}/>
					<p id="dash-err" style={{color:"red"}}></p>
				</div>
				<div className="my-2">
					<button className="btn btn-danger" onClick={deleteAccount}>
						Delete My Account
					</button>
				</div>
			</div>
		</Fragment>
	);
};

Dashboard.propTypes = {
	deleteAccount : PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	auth: state.auth
});

export default connect(mapStateToProps, {deleteAccount})(Dashboard);
