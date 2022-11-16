import React, {Fragment, useCallback, useState, useEffect} from 'react';
import { Link, Redirect } from 'react-router-dom';
import Calendar from 'react-calendar';
import { connect } from 'react-redux';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import Select from 'react-select';

import './Calendar.css';

const Schedule = ({ isAuthenticated }) => {
    const times = [
        {label: "12:00 AM", value: 1}, {label: "12:20 AM", value: 2}, {label: "12:40 AM", value: 3},
        {label: "1:00 AM", value: 4}, {label: "1:20 AM", value: 5}, {label: "1:40 AM", value: 6},
        {label: "2:00 AM", value: 7}, {label: "2:20 AM", value: 8}, {label: "2:40 AM", value: 9},
        {label: "3:00 AM", value: 10}, {label: "3:20 AM", value: 11}, {label: "3:40 AM", value: 12},
        {label: "4:00 AM", value: 13}, {label: "4:20 AM", value: 14}, {label: "4:40 AM", value: 15},
        {label: "5:00 AM", value: 16}, {label: "5:20 AM", value: 17}, {label: "5:40 AM", value: 18},
        {label: "6:00 AM", value: 19}, {label: "6:20 AM", value: 20}, {label: "6:40 AM", value: 21},
        {label: "7:00 AM", value: 22}, {label: "7:20 AM", value: 23}, {label: "7:40 AM", value: 24},
        {label: "8:00 AM", value: 25}, {label: "8:20 AM", value: 26}, {label: "8:40 AM", value: 27},
        {label: "9:00 AM", value: 28}, {label: "9:20 AM", value: 29}, {label: "9:40 AM", value: 30},
        {label: "10:00 AM", value: 31}, {label: "10:20 AM", value: 32}, {label: "10:40 AM", value: 33},
        {label: "11:00 AM", value: 34}, {label: "11:20 AM", value: 35}, {label: "11:40 AM", value: 36},
        {label: "12:00 PM", value: 37}, {label: "12:20 PM", value: 38}, {label: "12:40 PM", value: 39},
        {label: "1:00 PM", value: 40}, {label: "1:20 PM", value: 41}, {label: "1:40 PM", value: 42},
        {label: "2:00 PM", value: 43}, {label: "2:20 PM", value: 44}, {label: "2:40 PM", value: 45},
        {label: "3:00 PM", value: 46}, {label: "3:20 PM", value: 47}, {label: "3:40 PM", value: 48},
        {label: "4:00 PM", value: 49}, {label: "4:20 PM", value: 50}, {label: "4:40 PM", value: 51},
        {label: "5:00 PM", value: 52}, {label: "5:20 PM", value: 53}, {label: "5:40 PM", value: 54},
        {label: "6:00 PM", value: 55}, {label: "6:20 PM", value: 56}, {label: "6:40 PM", value: 57},
        {label: "7:00 PM", value: 58}, {label: "7:20 PM", value: 59}, {label: "7:40 PM", value: 60},
        {label: "8:00 PM", value: 61}, {label: "8:20 PM", value: 62}, {label: "8:40 PM", value: 63},
        {label: "9:00 PM", value: 64}, {label: "9:20 PM", value: 65}, {label: "9:40 PM", value: 66},
        {label: "10:00 PM", value: 67}, {label: "10:20 PM", value: 68}, {label: "10:40 PM", value: 69},
        {label: "11:00 PM", value: 70}, {label: "11:20 PM", value: 71}, {label: "11:40 PM", value: 72}
    ];

    const timeRef = React.useRef(null);
    const calRef = React.useRef(null);

    const [value, onChange] = useState(new Date());
    const [userId, setId] = useState(0);
    const [userName, setuserName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [users, setUsers] = useState([]);

    var finalTime = "";
    var title = "";
    var description = "";

    function changeTitle(e) {
		// this.setState({editName: e.target.value});
        // console.log("editname: " + this.state.editName);
        title = e.target.value;
        console.log("changeTitle: " + title);
	}

    function changeDescription(e) {
        description = e.target.value;
        console.log("changeDescription: " + description);
    }

    useEffect(() =>
    {
        refreshToken();
    },[]);
  
    const refreshToken = async () => {
        try {
            const response = await axios.get('https://johncagetribute.org/token');
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
            const response = await axios.get('https://johncagetribute.org/token');
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
        event.preventDefault();
        
        console.log("In handleSubmit: " + value);
        
        changeTime(finalTime);

        console.log("AFTER: " + value);
        
        var temp = value.toISOString().replace("Z", "");

        //temp = changeTimeTwo(finalTime, temp);

        //temp.setTime(temp.getTime() - temp.getTimezoneOffset() * 60 * 1000);

        //console.log("In handleSubmit: " + value);
        console.log("Temp: " + temp);
    
        // event.preventDefault();
        
        trySchedule(userId, temp, title, description);

        //window.location.reload();
    }

    const trySchedule = async (userId, date, title, description)=>{
        // return testData;
        console.log("id is", userId);
        
        if(window.confirm("Schedule a Concert for " + (value.getMonth()+1) + "/" + value.getDate() + "/" + value.getFullYear() + " at " + finalTime + "?"))
        {
            try{
                var payload = {
                    id: userId,
                    date: date,
                    title: title,
                    desc: description
                }

                console.log("LOOK HERE: " +userId+",",date+","+title+","+description);

                var query = JSON.stringify({id:userId, date: date, title: title, desc: description});

                console.log("query", query)
    
            
                // await axios.post("https://johncagetribute.org/schedule", {params: {id: userId, date: date, title: title, desc: description}}).then(r => {
                // console.log("schedule call", r);
                // })
                await axios.post("https://johncagetribute.org/schedule", {params: query}).then(r => {
                console.log("schedule call", r);	
                })
        
            } catch (error) {
                if (error.response) {
                    console.log(error.response);
                }
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
        
        //hour is always 4 ahead, so we subtract here to fix that
        // var tempHour = time.substr(0, time.indexOf(":")) + "-4";
        // tempHour = addbits(tempHour);

        var tempHour = time.substr(0, time.indexOf(":"));
        var tempMinute = time.substr(time.indexOf(":")+1, time.indexOf(" "));
        tempMinute = tempMinute.substr(0, 2);

        console.log("TEMPHOUR: " + tempHour);
        console.log("TEMPMINUTE: " + tempMinute + "|");

        if(time.includes(" PM")) {
            tempHour += "+12";
            tempHour = addbits(tempHour);
        }

        console.log("FEAR YE: " + tempHour + ":" + tempMinute);
    
        value.setHours(tempHour);
        value.setMinutes(tempMinute);
    }

    function handleChange(selectedOption) {
        // this.setState({ selectedOption });
        console.log("MADE IT! " + selectedOption.label);
        // changeTime(selectedOption.label);
        finalTime=selectedOption.label;
        console.log("WHADDUP " + finalTime);
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
                            <br />
                            <Select options={ times } className='black' onChange={handleChange} />
                            <h1 className='medium'>Title:</h1>
                            <input className='edit-info-field' onChange={changeTitle} />
                            <h1 className='medium'>Description:</h1>
                            <input className='edit-info-field' onChange={changeDescription} />
                            <button type='submit' className='btn btn-primary'>Submit</button>
                                {/* {times.map((time) =>
                                    <button className='btn btn-times' ref={timeRef} onClick={() => changeTime(time)}>{time}</button>
                                )} */}
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