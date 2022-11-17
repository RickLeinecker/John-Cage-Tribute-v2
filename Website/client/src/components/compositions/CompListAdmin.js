import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import api from '../../utils/api';
import {setAlert} from "../../actions/alert"
import Moment from 'moment';
import * as FaIcons from 'react-icons/fa';
import { IconContext } from 'react-icons';
import * as AiIcons from 'react-icons/ai';
import Axios from "axios";
import { Link, Redirect } from 'react-router-dom';

class CompListAdmin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			list: props.list,
			userId: props.userId
		}

		console.log("props complist", this.state);
	}
	
	componentDidUpdate(prevProps) {
		console.log(this.state);
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
		if(this.state.list.length != 0) {
			list = this.state.list.map((item, i) => {
				// if the runtime is undefined, the composition failed and should not be shown
				console.log("ITEM", item, this.props.userId);
				return (<CompListAdminItem 
					info={item}
					userId = {this.state.userId}
					key={item._id}
					user={this.props.userId}
					maestro = {item.username}
				/>)
			})
		}
		else {
			list = (<p style={{margin:"5vh"}}>No Compositions</p>)
		}
		return (
		<div style={{textAlign:"center"}}>
			<div id="comp-list-header">
				<div style={{width:"100%",margin:"5px"}}>Title</div>
				<div style={{width:"100%",margin:"5px"}}>Maestro</div>
				<div style={{width:"100%",margin:"5px"}}>Date</div>
			</div>
			{list}
		</div>
		);
	}
}

class CompListAdminItem extends React.Component {
	constructor(props) {
		super(props);
		console.log("PROPS", props.info)
		this.state = {
			info: props.info,
			userId: props.userId,
			chosen: false,
			sidebarClass: "",
			editing: false,
			formdata: {
				title: props.info.title,
				description: props.info.description,
				length: props.info.lengthSeconds,
				date: props.info.recordingDate,
				maestro: props.info.username,
				audioFile: props.info.audioFile
				// tags: props.info.tags.join(","),
				// description: props.info.description,
				// private: props.info.private
			}
		}
		//this.chosenState = this.chosenState.bind(this);
		// this.parseDateTime = this.parseDateTime.bind(this);
		// this.deleteComp = this.deleteComp.bind(this);
		this.changeForm = this.changeForm.bind(this);
		// this.submitEdit = this.submitEdit.bind(this);
		// this.cancelEdit = this.cancelEdit.bind(this);
		this.setPrivate = this.setPrivate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
		//CHANGE TO USE USERID
		//localStorage.setItem("target", this.userId);
		console.log(this.info);
		console.log(this.state.formdata.audioFile);
	}
	
	render() {
		var {info, user, formdata} = this.state;

		localStorage.setItem("target", this.state.info.maestroId);
		console.log("KOOKY: ");
		console.log(localStorage.getItem("target"));
		
		var sidebar = null;
		if(this.state.chosen) {
			console.log("chosen")
			console.log("comp info", info)
			var c = "info-field-title";
			var c1 = "info-p";
			sidebar = (

			<IconContext.Provider value={{ color: '#fff' }}>
			<div className="dark-overlay" style={{zIndex:"2", position:"fixed"}}>
				
				<div id="sidebar" className={'sidebar active'} style={{zIndex:"0"}}>
					<div id= "close" className = 'close' onClick={()=>this.setState({chosen: false}) }>
							 <AiIcons.AiOutlineClose />
					</div>
				
					{!this.state.editing ? (
						<div className="sb-ref" style={{padding:"10px"}}>
							<h2 id="info-title">Composition Information</h2>
							<br />
							<p className={c1}>
								<span className={c}>Title: </span>{info.title}
							</p>
							<p className={c1}>
								<span className={c}>Date: </span>{info.date}
							</p>
							<p className={c1}>
								<span className={c}>Maestro: </span>{info.username}
							</p>
							<p className={c1}>
								<span className={c}>Performers: </span>{info.performers}
							</p>
							<p className={c1}>
								<span className={c}>Description: </span>{info.description}
							</p><br />
							<Link to="/userbio" className='btn'>View Maestro</Link>
                            <div>
                                <button onClick={() => this.handleDelete(this.state.info.title, this.state.info.recordingId)} >Delete</button>
                            </div>
							{this.props.user !== undefined ? (
							<div style={{padding:"5px 0px"}}>
								<button onClick={()=>this.setState({editing: true})}
									style={{padding:"0px 4px",marginRight:"5px"}}>Edit</button>
								<button onClick={this.deleteComp}
									style={{padding:"0px 4px"}}>Delete</button>
							</div>
							) : (null)}
							<audio className="audio-elem" controls src={"http://localhost:3001/audio/"
								+ this.state.formdata.audioFile} >
							</audio>	 	 
						</div>
						
					
					) : ( // Composition editing form
						<div style={{padding: "10px"}}>
							<h2 className="text-primary" id="info-title">Edit Composition</h2>
							<p id="edit-comp-err" style={{color:"red"}}></p>
							<form onSubmit={this.submitEdit}>
								<br />
								<h4>Title</h4>
								<p style={{color:"gray",fontSize:".8em"}}>Limit 64 characters</p>
								<input value={formdata.title} onChange={this.changeForm} name="title" className="edit-info-field"/>
								<p id="edit-title-err" style={{color:"red"}}></p>
								<br />
								<h4>Description</h4>
								<p style={{color:"gray",fontSize:".8em"}}>Limit 256 characters</p>
								<textarea value={formdata.description} onChange={this.changeForm} name="description" className="edit-info-field"/>
								<p id="edit-desc-err" style={{color:"red"}}></p>
								<br /><br />
								<input type="button" value="Cancel" onClick={()=>this.cancelEdit()} />
								<input type="button" value="Save" onClick={this.submitEdit} />
							</form>
						</div>
					)}
				</div>
			</div>
			</IconContext.Provider>
			)
		}
		
		return (
		<Fragment>
			{sidebar}
			<div className="comp-list-item" onClick={()=>this.setState({chosen: true})}>
				<div style={{width:"100%",margin:"5px"}}>{info.title}</div>
				<div style={{width:"100%",margin:"5px"}}>{info.username}</div>
				<div style={{width:"100%",margin:"5px"}}>{info.date}</div>
			</div>
		</Fragment>
		);
	}

    handleDelete(title, id) {
        console.log("BUTTON CLICKED");
        if(window.confirm("Are you sure you want to delete " + title + "?")){
            var payload = {
                id: id
            }
			console.log("RULES OF NATURE");
			console.log(id);
            console.log("TREVOR");
            console.log(payload);
            Axios.post("http://localhost:3001/deleterecordingadmin", {data: {id: id}});
            window.location.reload();
        }
    }


	
//  submitEdit = async (e) => {
// 	const {userId, info, formdata} = this.state;
// 	console.log("edit form data", info, formdata, userId);
// 	var description = formdata.description ?  formdata.description : "test descrip ";
// 	var title = formdata.title?  formdata.title : "test title ";
// 	var query = JSON.stringify({id:userId, recordingid: info.recordingId , newdescription: description, newtitle: title});

// 	console.log("query", query)
// 	try {
// 		 await Axios.post("http://localhost:3001/editrecording", {params: query}).then(r => {
// 			this.setState({list: r.data})
// 			window.location.reload();
// 	} )} catch (error) {
//   if (error.response) {
// 	console.log(error.response);
// 	}
// 	}

// 	return;
// 		//formdata.user = this.props.user;

// 		api.put("/compositions/edit/"+info._id, formdata)
// 		.then(() => {
// 			window.location.reload()
// 		}, rej => {
// 			const res = rej.response.data.msg;
// 			switch(res) {
// 				case "Title is too long.":
// 					var elem = document.getElementById("edit-title-err");
// 					elem.innerHTML = res+" Length: " + formdata.title.length;
// 					setTimeout(() => {
// 						elem.innerHTML = "";
// 					}, 5000);
// 					break;
// 				case "Description is too long.":
// 					var elem = document.getElementById("edit-desc-err");
// 					elem.innerHTML = res+" Length: " + formdata.description.length;
// 					setTimeout(() => {
// 						elem.innerHTML = "";
// 					}, 5000);
// 					break;
// 			}
// 		});
// 		e.preventDefault();
// 	}
	
	// cancelEdit() {
	// 	const {info} = this.props;
	// 	this.setState({
	// 		formdata: {
	// 			title: info.title,
	// 			description: info.description,
	// 			private: info.private
	// 		},
	// 		editing: false
	// 	})
	// }
	
	changeForm(e) {
		e.persist()
		this.setState(state => ({
			formdata: {
				...state.formdata,
				[e.target.name]: e.target.value
			}
		}))
	}
	
	setPrivate() {
		this.setState(state => {
			return {
				formdata: {
					...state.formdata,
					private: !state.formdata.private
				}
			}
		})
	}
	
	// deleteComp() {
	// 	if(!window.confirm("Are you sure you want to delete this composition?"))
	// 		return
			
	// 	api.delete("/delete"+this.state.info._id)
	// 	.then(res => {
	// 		this.props.update();
	// 	}, rej => {
	// 		console.log(rej.status)
	// 	})
	// }
}
export default connect(null, {setAlert})(CompListAdmin);