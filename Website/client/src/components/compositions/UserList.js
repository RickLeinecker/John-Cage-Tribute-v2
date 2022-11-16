import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import api from '../../utils/api';
import {setAlert} from "../../actions/alert"
import Moment from 'moment';
import * as FaIcons from 'react-icons/fa';
import { IconContext } from 'react-icons';
import * as AiIcons from 'react-icons/ai';
import axios from 'axios';

class UserList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			list: props.list,
			userId: props.userId
		}
		console.log("-_-",  props.list);
	}
	
	componentDidUpdate(prevProps) {
		if(prevProps.list !== this.props.list) {
			this.setState({
				list: this.props.list
			})
		}

		if(prevProps.userId !== this.props.userId) {
			this.setState({
				userId: this.props.userId
			})
		}
	}
		
	render() {
		var list; 
		console.log("REQUESTS LIST",this.state.list, this.state.userId);
		if(this.state.list.length != 0) {
			list = this.state.list.map((item, i) => {
				// if the runtime is undefined, the composition failed and should not be shown
				console.log("ITEM", item)
				return (<UserListItem 
					info={item}
					key={item._id}
					user={this.props.userId}
					maestro = {item.maestroId}
				/>)
			})
		}
		else {
			list = (<p style={{margin:"5vh"}}>No Requests</p>)
		}
		return (
		<div style={{textAlign:"center"}}>
			<div id="comp-list-header">
				<div style={{width:"100%",margin:"5px"}}>Username</div>
                <div style={{width:"100%",margin:"5px"}}>Email</div>
			</div>
			{list}
		</div>
		);
	}
}

class UserListItem extends React.Component {
	constructor(props) {
		super(props);
		console.log("PROPS", props.info)
		this.state = {
			info: props.info,
			chosen: false,
			sidebarClass: "",
			viewing: false,
			formdata: {
				username: props.info.username,
                email: props.info.email,
			}
		}
		this.cancelView = this.cancelView.bind(this);
	}
	
	render() {
		var {info, formdata} = this.state;
		console.log("ID SHOWN HERE: ");
		console.log(info.id);
		
		var sidebar = null;
		if(this.state.chosen) {
			console.log("chosen")
			console.log("comp info", info)
			var c = "info-field-username";
			var c1 = "info-p";
			sidebar = (

			<IconContext.Provider value={{ color: '#fff' }}>
			<div className="dark-overlay" style={{zIndex:"2", position:"fixed"}}>
				
				<div id="sidebar" className={'sidebar active'} style={{zIndex:"0"}}>
					<div id= "close" className = 'close' onClick={()=>this.setState({chosen: false}) }>
							 <AiIcons.AiOutlineClose />
					</div>

                    {!this.state.viewing ? (
						<div className="sb-ref" style={{padding:"10px"}}>
							<h2 id="info-username">User Information</h2>
							<br />
							<p className={c1}>
								<span className={c}>Username: </span>{info.username}
							</p>
                            <p className={c1}>
								<span className={c}>Email: </span>{info.email}
							</p>
                            <p className={c1}>
								<span className={c}>Bio: </span>{info.bio}
							</p><br />
							{/* Accepting and Rejecting a request */}
                            <div style={{padding:"5px 0px"}}>
								<button
                                onClick={() => this.handleAccept(info.username, info.id)}
                                style={{padding:"0px 4px",marginRight:"5px"}}>
                                    Accept
                                </button>
								<button
                                onClick={() => this.handleReject(info.username, info.id)}
                                style={{padding:"0px 4px"}}>
                                    Reject
                                </button>
							</div>
						</div>
						
					
					): (null) }
				</div>
			</div>
			</IconContext.Provider>
			)
		}
		
		return (
		<Fragment>
			{sidebar}
			<div className="comp-list-item" onClick={()=>this.setState({chosen: true})}>
				<div style={{width:"100%",margin:"5px"}}>{info.username}</div>
                <div style={{width:"100%",margin:"5px"}}>{info.email}</div>
			</div>
		</Fragment>
		);
	}
	
	cancelView() {
		const {info} = this.props;
		this.setState({
			formdata: {
				title: info.title,
				tags: info.tags.join(","),
				description: info.description,
				private: info.private
			},
			viewing: false
		})
	}

    handleAccept(username, id) {
        if(window.confirm("Are you sure you want user " + username + " to be a maestro?")) {
            console.log("Admin Accepted " + username);
			var payload = {
				id: id
			}
			console.log("ursa");
    		console.log(payload);
            axios.post("http://localhost:3001/changeismaestro", payload);
			axios.post("http://localhost:3001/changeisrequested", payload);
			window.location.reload();
        }
    }

    handleReject(username, id) {
        if(window.confirm("Are you sure you want to reject user " + username)) {
            console.log("Admin Rejected " + username);
            var payload = {
				id: id
			}
			axios.post("http://localhost:3001/changeisrequested", payload);
			window.location.reload();
        }
    }
}
export default connect(null, {setAlert})(UserList);