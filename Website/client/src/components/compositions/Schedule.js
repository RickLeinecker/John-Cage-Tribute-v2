import React, {Fragment, useCallback, useState} from 'react';
import { Link, Redirect } from 'react-router-dom';
import Calendar from 'react-calendar';
import { connect } from 'react-redux';
import './Calendar.css';

const Schedule = ({ isAuthenticated }) => {
    //TEMPORARY REPLACE WITH REAL DATA
    const temp_times = ["00:00", "2:00", "4:00", "6:00", "8:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];

    const [value, onChange] = useState(new Date());

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
                        <Calendar
                            value={value}
                            onChange={onChange}
                        />
                        <div className='schedule-times'>
                            {temp_times.map((time) =>
                                <button className='btn-times'>{time}</button>
                            )}
                        </div>
                        <input type="submit" className="btn btn-primary" value="Reserve" />
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

export default connect(mapStateToProps)(Schedule);