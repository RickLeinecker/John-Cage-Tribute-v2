import React, {Fragment, useCallback, useState} from 'react';
import { Link, Redirect } from 'react-router-dom';
import Calendar from 'react-calendar';
import { connect } from 'react-redux';
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

    const handleSubmit = event => {
        var day = value.getDate();
        var month = value.getMonth();
        var year = value.getFullYear();

        var fullTime = new Date(year, month, day);

        console.log("In handleSubmit: " + value);
    
        event.preventDefault();
        //Add handleSubmit here
    }

    const changeTime = time => {
        console.log(`Let's do thisssss ${time.indexOf(":")}`);

        if(window.confirm("Schedule a Concert for " + (value.getMonth()+1) + "/" + value.getDate() + "/" + value.getFullYear() + " at " + time + "?"))
        {
            var tempHour = time.substr(0, time.indexOf(":"));
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