import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ProSidebarProvider } from 'react-pro-sidebar';
import CompList from "./CompList";
import Axios from 'axios';

class ContestPage extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
			list: []
            // list: [
            //     {
            //         "recordingId": 0,
            //         "maestroId": 0,
            //         "title": "September",
            //         "lengthSeconds": 180,
            //         "audioFile": "",
            //         "recordingsDate": "",
            //         "inContest": true
            //     },
            //     {
            //         "recordingId": 1,
            //         "maestroId": 1,
            //         "title": "Blinding Lights",
            //         "lengthSeconds": 200,
            //         "audioFile": "",
            //         "recordingsDate": "",
            //         "inContest": true
            //     },
            //     {
            //         "recordingId": 2,
            //         "maestroId": 0,
            //         "title": "Let's Groove",
            //         "lengthSeconds": 200,
            //         "audioFile": "",
            //         "recordingsDate": "",
            //         "inContest": false
            //     },
            //     {
            //         "recordingId": 3,
            //         "maestroId": 2,
            //         "title": "Let It Go",
            //         "lengthSeconds": 200,
            //         "audioFile": "",
            //         "recordingsDate": "",
            //         "inContest": true
            //     },
            //     {
            //         "recordingId": 4,
            //         "maestroId": 3,
            //         "title": "Stacy's Mom",
            //         "lengthSeconds": 200,
            //         "audioFile": "",
            //         "recordingsDate": "",
            //         "inContest": true
            //     },
            //     {
            //         "recordingId": 5,
            //         "maestroId": 4,
            //         "title": "4'33",
            //         "lengthSeconds": 200,
            //         "audioFile": "",
            //         "recordingsDate": "",
            //         "inContest": true
            //     }
            // ]
		};
	}

    componentDidMount() {
        Axios.get("https://johncagetribute.org/recordings").then(r => {
			this.setState({list: r.data});
		})
    }

    render() {
        console.log("WINNIE THE POOH:");
        console.log(this.state.list);

        return(
            <div className='schedule'>
                <div className='dark-overlay'>
                    <div className='search-inner'>
                        <div className='search-box'>
                            <h1 className='x-large-contest'>Composition Contest</h1>
                            <p className='landing-text'>
                                Welcome to the Contest Page! 
                                Occasionally, we will run contests where you can submit your composition for a chance to win a cash prize!
                                If there is currently an ongoing contest, you can enter by simply clickinga button when creating your masterpiece!
                            </p>
                            <h1 className='large'>Current Contest Entrants:</h1>
                            <CompList list={this.state.list} dash={false} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ContestPage;