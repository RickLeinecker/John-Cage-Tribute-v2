import React, {Fragment, useState, useEffect} from "react";
import io from 'socket.io-client';
import { connect } from 'react-redux';
import {setAlert} from "../../actions/alert"

//room requirements
//=================
//-guest or user can join rooms to listen
//-requires pin
  

class Rooms extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			socket: io(),
			roomsList: []
		};
		this.refresh = this.refresh.bind(this);
		this.serverSocket = io();
	}
	
	componentDidMount() {
		// Socket code
		const socket = this.state.socket;

		socket.on("connect", _ => {
			console.log("I'm connected!");
		})
		socket.on('event', (data) => console.log(data));
		socket.on('error', (err) => console.log(err));
		socket.on('timeout', (time) => console.log(time));
		socket.on('fromServer', (_) => console.log(_));

		socket.on("updaterooms", rooms => {
			var pn = Object.getOwnPropertyNames(rooms);
			this.setState({roomsList: pn.map(name => rooms[name])})
		});
		socket.on("roomerror", res => {
			switch(res) {
				case "This room does not exist.":
					var elem = document.getElementById("room-err")
					if(!elem) {
						this.props.setAlert(res+" The room may have been closed after you refreshed", "danger")
						break;
					}
					elem.innerHTML = res+" The room may have been closed after you refreshed";
					break;
				case "This room's max listener capacity was reached. Please exit.":
					var elem = document.getElementById("room-err")
					if(!elem) {
						this.props.setAlert("This room's max listener capacity was reached.", "danger")
						break;
					}
					elem.innerHTML = res;
					break;
				case "The host has disconnected. Please exit the room.":
					this.props.setAlert("Host has disconnected","danger");
					break;
			}
		})
		socket.on("audiostop", res => {
			this.props.setAlert("Audio session has completed", "success");
		})
		
		// Audio Listener code (plus some socket)
		var audioContext = new window.AudioContext();
		var buffer = audioContext.createBuffer(1, 1024, 22050);
		socket.on("playaudio", audioData => {
			var bufferData = buffer.getChannelData(0);
			
			for(var i=0; i < audioData.length; i++)
				bufferData[i] = audioData[i];
				
			var source = audioContext.createBufferSource();
			source.buffer = buffer;
			source.connect(audioContext.destination);
			source.start();
		})
	}
	
	componentWillUnmount() {
		const socket = this.state.socket;
		socket.emit("disconnect");
		socket.close();
	}
	
	render() {
		return (
		<div>
			<h1 className="large text-primary">Rooms</h1>
			<button onClick={this.refresh} style={{marginBottom:"5px"}}>Refresh</button>
			<div id="rooms-container">
				{this.state.roomsList.length != 0 ? 
					this.state.roomsList.map(r => {
						// if room is already full for listeners, don't render
						if(r.currentListeners < r.maxListeners)
							return (<RoomItem 
								room={r} 
								socket={this.state.socket} 
								user={this.props.auth.user}
								key={r.id}
							/>)
						else return null; 
					}) : (<p>No active rooms. Refresh to search again</p>)
				}
			</div>
		</div>
		)
	}
	
	refresh() {
		console.log("WHAT?????");
		
		this.serverSocket.on("connect", _ => {
			console.log("I'm connected!");
		})
		this.serverSocket.on('event', (data) => console.log(data));
		this.serverSocket.on('error', (err) => console.log(err));
		this.serverSocket.on('timeout', (time) => console.log(time));
		this.serverSocket.on('fromServer', (_) => console.log(_));
	}
}

const mapStateToProps = (state) => ({
	auth: state.auth
});

export default connect(mapStateToProps, {setAlert})(Rooms);

class RoomItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			chosen: false,
			locked: props.room.pin == null ? false : true,
			members: [],
			isActive: true,
			sessionStarted: false,
			pin: ""
		}
		this.exitRoom = this.exitRoom = this.exitRoom.bind(this);
		this.chooseRoom = this.chooseRoom.bind(this);
		this.verifyPin = this.verifyPin.bind(this)
		this.mute = this.mute.bind(this)
	}
	
	componentDidMount() {
		const {room, socket, user} = this.props;
		socket.on("updatemembers", ({members, sessionStarted}) => {
			var lst = Object.getOwnPropertyNames(members)
				.map(name => members[name]);
			this.setState({
				members:lst,
				sessionStarted: sessionStarted,
				chosen: true
			});
		})
		socket.on("pinsuccess", () => {
			socket.emit("joinroom", {
				roomId: room.id,
				member: {
		            socket: socket.id,
                    isActive: true,
					isGuest: !user,
					isHost: false,
					name: !!user ? user.name : "(Guest)",
					role: 0 // Hardcoded as LISTENER
                }
			})
			this.setState({locked:false})
		})
		socket.on("pinerror", res => {
			document.getElementById("room-err").innerHTML = res;
		})
		socket.on("audiostart", () => {
			this.setState({sessionStarted: true})
			
		})
		socket.on("roomerror", res => {
			if(res == "The host has disconnected. Please exit the room.") {
				this.setState({chosen: false});
			}
		})
	}
	
	exitRoom() {
		const {room, socket} = this.props;
		const {locked} = this.state;
		if(!locked) {
			if(!window.confirm("Are you sure you want to leave the room?")) {
				return;
			}
			this.setState({
				locked: room.pin == null ? false : true,
				chosen: false
			});
			socket.emit("leaveroom", room.id);
		}
	}
	
	chooseRoom() {		
		const {room, socket, user} = this.props;
		if(room.pin != null) {
			this.setState({chosen: true});
			return;
		}
   
		socket.emit("joinroom", {
			roomId: room.id,
			member: {
        socket: socket.id,
        isActive: true,
				isGuest: !user,
				isHost: false,
				name: !!user ? user.name : "(Guest)",
				role: 0 // Hardcoded as LISTENER
      }
		})
	}
	
	verifyPin(e) {
		const {room, socket} = this.props
		var enteredPin = document.getElementById("pin-input").value;
		socket.emit("verifypin", {roomId: room.id, enteredPin})
		e.preventDefault();
	}
	
	mute() {
		const {room, socket} = this.props;
		const {isActive} = this.state;
		socket.emit("muteordeafen", {roomId: room.id, isActive});
		this.setState(state => ({isActive: !state.isActive}));
	}
	
	render() {
		const {locked, chosen, members, isActive, sessionStarted} = this.state;
		const {room} = this.props;
		const modal = chosen ? (
			<div className="dark-overlay centered" style={{zIndex:"2", position:"fixed"}}>
				<div id="room-modal">
					<button onClick={this.exitRoom}>Close</button>
					{locked ? (
					<form style={{textAlign: "center"}} onSubmit={this.verifyPin} >
						<p>Enter pin: </p>
						<input 
							id="pin-input" 
							onChange={(e)=>this.setState({pin:e.target.value})} 
							value={this.state.pin} 
						/>
						<input type="submit" />
						<p id="room-err" style={{color:"red",fontSize:".9em"}}></p>
					</form>
					) : (
					<div style={{textAlign:"center"}}>
						<h3>Host: {room.host}</h3>
						<p>Status: {sessionStarted ? "Listening":"Waiting"}</p>
						{sessionStarted ? 
							<button onClick={this.mute}>{isActive ? "Mute": "Unmute"}</button>
							: null
						}
						<div style={{display:"flex",justifyContent:"center"}}>
							<div className="member-list">
								<p><strong>Performers</strong></p>
								<hr />
								{members.filter(m => m.role==1)		
									.map(m => (<p key={m.name}>{m.name}</p>))}
							</div>
							<div className="member-list">
								<p><strong>Listeners</strong></p>
								<hr />
								{members.filter(m => m.role==0)
									.map(m => (<p key={m.name}>{m.name}</p>))}
							</div>
						</div>
						
					</div>
					)}
				</div>
			</div>
		) : (null);
		
		
		return (
		<Fragment>
			{modal}
			<div className="room-item" onClick={this.chooseRoom}>
				<p>Host: {room.host}</p>
				<p>Performers: {room.currentPerformers} / {room.maxPerformers}</p>
				<p>Listeners: {room.currentListeners} / {room.maxListeners}</p>
			</div>
		</Fragment>
		)
	}
}