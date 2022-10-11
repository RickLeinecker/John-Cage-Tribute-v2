import React, {Fragment, useCallback, useState} from 'react';
import { Link, Redirect } from 'react-router-dom';
import Calendar from 'react-calendar';
import { connect } from 'react-redux';
import './Calendar.css';

const Schedule = ({ isAuthenticated }) => {
    // const [value, setValue] = useState();

    // const onChange = useCallback(
    //     (value) => {
    //         setValue(value);
    //     },
    //     [setValue],
    // );

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