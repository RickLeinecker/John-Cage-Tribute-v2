import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import api from '../../utils/api';
import Spinner from '../layout/Spinner';
import RequestedList from './RequestedList';
import Axios from "axios";

class MaestroRequests extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
			list: []
            //USED FOR TESTING, USE ABOVE WHEN CONNECTING TO BACKEND
            // list: [
            //     {
            //         username: "John Cage",
            //         email: "johncage@gmail.com",
            //         password: "everythingismusic",
            //         bio: "You know who I am",
            //         isMaestro: 0,
            //         isRequested: 1
            //     },
            //     {
            //         username: "Chandler Hale",
            //         email: "test@gmail.com",
            //         password: "michigan",
            //         bio: "Working on this project",
            //         isMaestro: 0,
            //         isRequested: 1
            //     }
            // ]
		};
	}

    componentDidMount() {
        Axios.get("http://localhost:3001/listrequested").then(r => {
            this.setState({list: r.data});
            console.log("NAIRO");
            console.log(this.state.list);
        })
    }

    render() {
        return(
            <div className='schedule'>
                <div className='dark-overlay'>
                    <div className='search-inner'>
                        <div className='search-box'>
                            <div style={{padding:"10px"}}>
								<RequestedList list={this.state.list} dash={false} />
							</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MaestroRequests;