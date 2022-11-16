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

//This file is for a user viewing their own profile
//For a user viewing another user's profile, go to UserBio.js

class Profile extends React.Component {
    constructor(props) {
		super(props);
        const id = JSON.parse(localStorage.getItem("token")).userId;
		this.state = {
			username: "",
			userId: id,
			email: "",
            bio: "",
            isMaestro: -1,
            isMaestroWord: "",
			editing: false,
            editName: "",
            editBio: "",
		}
        this.changeUsername = this.changeUsername.bind(this);
        this.changeBio = this.changeBio.bind(this);
        this.submitEdit = this.submitEdit.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
	}

    componentDidMount() {
        Axios.get("http://localhost:3001/userinfo", {params: {id: this.state.userId}}).then(r => {
            //console.log(r);
            this.setState({username: r.data[0].username});
            // this.setState({userId: r.data[0].id});
            this.setState({email: r.data[0].email});
            if(r.data[0].bio !== null) {
                this.setState({bio: r.data[0].bio});
            }
            this.setState({isMaestro: r.data[0].isMaestro});
            console.log("username: " + this.state.username);

            this.setState({editName: this.state.username});
            this.setState({editBio: this.state.bio});

            if(this.state.isMaestro == 1) {
                this.setState({isMaestroWord: "Yes"});
            } else {
                this.setState({isMaestroWord: "No"});
            }
        })
	}

    changeUsername(e) {
		this.setState({editName: e.target.value});
        console.log("editname: " + this.state.editName);
	}

    changeBio(e) {
        this.setState({editBio: e.target.value});
        console.log(this.state.editBio);
    }

    submitEdit(e) {
        e.preventDefault();
        // Axios.post("http://localhost:3001/editbio", {}, {params: {id: this.state.userId}}, {
        //     bio: this.state.editBio
        // })
        console.log("new name: " + this.state.editName);
        console.log("new bio: " + this.state.editBio);
        console.log("id "+this.state.userId);

        var payload = {
            id: this.state.userId,
            newbio: this.state.editBio,
        };

        Axios.post("http://localhost:3001/editbio", payload);

        var payloadtwo = {
            id: this.state.userId,
            newusername: this.state.editName,
        }

        console.log(payloadtwo);

        Axios.post("http://localhost:3001/editusername", payloadtwo);
        
        this.setState({editing: false});

        window.location.reload();
    }

    cancelEdit(e) {
        this.setState({editName: this.state.username});
        this.setState({editBio: this.state.bio});
        this.setState({editing: false});
    }

    render() {
        if(this.state.editing) {
            return(
                <div className='schedule'>
                    <div className='dark-overlay'>
                        <div className='search-inner'>
                            <div className='search-box'>
                                <h1 className='large text-primary'>Edit Profile</h1>
                                <br />
                                <Fragment>
                                    <form onSubmit={this.submitEdit}>
                                        <h1 className='medium'>Username:</h1>
                                        <input className='edit-info-field' value={this.state.editName} onChange={this.changeUsername} />
                                        <br />
                                        <h1 className='medium'>Bio:</h1>
                                        <input className='edit-info-field' value={this.state.editBio} onChange={this.changeBio} />
                                        <button type='submit' className='btn btn-primary'>Submit</button>
                                        <button className='btn btn-primary' onClick={this.cancelEdit}>Cancel</button>
                                    </form>
                                </Fragment>
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
                                <h1 className='large text-primary'>Profile</h1>
                                <span>
                                    <p className='profile-text'>Username: {this.state.username}</p>
                                </span>
                                <span>
                                    <p className='profile-text'>Email: {this.state.email}</p>
                                </span>
                                <span>
                                    <p className='profile-text'>Maestro Status: {this.state.isMaestro}</p>
                                </span>
                                <span>
                                    <p className='profile-text'>Bio: {this.state.bio}</p>
                                </span>
                                <span style={{align: "center"}}>
                                    <button className='btn btn-primary' onClick={() => this.setState({editing: true})}>Edit</button>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        
    }
}

export default Profile;