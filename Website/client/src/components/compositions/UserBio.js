import React, {Fragment, useState, useEffect, Component} from "react";
import { Column, Row } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite';
import CompList from "../compositions/CompList";
import Axios from 'axios';
import jwt_decode from "jwt-decode";
import { Link, Redirect } from 'react-router-dom';
import { IconContext } from 'react-icons';
import * as AiIcons from 'react-icons/ai';
import setAuthToken from "../../utils/setAuthToken";

//This file is for viewing another user's profile
//For a user viewing their own profile, go to Profile.js

class UserBio extends React.Component {
    constructor(props) {
		super(props);
        const id = JSON.parse(localStorage.getItem("target"));
        console.log("ID: ");
        console.log(id);
		this.state = {
			username: "",
			userId: id,
            bio: "",
            isMaestro: -1,
            isMaestroWord: "",
            recordings: []
		}
	}

    componentDidMount() {
        Axios.get("http://localhost:3001/userinfo", {params: {id: this.state.userId}}).then(r => {
            this.setState({username: r.data[0].username});
            if(r.data[0].bio != null) {
                this.setState({bio: r.data[0].bio});
            }

            this.setState({isMaestro: r.data[0].isMaestro});
            if(this.state.isMaestro == 1) {
                this.setState({isMaestroWord: "Yes"});
            } else {
                this.setState({isMaestroWord: "No"});
            }
        })

        Axios.get("http://localhost:3001/userRec", {params: {id: this.state.userId}}).then(r => {
            this.setState({recordings: r.data});
            console.log("CONEY");
            console.log(this.state.recordings);
        })
    }

    render() {
        return(
            <div className="schedule">
                <div className="dark-overlay">
                    <div className="search-inner">
                        <div className="search-box">
                            <h1 className="large text-primary">{this.state.username}'s Profile: </h1>
                            <span>
                                <p className='profile-text'>Maestro Status: {this.state.isMaestroWord}</p>
                            </span>
                            <span>
                                <p className='profile-text'>Bio: {this.state.bio}</p>
                            </span>
                            <br />
                            <h1 className="medium">Recordings:</h1>
                            <div style={{padding:"10px"}}>
                                <CompList list={this.state.recordings} dash={false} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UserBio;