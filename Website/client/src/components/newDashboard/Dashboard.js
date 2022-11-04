import React, {Fragment, useState, useEffect} from "react";
import { Column, Row } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite';
import ConcertCardComponent from "./ConcertCard";
import ScheduleCardComponent from "./ScheduleCard";
import CompList from "../compositions/CompList";
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { Link, Redirect } from 'react-router-dom';

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

const Dashboard = () => {
    // get userId from token, useEffect, then call API from index.js that passes userId to get list of user's recordings
    
    const[events, setEvents] = useState([]);
    const[recordings, setRecordings] = useState([]);

    const [userId, setId] = useState(0);
    const [userName, setuserName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [users, setUsers] = useState([]);
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

   function requestMaestro() {
    console.log("User wants to be Maestro");
    //ADD API CONNECTION HERE
   }

    return (
        <div className='schedule'>
            <div className='search-inner'>
				<div className='search-box'>
                    {/* TEMPORARY REMOVE LATER */}
                    <Link to="/admindashboard" className='btn btn-primary'>TEMP LINK TO ADMIN DASH</Link>

                    <h1>Welcome Back: {userName}</h1>
                    <br />
                    <p className="dash">Want to schedule your own concert?</p>
                    <button  onclick={requestMaestro()} className="btn btn-primary">Become a Maestro!</button>
                    <div className={css(styles.content)}>
                        <span className={css(styles.title)}>{"Upcoming Concerts"}</span>

                        <Row className={css(styles.cardsContainer)} wrap flexGrow={1} horizontal="space-between" breakpoints={{ 600: 'column' }}>
                            <Row className={css(styles.cardRow)} wrap flexGrow={0} horizontal="space-between" breakpoints={{ 300: 'column' }}>
                    
                            {events.map((event, index) => (
                                <ConcertCardComponent className={css(styles.miniCardContainer)} group = {"Maestro: " + event.maestroId} date= {event.date} />
                            ))}
                            <ScheduleCardComponent  className={css(styles.miniCardContainer)} />
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
    );
};

export default Dashboard;