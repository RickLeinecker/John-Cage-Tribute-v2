import React, {Fragment, useState, useEffect, Component} from "react";
import { Column, Row } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite';
import ConcertCardComponent from "./ConcertCard";
import ScheduleCardComponent from "./ScheduleCard";
import EventDetailsSidebarComponent from "./EventDetailsSidebar";
import CompList from "../compositions/CompList";
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { Link, Redirect, useHistory } from 'react-router-dom';
import { IconContext } from 'react-icons';
import * as AiIcons from 'react-icons/ai';
import setAuthToken from "../../utils/setAuthToken";
import InviteCardComponent from "./InviteCard";

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
    const[maestroName, setMaestroName] = useState([]);
    const history = useHistory();

    const [userId, setId] = useState(0);
    const [userName, setuserName] = useState('');
    const [isMaestro, setIsMaestro] = useState(-1);
    const [isRequested, setIsRequested] = useState(-1);
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
        }
    ];

    
    // axios.get("http://localhost:3001/userinfo", {params: {id: userId}}).then(r => {
    //     // isMaestro = r.data[0].isMaestro;
    //     console.log("LOOKY "+r.data[0].isMaestro);
    // })


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
            console.log("decoded id", typeof(decoded.userId));
            setId(decoded.userId);
            setuserName(decoded.username);
            console.log("username after decoded", userName);
            console.log("userid after decoded", userId);
            setExpire(decoded.exp);
            console.log("heres token", decoded);
            setAuthToken(decoded);

            // const history = useHistory();
            if(decoded.userId == 0) {
                history.push('/admindashboard');
                return;
            }

            getRecordings(decoded.userId);
            getIsMaestro(decoded.userId);
            getEvents(decoded.userId);
            getIsRequested(decoded.userId);
            // getRoles();
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
        console.log("BEFORE" + userId);
        setId(id);
        console.log("AFTER" + userId);
        console.log("recordings call", r, id);	
		})
   }

    const getIsMaestro = async (id)=>{
        await axios.get("http://localhost:3001/userinfo", {params: {id: id}}).then(r => {
            console.log(typeof(r.data[0].isMaestro));
            console.log(r.data[0].isMaestro);
            setIsMaestro(r.data[0].isMaestro);
            // console.log("SOLUTION?: " + isMaestro);
        })
   }

    const getIsRequested = async (id)=>{
        await axios.get("http://localhost:3001/userinfo", {params: {id: id}}).then(r => {
            setIsRequested(r.data[0].isRequested);
        })
    }

   const getEvents = async (id)=>{
    // return testData;
        console.log("id is", id);
        await axios.get("http://localhost:3001/userScheduled", {params: {id: id}}).then(r => {
        setEvents(r.data);
        console.log("events call", r);
        getUsernames(id, r.data);
	})
    // getUsernames();
   }
   
//    const getUsernames = async (id) => {
    function getUsernames(id, data) {
        console.log("HERE WE ARE");
        var maestroName = "";
        var user1Name = "";
        var user2Name = "";
        var user3Name = "";
        //console.log(id);

        // axios.get("http://localhost:3001/username", {params: {id: id}}).then(r => {
        //     maestroName = r.data[0].username;
        //     console.log("WOAH NELLY");
        //     console.log(maestroName);
        // })
        
        events.map((item, index) => {
            //getting maestro name
            console.log("IN THE MAP");
            axios.get("http://localhost:3001/username", {params: {id: item.maestroId}}).then(r => {
                // maestroName = r.data[0].username;
                events[index]["maestroName"] = r.data[0].username;
                console.log("WOAH NELLY " + events[index]["maestroName"]);
            })

            //getting user1 name
            if(item.userOne > 0) {
                axios.get("http://localhost:3001/username", {params: {id: item.userOne}}).then(r => {
                    //user1Name = r.data[0].username;
                    //console.log("TAKE 2 " + user1Name);
                    events[index]["userOneName"] = r.data[0].username;
                })
            } else {
                events[index]["userOneName"] = "";
            }

            //getting user2 name
            if(item.userTwo > 0) {
                axios.get("http://localhost:3001/username", {params: {id: item.userTwo}}).then(r => {
                    // user2Name = r.data[0].username;
                    // console.log("TAKE 3 " + user2Name);
                    events[index]["userTwoName"] = r.data[0].username;
                })
            } else {
                events[index]["userTwoName"] = "";
            }

            //getting user3 name
            if(item.userThree > 0) {
                axios.get("http://localhost:3001/username", {params: {id: item.userThree}}).then(r => {
                    // user3Name = r.data[0].username;
                    // console.log("TAKE 4 " + user3Name);
                    events[index]["userThreeName"] = r.data[0].username;
                })
            } else {
                events[index]["userThreeName"] = "";
            }

            // events[index]["maestroName"] = maestroName;
        })
        console.log("afterwards:");
        console.log(events);
        // await axios.get("http://localhost:3001/username", params:)
   }

//    function getMaestroName(id) {
//     axios.get("http://localhost:3001/username", {params: {id: id}}).then(r => {
//         console.log(r.data[0].username);
//         return(r.data[0].username);
//     })
//    }

   function requestMaestro() {
    console.log("User wants to be Maestro");
    var payload = {
        id: userId,
    }
    axios.post("http://localhost:3001/changerequested", payload);
   }

   var evd;
   const handleClick= (event) => {
    setSelectedEvent(event);
    evd = selectedEvent != null ? <div>HELLO HI TESt</div> : <div>WHYY</div>;
    console.log( selectedEvent, evd, 'Push the concert details page for this concert 2');
  }

  console.log("OUTSIDE");
  console.log(events);

  if ( selectedEvent.length < 1)
  {
    //   {console.log(selectedEvent)}
    //   {console.log("POOP"+isMaestro)}
      console.log("FINAL?");
      console.log(events);
      var temp = [];
      events.map((item, index) => {
        // console.log("INSIDE: " + item.maestroId);
        // if(item.maestroId == userId) {
        //     temp.push("Maestro");
        // } else {
        //     temp.push("Participant");
        // }
        getUsernames(item.maestroId);
        // temp.push(getMaestroName(item.maestroId));
      })
      console.log("TEMP AFTER: ");
      console.log(temp);
    // getUsernames();

      if(isMaestro == 1){
        return (
            <Fragment>
                <div className='schedule'>
                    <div className='search-inner'>
                        <div className='search-box'>
                            <h1 className='large text-primary'>Welcome Back: {userName}</h1>
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
    } else if(isRequested == 1) {
        return (
            <Fragment>
                <div className='schedule'> 
                    <div className='search-inner'>
                        <div className='search-box'>
                            <h1 className='large text-primary'>Welcome Back: {userName}</h1>
                            <h1 className='medium'>Admin is reviewing your request, please wait...</h1>
                            <div className={css(styles.content)}>
                                <span className={css(styles.title)}>{"Upcoming Concerts"}</span>
                                <Row className={css(styles.cardsContainer)} wrap flexGrow={1} horizontal="space-between" breakpoints={{ 600: 'column' }}>
                                    <Row className={css(styles.cardRow)} wrap flexGrow={0} horizontal="space-between" breakpoints={{ 300: 'column' }}>
                                        {console.log("DANNY")}
                                        {events.map((item, index) => (
                                            <div onClick={() => handleClick (item)} >
                                                <ConcertCardComponent className={css(styles.miniCardContainer)} group = {item.title} date= {item.date} />
                                            </div>
                                        ))}
                                        {/* <ScheduleCardComponent  className={css(styles.miniCardContainer)} /> */}
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
                    <div className='schedule'> 
                        <div className='search-inner'>
                            <div className='search-box'>
                                <h1 className='large text-primary'>Welcome Back: {userName}</h1>
                                <h1 className='medium'>Want to schedule your own concerts? Become a Maestro!</h1>
                                <button className='btn btn-primary' onClick={requestMaestro}>Request Maestro Status</button>
                                <div className={css(styles.content)}>
                                    <span className={css(styles.title)}>{"Upcoming Concerts"}</span>
                                    <Row className={css(styles.cardsContainer)} wrap flexGrow={1} horizontal="space-between" breakpoints={{ 600: 'column' }}>
                                        <Row className={css(styles.cardRow)} wrap flexGrow={0} horizontal="space-between" breakpoints={{ 300: 'column' }}>
                                            {events.map((event, index) => (
                                                <div onClick={() => handleClick (event)} > 
                                                    <ConcertCardComponent className={css(styles.miniCardContainer)} group = {event.title} date= {event.date} />
                                                </div>
                                            ))}
                                            {/* <ScheduleCardComponent  className={css(styles.miniCardContainer)} /> */}
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
    } else {
        if(isMaestro == 1) {
            return (
                <Fragment>
                    <EventDetailsSidebarComponent event = {selectedEvent} clickHandler ={() => handleClick ([])}></EventDetailsSidebarComponent>
                    <div className='schedule'> 
                        <div className='search-inner'>
                            <div className='search-box'>
                                <h1 className='large text-primary'>Welcome Back: {userName}</h1>
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
        } else {
            return(
                <Fragment>
                    <EventDetailsSidebarComponent event = {selectedEvent} clickHandler ={() => handleClick ([])}></EventDetailsSidebarComponent>
                    <div className='search'> 
                        <div className='search-inner'>
                            <div className='search-box'>
                                <h1>Welcome Back: {userName}</h1>
                                <h1 className='medium'>Want to schedule your own concerts? Become a Maestro!</h1>
                                <button className='btn btn-primary' onClick={requestMaestro}>Request Maestro Status</button>
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
    } 
};

export default Dashboard;