import React, {Fragment, useCallback, useState, useEffect} from 'react';
import { Link, Redirect } from 'react-router-dom';
import Calendar from 'react-calendar';
import { connect } from 'react-redux';
import axios from 'axios';
import jwt_decode from "jwt-decode";

import './Calendar.css';

const Schedule = ({ isAuthenticated }) => {
    const times =
    [
        "00:00", "00:20", "00:40",
        "1:00", "1:20", "1:40",
        "2:00", "2:20", "2:40",
        "3:00", "3:20", "3:40",
        "4:00", "4:20", "4:40",
        "5:00", "5:20", "5:40",
        "6:00", "6:20", "6:40",
        "7:00", "7:20", "7:40",
        "8:00", "8:20", "8:40",
        "9:00", "9:20", "9:40",
        "10:00", "10:20", "10:40",
        "11:00", "11:20", "11:40",
        "12:00", "12:20", "12:40",
        "13:00", "13:20", "13:40",
        "14:00", "14:20", "14:40",
        "15:00", "15:20", "15:40",
        "16:00", "16:20", "16:40",
        "17:00", "17:20", "17:40",
        "18:00", "18:20", "18:40",
        "19:00", "19:20", "19:40",
        "20:00", "20:20", "20:40",
        "21:00", "21:20", "21:40",
        "22:00", "22:20", "22:40",
        "23:00", "23:20", "23:40"
    ];

    const timeRef = React.useRef(null);
    const calRef = React.useRef(null);

    const [value, onChange] = useState(new Date());
    const [userId, setId] = useState(0);
    const [userName, setuserName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [users, setUsers] = useState([]);

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
            console.log("username after decoded", userName);
            console.log("userid after decoded", userId);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    const handleSubmit = event => {
        // var day = value.getDate();
        // var month = value.getMonth();
        // var year = value.getFullYear();

        // console.log("Date", day, month);
        // var fullTime = new Date(year, month, day);
        // console.log(fullTime);

        var temp = value.toISOString().replace("Z", "");

        console.log("In handleSubmit: " + value);
        console.log("Temp: " + temp);
    
        event.preventDefault();
        //Add handleSubmit here
        trySchedule(userId, temp);
    }

    const trySchedule = async (userId, date)=>{
        // return testData;
        console.log("id is", userId);
        try{
        await axios.post("http://localhost:3001/schedule", {id: userId, date: date}).then(r => {
            console.log("schedule call", r);	
            })
       
        } catch (error) {
      if (error.response) {
        console.log(error.response);
    }
    }
    }

    function addbits(s) {
        var total = 0,
            s = s.match(/[+\-]*(\.\d+|\d+(\.\d+)?)/g) || [];
            
        while (s.length) {
          total += parseFloat(s.shift());
        }
        return total;
      }   
    
    const changeTime = time => {
        console.log(`Let's do thisssss ${time.indexOf(":")}`);

        if(window.confirm("Schedule a Concert for " + (value.getMonth()+1) + "/" + value.getDate() + "/" + value.getFullYear() + " at " + time + "?"))
        {
            //hour is always 4 ahead, so we subtract here to fix that
            var tempHour = time.substr(0, time.indexOf(":")) + "-4";
            tempHour = addbits(tempHour);
            var tempMinute = time.substr(time.indexOf(":")+1);
        
            value.setHours(tempHour);
            value.setMinutes(tempMinute);
        }
    }

    return(
        <div className='schedule'>
            <div className='dark-overlay'>
                <div className='schedule-inner'>
                    <div className='schedule-box'>
                        <h1 className='large text-primary'>
                            Schedule
                        </h1>
                        <br/>
                        <h1 className='medium'>
                            Choose a date for your concert:
                        </h1>
                        <br/>
                        <form onSubmit={handleSubmit}>
                            <Calendar
                                value={value}
                                onChange={onChange}
                                className="calendar"
                                inputRef={calRef}
                                minDate={new Date()}
                            />
                            <div className='schedule-times'>
                                {times.map((time) =>
                                    <button className='btn btn-times' ref={timeRef} onClick={() => changeTime(time)}>{time}</button>
                                )}
                            </div>
                            {/* <input type="submit" className="btn btn-primary" value="Reserve" /> */}
                        </form>
                        {/* <button className='btn btn-times' onClick={joinExisting()}>Join An Existing Concert</button> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

//JUST A PLACEHOLDER, WILL PORBABLY HAVE TO CHANGE
const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated
});

// const joinExisting = () => {
//     let code = prompt("Enter Concert Code:");
// }

export default connect(mapStateToProps)(Schedule);