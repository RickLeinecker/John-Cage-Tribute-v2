import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import api from '../../utils/api';
import {setAlert} from "../../actions/alert"

class CompList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			list: props.list
		}
		console.log("-_-",  props.list);
	}
	
	componentDidUpdate(prevProps) {
		if(prevProps.list !== this.props.list) {
			this.setState({
				list: this.props.list
			})
		}
	}
		
	render() {
		var list; 
		console.log(this.state.list);
		if(this.state.list.length != 0) {
			list = this.state.list.map((item, i) => {
				// if the runtime is undefined, the composition failed and should not be shown
				return (<CompListItem 
					info={item}
					key={item._id}
					user={this.props.user}
				/>)
			})
		}
		else {
			list = (<p style={{margin:"5vh"}}>No Compositions</p>)
		}
		return (
		<div style={{textAlign:"center"}}>
			<div id="comp-list-header">
				<div style={{width:"30%",margin:"5px"}}>Title</div>
				<div style={{width:"30%",margin:"5px"}}>Tags</div>
				<div style={{width:"20%",margin:"5px"}}>Date</div>
				<div style={{width:"20%",margin:"5px"}}>Duration</div>
			</div>
			{list}
		</div>
		);
	}
}

class CompListItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			info: props.info,
			chosen: false,
			sidebarClass: "",
			editing: false,
			formdata: {
				title: props.info.title,
				// tags: props.info.tags.join(","),
				// description: props.info.description,
				// private: props.info.private
			}
		}
		// this.chosenState = this.chosenState.bind(this);
		// this.parseDateTime = this.parseDateTime.bind(this);
		this.deleteComp = this.deleteComp.bind(this);
		this.changeForm = this.changeForm.bind(this);
		this.submitEdit = this.submitEdit.bind(this);
		this.cancelEdit = this.cancelEdit.bind(this);
		this.setPrivate = this.setPrivate.bind(this);
	}
	
	render() {
		var {info, formdata} = this.state;
		// var tags = info.tags.join(", ");
		// var {date, runtime} = this.parseDateTime(info.date, info.runtime);
		
		var sidebar = null;
		if(this.state.chosen) {
			var c = "info-field-title";
			var c1 = "info-p";
			sidebar = (
			<div className="dark-overlay" style={{zIndex:"2", position:"fixed"}}>
				<div id="sidebar" className={this.state.sidebarClass}>
					<button onClick={this.chosenState} style={{padding:"5px"}}>Close</button>
					{!this.state.editing ? (
						<div style={{padding:"10px"}}>
							<h2 className="text-primary" id="info-title">Composition Information</h2>
							<br />
							<p className={c1}>
								<span className={c}>Title: </span>{info.title}
							</p>
							<p className={c1}>
								<span className={c}>Date: </span>{info.date}
							</p>
							<p className={c1}>
								<span className={c}>Composer: </span>{info.composer}
							</p>
							<p className={c1}>
								<span className={c}>Performers: </span>{info.performers.join(", ")}
							</p>
							<p className={c1}>
								<span className={c}>Description: </span>{info.description}
							</p><br />
							{this.props.user !== undefined ? (
							<div style={{padding:"5px 0px"}}>
								<button onClick={()=>this.setState({editing: true})}
									style={{padding:"0px 4px",marginRight:"5px"}}>Edit</button>
								<button onClick={this.deleteComp}
									style={{padding:"0px 4px"}}>Delete</button>
							</div>
							) : (null)}
							<audio controls className="audio-elem">
								<source src={"http://localhost:3001/recordings" 
								+ info._id} type={info.filetype} />
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
								<h4>Tags</h4>
								<p style={{color:"gray",fontSize:".8em"}}>Separated by commas</p>
								<input className="edit-info-field" name="tags" value={formdata.tags} onChange={this.changeForm}/>
								<p id="edit-tags-err" style={{color:"red"}}></p>
								<br />
								<h4>Description</h4>
								<p style={{color:"gray",fontSize:".8em"}}>Limit 256 characters</p>
								<textarea value={formdata.description} onChange={this.changeForm} name="description" className="edit-info-field"/>
								<p id="edit-desc-err" style={{color:"red"}}></p>
								<h4 style={{display:"inline-block"}}>Private</h4>
								<div style={{backgroundColor: formdata.private? "blue":"white"}} id="private-box" onClick={this.setPrivate}></div>
								<br /><br />
								<input type="button" value="Cancel" onClick={this.cancelEdit} />
								<input type="button" value="Save" onClick={this.submitEdit} />
							</form>
						</div>
					)}
				</div>
			</div>
			)
		}
		
		return (
		<Fragment>
			{sidebar}
			<div className="comp-list-item" onClick={this.chosenState}>
				<div style={{width:"30%",margin:"5px"}}>{info.title}</div>
				{/* <div style={{width:"30%",margin:"5px"}}>{tags}</div>
				<div style={{width:"20%",margin:"5px"}}>{date}</div> */}
				{/* <div style={{width:"20%",margin:"5px"}}>{runtime}</div> */}
			</div>
		</Fragment>
		);
	}
	
	submitEdit(e) {
		const {info, formdata} = this.state;
		if(typeof formdata.tags == "string")
			formdata.tags = formdata.tags.split(",");
		formdata.user = this.props.user;
		api.put("/compositions/edit/"+info._id, formdata)
		.then(() => {
			window.location.reload()
		}, rej => {
			const res = rej.response.data.msg;
			switch(res) {
				case "Title is too long.":
					var elem = document.getElementById("edit-title-err");
					elem.innerHTML = res+" Length: " + formdata.title.length;
					setTimeout(() => {
						elem.innerHTML = "";
					}, 5000);
					break;
				case "Description is too long.":
					var elem = document.getElementById("edit-desc-err");
					elem.innerHTML = res+" Length: " + formdata.description.length;
					setTimeout(() => {
						elem.innerHTML = "";
					}, 5000);
					break;
			}
		});
		e.preventDefault();
	}
	
	cancelEdit() {
		const {info} = this.props;
		this.setState({
			formdata: {
				title: info.title,
				tags: info.tags.join(","),
				description: info.description,
				private: info.private
			},
			editing: false
		})
	}
	
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
	
	deleteComp() {
		if(!window.confirm("Are you sure you want to delete this composition?"))
			return
			
		api.delete("/delete"+this.state.info._id)
		.then(res => {
			this.props.update();
		}, rej => {
			console.log(rej.status)
		})
	}
}

export default connect(null, {setAlert})(CompList);