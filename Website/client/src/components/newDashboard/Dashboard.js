import React, {Fragment, useState, useEffect} from "react";
import { Column, Row } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite';
import ConcertCardComponent from "./ConcertCard";
import ScheduleCardComponent from "./ScheduleCard";
import CompList from "../compositions/CompList";

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
    const testData = [
        {
          group: 'testgroup',
          date: 'OCT 1',
        },
        {
            group: 'testgroup',
            date: 'OCT 1',
          }];


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
       
      // function for token
  
    //function for calendar events
    getEvents();
    getRecordings();

      //function for recordings
    },[]);
  
  
  const getEvents =  ()=>{
   // return testData;
         setEvents(testData);
  }
  
  const getRecordings = async ()=>{
    // return testData;
          setRecordings(testRecording);
   }

    return (
        <div className='search'>
            	<div className='search-inner'>
						<div className='search-box'>

       
                <div className={css(styles.content)}>
                <span className={css(styles.title)}>{"Upcoming Concerts"}</span>

                <Row className={css(styles.cardsContainer)} wrap flexGrow={1} horizontal="space-between" breakpoints={{ 600: 'column' }}>
                <Row className={css(styles.cardRow)} wrap flexGrow={0} horizontal="space-between" breakpoints={{ 300: 'column' }}>
                    
                   {events.map((event, index) => (
                       <ConcertCardComponent className={css(styles.miniCardContainer)} group = {event.group} date= {event.group} />
                   ))}
                    <ScheduleCardComponent  className={css(styles.miniCardContainer)} />
                </Row>


            </Row>
            <span className={css(styles.title)}>{"My Recordings"}</span>
                </div>
                <div style={{padding:"10px"}}>
					<CompList list={recordings} dash={false} />
				</div>
                </div>

        </div>
        </div>

    );
};

export default Dashboard;