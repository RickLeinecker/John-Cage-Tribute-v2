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

class Profile extends React.Component {
    constructor(props) {
		super(props);
		console.log("PROPS", props.username);
		this.state = {
			username: "",
			userId: props.id,
			email: "",
            bio: "",
            isMaestro: -1,
			editing: false,
			// formdata: {
			// 	title: props.info.title,
			// 	length: props.info.lengthSeconds,
			// 	date: props.info.recordingDate
			// 	// tags: props.info.tags.join(","),
			// 	// description: props.info.description,
			// 	// private: props.info.private
			// }
		}
		//this.chosenState = this.chosenState.bind(this);
		// this.parseDateTime = this.parseDateTime.bind(this);
		// this.deleteComp = this.deleteComp.bind(this);
		// this.changeForm = this.changeForm.bind(this);
		// this.submitEdit = this.submitEdit.bind(this);
		// this.cancelEdit = this.cancelEdit.bind(this);
		// this.setPrivate = this.setPrivate.bind(this);
	}

    componentDidMount() {
		console.log("API");
		// Axios.get("http://localhost:3001/users").then(r => {
		// 	this.setState({list: r.data});
		// })
        Axios.get("http://localhost:3001/userinfo", {params: {id: 1}}).then(r => {
            console.log("r: " + r);
            this.setState({username: r.username});
            this.setState({userId: r.id});
            this.setState({email: r.email});
            this.setState({bio: r.bio});
            this.setState({isMaestro: r.isMaestro});
            console.log("username: " + this.state.username);
        })
	}

    setEditing(v) {
        this.setState({editing: v});
        console.log("Editing? " + this.state.editing);
    }

    render() {
        // return (
        //     <div className='schedule'>
        //         <div className='dark-overlay'>
        //             <div className='search-inner'>
        //                 <div className='search-box'>
        //                     <h1 className='large text-primary'>Profile {this.state.username}</h1>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // )

        return (
            <div className='schedule'>
                <div className='dark-overlay'>
                    <div className='search-inner'>
                        <div className='search-box'>
                            <h1 className='large text-primary'>Profile</h1>
                            <span>
                                <p className='landing-text'>Username: {this.state.username}</p>
                            </span>
                            <span>
                                <p className='landing-text'>Email: {this.state.email}</p>
                            </span>
                            <span>
                                <p className='landing-text'>Maestro Status: {this.state.isMaestro}</p>
                            </span>
                            <span>
                                <p className='landing-text'>Bio: {this.state.bio}</p>
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

// const Profile = () => {
//     // const [userId, setId] = useState(0);
//     // const [userName, setuserName] = useState('');
//     // const [email, setemail] = useState('');
//     // const [isMaestro, setisMaestro] = useState(0);
//     // const [bio, setbio] = useState('');
//     // const [token, setToken] = useState('');
//     // const [expire, setExpire] = useState('');

//     // const [editing, setediting] = useState(false);

//     useEffect(() =>
//     {
//         refreshToken();
//     },[]);

//     const refreshToken = async () => {
//         try {
//             const response = await axios.get('http://localhost:3001/token');
//             setToken(response.data.accessToken);
//             const decoded = jwt_decode(response.data.accessToken);
//             console.log("decoded id", decoded.userId);
//             setId(decoded.userId);
//             setuserName(decoded.username);
//             setemail(decoded.email);
//             setisMaestro(decoded.isMaestro);
//             setbio(decoded.bio);
//             console.log("username after decoded", userName);
//             console.log("userid after decoded", userId);
//             setExpire(decoded.exp);
//             console.log("heres token", decoded);
//             console.log("HERE: " + isMaestro);
//             setAuthToken(decoded);
//         } catch (error) {
//             if (error.response) {
//                // history.push("/");
//                console.log("auth fail");
//             }
//         }
//     }

//     const axiosJWT = axios.create();

//     axiosJWT.interceptors.request.use(async (config) => {
//         const currentDate = new Date();
//         if (expire * 1000 < currentDate.getTime()) {
//             const response = await axios.get('http://localhost:3001/token');
//             config.headers.Authorization = `Bearer ${response.data.accessToken}`;
//             setToken(response.data.accessToken);
//             const decoded = jwt_decode(response.data.accessToken);
//             setuserName(decoded.username);
//             setExpire(decoded.exp);

//             // getRecordings(decoded.userId);
//             // getEvents(decoded.userId);
//             console.log("username after decoded", userName);
//             console.log("userid after decoded", userId);
//             console.log("isMaestro: " + isMaestro);
//         }
//         return config;
//     }, (error) => {
//         return Promise.reject(error);
//     });

//     return (
//         <div className='schedule'>
//             <div className='dark-overlay'>
//                 <div className='search-inner'>
//                     <div className='search-box'>
//                         <h1 className='large text-primary'>Profile</h1>
//                         <span>
//                             <p className='landing-text'>Username: {userName}</p>
//                         </span>
//                         <span>
//                             <p className='landing-text'>Email: {email}</p>
//                         </span>
//                         <span>
//                             <p className='landing-text'>Maestro Status: {isMaestro}</p>
//                         </span>
//                         <span>
//                             <p className='landing-text'>Bio: {bio}</p>
//                         </span>
//                         <span style={{align: "center"}}>
//                             <button className='btn btn-primary' onClick={setediting(true)}>Edit</button>
//                         </span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

export default Profile;