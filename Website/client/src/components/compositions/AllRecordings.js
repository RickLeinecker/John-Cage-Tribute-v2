import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import api from '../../utils/api';
import Spinner from '../layout/Spinner';
import CompListAdmin from './CompListAdmin';
import Axios from "axios";

class AllRecordings extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
			list: []
		};
	}

    componentDidMount() {
        Axios.get("https://johncagetribute.org/recordings").then(r => {
            this.setState({list: r.data});
            console.log("NAIRO");
            console.log(this.state.list);
        })
        console.log("ALL USERS");
    }

    render() {
        console.log("HELP");
        return(
            <div className='schedule'>
                <div className='dark-overlay'>
                    <div className='search-inner'>
                        <div className='search-box'>
                            <div style={{padding:"10px"}}>
								<CompListAdmin list={this.state.list} dash={false} />
							</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AllRecordings;