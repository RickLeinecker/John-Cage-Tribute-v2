import React, {Fragment, useCallback, useState, useEffect} from 'react';
import { Link, Redirect } from 'react-router-dom';
import Calendar from 'react-calendar';
import { connect } from 'react-redux';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import Select from 'react-select';

import './Calendar.css';

const Schedule = ({ isAuthenticated }) => {
    // const times =
    // [
    //     "00:00", "00:20", "00:40",
    //     "1:00", "1:20", "1:40",
    //     "2:00", "2:20", "2:40",
    //     "3:00", "3:20", "3:40",
    //     "4:00", "4:20", "4:40",
    //     "5:00", "5:20", "5:40",
    //     "6:00", "6:20", "6:40",
    //     "7:00", "7:20", "7:40",
    //     "8:00", "8:20", "8:40",
    //     "9:00", "9:20", "9:40",
    //     "10:00", "10:20", "10:40",
    //     "11:00", "11:20", "11:40",
    //     "12:00", "12:20", "12:40",
    //     "13:00", "13:20", "13:40",
    //     "14:00", "14:20", "14:40",
    //     "15:00", "15:20", "15:40",
    //     "16:00", "16:20", "16:40",
    //     "17:00", "17:20", "17:40",
    //     "18:00", "18:20", "18:40",
    //     "19:00", "19:20", "19:40",
    //     "20:00", "20:20", "20:40",
    //     "21:00", "21:20", "21:40",
    //     "22:00", "22:20", "22:40",
    //     "23:00", "23:20", "23:40"
    // ];
    const times = [
        {label: "00:00", value: 1}, {label: "00:20", value: 2}, {label: "00:40", value: 3},
        {label: "1:00", value: 4}, {label: "1:20", value: 5}, {label: "1:40", value: 6},
        {label: "2:00", value: 7}, {label: "2:20", value: 8}, {label: "2:40", value: 9},
        {label: "3:00", value: 10}, {label: "3:20", value: 11}, {label: "3:40", value: 12},
        {label: "4:00", value: 13}, {label: "4:20", value: 14}, {label: "4:40", value: 15},
        {label: "5:00", value: 16}, {label: "5:20", value: 17}, {label: "5:40", value: 18},
        {label: "6:00", value: 19}, {label: "6:20", value: 20}, {label: "6:40", value: 21},
        {label: "7:00", value: 22}, {label: "7:20", value: 23}, {label: "7:40", value: 24},
        {label: "8:00", value: 25}, {label: "8:20", value: 26}, {label: "8:40", value: 27},
        {label: "9:00", value: 28}, {label: "9:20", value: 29}, {label: "9:40", value: 30},
        {label: "10:00", value: 31}, {label: "10:20", value: 32}, {label: "10:40", value: 33},
        {label: "11:00", value: 34}, {label: "11:20", value: 35}, {label: "11:40", value: 36},
        {label: "12:00", value: 37}, {label: "12:20", value: 38}, {label: "12:40", value: 39},
        {label: "13:00", value: 40}, {label: "13:20", value: 41}, {label: "13:40", value: 42},
        {label: "14:00", value: 43}, {label: "14:20", value: 44}, {label: "14:40", value: 45},
        {label: "15:00", value: 46}, {label: "15:20", value: 47}, {label: "15:40", value: 48},
        {label: "16:00", value: 49}, {label: "16:20", value: 50}, {label: "16:40", value: 51},
        {label: "17:00", value: 52}, {label: "17:20", value: 53}, {label: "17:40", value: 54},
        {label: "18:00", value: 55}, {label: "18:20", value: 56}, {label: "18:40", value: 57},
        {label: "19:00", value: 58}, {label: "19:20", value: 59}, {label: "19:40", value: 60},
        {label: "20:00", value: 61}, {label: "20:20", value: 62}, {label: "20:40", value: 63},
        {label: "21:00", value: 64}, {label: "21:20", value: 65}, {label: "21:40", value: 66},
        {label: "22:00", value: 67}, {label: "22:20", value: 68}, {label: "22:40", value: 69},
        {label: "23:00", value: 70}, {label: "23:20", value: 71}, {label: "23:40", value: 72}
    ];

    //const temp = [{label: "", value: }, {label: "3:00", value: 2}];

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
        console.log("In handleSubmit: " + value);
        
        changeTime(finalTime);

        console.log("AFTER: " + value);
        
        var temp = value.toISOString().replace("Z", "");

        //temp = changeTimeTwo(finalTime, temp);

        //temp.setTime(temp.getTime() - temp.getTimezoneOffset() * 60 * 1000);

        //console.log("In handleSubmit: " + value);
        console.log("Temp: " + temp);
    
        event.preventDefault();
        
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
    
            
                // await axios.post("http://localhost:3001/schedule", {params: {id: userId, date: date, title: title, desc: description}}).then(r => {
                // console.log("schedule call", r);
                // })
                await axios.post("http://localhost:3001/schedule", {params: query}).then(r => {
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
        var tempMinute = time.substr(time.indexOf(":")+1);

        console.log("FEAR YE: " + tempHour + ":" + tempMinute);
    
        value.setHours(tempHour);
        value.setMinutes(tempMinute);
    }

    const changeTimeTwo = (time, temp) => {
        console.log(`Let's do thisssss ${time.indexOf(":")}`);

        
        //hour is always 4 ahead, so we subtract here to fix that
        // var tempHour = time.substr(0, time.indexOf(":")) + "-4";
        // tempHour = addbits(tempHour);

        var tempHour = time.substr(0, time.indexOf(":"));
        var tempMinute = time.substr(time.indexOf(":")+1);

        console.log("FEAR YE: " + tempHour + ":" + tempMinute);
    
        temp.setHours(tempHour);
        temp.setMinutes(tempMinute);

        return temp;
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