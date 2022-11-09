import React, { Fragment, useEffect } from 'react';
import Socket from "socket.io-client";

// Websocket for live server
const socket = Socket.connect("https://johncagetribute.org/");

socket.on('connect', () => {
  console.log("Websocket is working!!");
});

socket.on('err', (err) => console.log(err));
socket.on('timeout', (time) => console.log(time));
socket.on("connect_error", (err) => {
    console.log(err);
  });

class Listen extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
			userId: props.userId,
            tempPasscode: "1234",
            //What the user types into the input field
            passcodeQuery: "",
            approved: false
		};
        this.queryChange = this.queryChange.bind(this);
        this.comparePasscodes = this.comparePasscodes.bind(this);
	}

    render() {
        if(this.state.approved) {
            return (
                <div className='schedule'>
                    <div className='dark-overlay'>
                        <div className='search-inner'>
                            <div className='search-box'>
                                <h1 className='large text-primary'>Listen to a Live Concert</h1>
                                <br />
                                <p className='large'>
                                    You're in! When the concert starts, it will play automatically!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className='schedule'>
                    <div className='dark-overlay'>
                        <div className='search-inner'>
                            <div className='search-box'>
                                <h1 className='large text-primary'>Listen to a Live Concert</h1>
                                <br />
                                <Fragment>
                                    <form style={{textAlign: "center"}} onSubmit={this.comparePasscodes}>
                                        <h1 className='large'>Please Enter Passcode:</h1>
                                        <p className='listen-text'>
                                            Input the passcode the Maestro sent you to listen to their performance live!
                                        </p>
                                        <input type='text' id='passcode' placeholder='Passcode' value={this.state.passcodeQuery}  onChange={this.queryChange} />
                                        <input type='submit' classname='btn btn-search' value='Submit' onSubmit={this.comparePasscodes} />
                                        <span id = "message" style={{color: "red"}}> </span>
                                    </form>
                                </Fragment>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        // return(
        //     <div className='schedule'>
        //         <div className='dark-overlay'>
        //             <div className='search-inner'>
        //                 <div className='search-box'>
        //                     {this.state.approved ? () : (
        //                     <h1 className='large text-primary'>Listen to a Live Concert</h1>
        //                     <br />
        //                     <Fragment>
        //                         <form style={{textAlign: "center"}} onSubmit={this.comparePasscodes}>
        //                             <h1 className='large'>Please Enter Passcode:</h1>
        //                             <input type='text' id='passcode' placeholder='Passcode' value={this.state.passcodeQuery}  onChange={this.queryChange} />
        //                             <input type='submit' classname='btn btn-search' value='Submit' onSubmit={this.comparePasscodes} />
        //                             <span id = "message" style={{color: "red"}}> </span>
        //                         </form>
        //                     </Fragment>
        //                     )}
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // )
    }

    queryChange(e) {
        this.setState({passcodeQuery: e.target.value});
        console.log("passcodeQuery: " + this.state.passcodeQuery);
    }

    comparePasscodes(e) {
        e.preventDefault();
        var query = this.state.passcodeQuery;
        //ADD API CALL HERE
        socket.emit("woomy");

        if(query == this.state.tempPasscode) {
            console.log("PASSCODE IS CORRECT");
            this.setState({approved: true});
        } else {
            console.log("SOMETHING WENT WRONG");
            document.getElementById("message").innerHTML = "There is no concert with that passcode...";
        }
    }
}

export default Listen;