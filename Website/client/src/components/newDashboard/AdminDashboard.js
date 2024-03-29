import React, {Fragment, useState, useEffect} from "react";
import { Column, Row } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite';
import ConcertCardComponent from "./ConcertCard";
import ScheduleCardComponent from "./ScheduleCard";
import CompList from "../compositions/CompList";
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { Link, Redirect } from 'react-router-dom';
import InviteCardComponent from "./InviteCard";
import EventDetailsSidebarComponent from "./EventDetailsSidebar";

const styles = StyleSheet.create({
    container: {
        height: '50vh'
        
    },
    content: {
        marginTop: 54
    },
    title: {
        color: '#FFFFF',
        fontFamily: 'Muli',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 26,
        lineHeight: '26px',
        letterSpacing: '0.4px',
        marginBottom: 20,
        minWidth: 102,
        textAlign: 'center'
    },
    mainBlock: {
        backgroundColor: '#F7F8FC',
        padding: 10
    },
    cardsContainer: {
        marginRight: 0,
        marginTop: -30
    },
    cardRow: {
        marginTop: 50,
        marginBottom: 50,
        '@media (max-width: 768px)': {
            marginTop: 0
        }
    },
    miniCardContainer: {
        flexGrow: 1,
        marginRight: 20,
        '@media (max-width: 768px)': {
            marginTop: 10,
            maxWidth: 'none'
        }
    },
});
// loop to display the concert card components
//add the scheduling button component
//my recordings title
//recordings component

const AdminDashboard = () => {
    // get userId from token, useEffect, then call API from index.js that passes userId to get list of user's recordings
    
    const[events, setEvents] = useState([]);
    const[recordings, setRecordings] = useState([]);

    const [userId, setId] = useState(0);
    const [userName, setuserName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState([]);
    const testData = [
        {
          group: 'testgroup',
          date: 'OCT 1',
        },
        {
            group: 'testgroup',
            date: 'OCT 1',
          }];


    const testRecording = [
        {
            title: 'hello testing',
			lengthSeconds: '22',
			recordingDate: '02/06/1999'
        },
        {
            title: 'hello testing',
			lengthSeconds: '22',
			recordingDate: '02/06/1999'
        },
        {
            title: 'hello testing',
			lengthSeconds: '22',
			recordingDate: '02/06/1999'
        },
        {
            title: 'hello testing',
			lengthSeconds: '22',
			recordingDate: '02/06/1999'
        },
        {
            title: 'hello testing',
			lengthSeconds: '22',
			recordingDate: '02/06/1999'
        },
        {
            title: 'hello testing',
			lengthSeconds: '22',
			recordingDate: '02/06/1999'
        },
        {
            title: 'hello testing',
			lengthSeconds: '22',
			recordingDate: '02/06/1999'
        },
        {
            title: 'hello testing',
			lengthSeconds: '22',
			recordingDate: '02/06/1999'
        },
        {
            title: 'hello testing',
			lengthSeconds: '22',
			recordingDate: '02/06/1999'
        }, {
            title: 'hello testing',
			lengthSeconds: '22',
			recordingDate: '02/06/1999'
        },
        {
            title: 'hello testing',
			lengthSeconds: '22',
			recordingDate: '02/06/1999'
        },
        {
            title: 'hello testing',
			lengthSeconds: '22',
			recordingDate: '02/06/1999'
        }
    ]
    useEffect(() =>
    {
        refreshToken();
    },[]);
  
    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:3001/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            console.log("decoded id", decoded.userId);
            setId(decoded.userId);
            setuserName(decoded.username);
            console.log("username after decoded", userName);
            console.log("userid after decoded", userId);
            setExpire(decoded.exp);
            console.log("heres token", decoded);

            getRecordings(decoded.userId);
            getEvents(decoded.userId);
        } catch (error) {
            if (error.response) {
               // history.push("/");
               console.log("auth fail");
            }
        }
    }
  
    const axiosJWT = axios.create();
 
    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:3001/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setuserName(decoded.username);
            setExpire(decoded.exp);

            getRecordings(decoded.userId);
            getEvents(decoded.userId);
            console.log("username after decoded", userName);
            console.log("userid after decoded", userId);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });
  
  const getRecordings = async (id)=>{
    // return testData;
    console.log("id is", id);
    await axios.get("http://localhost:3001/userRec", {params: {id: id}}).then(r => {
        setRecordings(r.data);
        console.log("recordings call", r);	
		})
   }

   const getEvents = async (id)=>{
    // return testData;
    console.log("id is", id);
    await axios.get("http://localhost:3001/userScheduled", {params: {id: id}}).then(r => {
        setEvents(r.data);
        console.log("events call", r);	
		})
   }

   var evd;
   const handleClick= (event) => {
    setSelectedEvent(event);
    evd = selectedEvent != null ? <div>HELLO HI TESt</div> : <div>WHYY</div>;
    console.log( selectedEvent, evd, 'Push the concert details page for this concert 2');
   }

    if(selectedEvent.length < 1) {
        return (
            <Fragment>
                <div className='schedule'>
                    <div className='search-inner'>
                        <div className='search-box'>
                            <h1 className='large text-primary'>Welcome Back: {userName}</h1>
                            <Link to='/allusers' className='btn btn-primary'>Delete Users</Link>
                            <Link to='/allrecordings' className="btn btn-primary">Delete Recordings</Link>
                            <Link to='/maestrorequests' className='btn btn-primary'>Maestro Requests</Link>
                            <div className={css(styles.content)}>
                                <span className={css(styles.title)}>{"Upcoming Concerts"}</span>
                                <Row className={css(styles.cardsContainer)} wrap flexGrow={1} horizontal="space-between" breakpoints={{ 600: 'column' }}>
                                    <Row className={css(styles.cardRow)} wrap flexGrow={0} horizontal="space-between" breakpoints={{ 300: 'column' }}>
                                        {events.map((event, index) => (
                                            // {decideRole(event.maestroId)}
                                            <div onClick={() => handleClick (event)}> 
                                                <ConcertCardComponent className={css(styles.miniCardContainer)} group = {event.title} date= {event.date} />
                                            </div>
                                        ))}
                                        <ScheduleCardComponent  className={css(styles.miniCardContainer)} />
                                        <InviteCardComponent className={css(styles.miniCardContainer)}/>
                                    </Row>
                                </Row>
                                <span className={css(styles.title)}>{"My Recordings"}</span>
                            </div>
                            <div style={{padding:"10px"}}>
                                <CompList list={recordings} userId = {userId} dash={false} />
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    } else {
        return (
            <Fragment>
                    <EventDetailsSidebarComponent event = {selectedEvent} clickHandler ={() => handleClick ([])}></EventDetailsSidebarComponent>
                    <div className='schedule'> 
                        <div className='search-inner'>
                            <div className='search-box'>
                                <h1 className='large text-primary'>Welcome Back: {userName}</h1>
                                <button className="btn btn-primary" onClick={handleDeleteUser}>Delete User</button>
                                <button className="btn btn-primary" onClick={handleDeleteRecording}>Delete Recording</button>
                                <Link to='/maestrorequests' className='btn btn-primary'>Maestro Requests</Link>
                                <div className={css(styles.content)}>
                                    <span className={css(styles.title)}>{"Upcoming Concerts"}</span>
            
                                    <Row className={css(styles.cardsContainer)} wrap flexGrow={1} horizontal="space-between" breakpoints={{ 600: 'column' }}>
                                        <Row className={css(styles.cardRow)} wrap flexGrow={0} horizontal="space-between" breakpoints={{ 300: 'column' }}>
                                            {events.map((event, index) => (
                                                <div onClick={() => handleClick (event)} > 
                                                    <ConcertCardComponent className={css(styles.miniCardContainer)} group = {event.title} date= {event.date} />
                                                </div>
                                            ))}
                                            <ScheduleCardComponent  className={css(styles.miniCardContainer)} />
                                            <InviteCardComponent className={css(styles.miniCardContainer)}/>
                                        </Row>
                                    </Row>
                                    <span className={css(styles.title)}>{"My Recordings"}</span>
                                </div>
                                <div style={{padding:"10px"}}>
                                    <CompList list={recordings} userId = {userId} dash={false} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
        );
    }

    //Allows admin to select a user to delete
    function handleDeleteUser() {
        let target = prompt("Please enter the userID of the user you wish to delete:");
        //If the admin did not input any userID
        if(target == null || target == "") {
            console.log("Admin did not input a userID");
        }
        //If the admin did input a userID
        else {
            console.log("Admin wants to delete user " + target);
            //Confirm you want to delete this user
            if(window.confirm("Are you sure you want to delete user " + target + "?")) {
                //ADD DELETE USER FUNCTIONALITY HERE
                console.log("Admin confirmed deleting user " + target);
            } else {
                console.log("Admin cancelled delete on user " + target);
            }
        }
    }

    //Allows admin to select a recording to delete
    function handleDeleteRecording() {
        let target = prompt("Please enter the recordingID of the recording you wish to delete:");
        //If the admin did not input any recordingID
        if(target == null || target == "") {
            console.log("Admin did not input a recordingID");
        }
        //If the admin did input a recordingID
        else {
            console.log("Admin wants to delete recording " + target);
            //Confirm you want to delete this recording
            if(window.confirm("Are you sure you want to delete recording " + target + "?")) {
                //ADD DELETE RECORDING FUNCTIONALITY HERE
                console.log("Admin confirmed deleting recording " + target);
            } else {
                console.log("Admin cancelled delete on recording " + target);
            }
        }
    }
};

export default AdminDashboard;