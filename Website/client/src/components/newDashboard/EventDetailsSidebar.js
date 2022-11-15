import React from "react";
import { Column } from "simple-flexbox";
import { StyleSheet, css } from "aphrodite/no-important";
import CalendarIcon from "react-calendar-icon";
import { ThemeProvider } from "@emotion/react";
import { IconContext } from "react-icons";
import * as AiIcons from "react-icons/ai";
import * as FaIcons from 'react-icons/fa';
import ConcertCardComponent from "./ConcertCard";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #DFE0EB",
    borderRadius: 4,
    cursor: "pointer",
    height: 140,
    maxWidth: 140,
    padding: "10px 10px 10px 10px",
    ":hover": {
      borderColor: "var(--primary-color)",
      ":nth-child(n) > div": {
        color: "var(--primary-color);",
      },
    },
  },
  title: {
    color: "#9FA2B4",
    fontFamily: "Muli",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 19,
    lineHeight: "24px",
    letterSpacing: "0.4px",
    marginBottom: 12,
    minWidth: 102,
    textAlign: "center",
  },
  value: {
    color: "#252733",
    fontFamily: "Muli",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 28,
    letterSpacing: "1px",
    lineHeight: "50px",
    textAlign: "center",
  },
  miniCardContainer: {
    flexGrow: 1,
    alignSelf:'center',
    alignItems: 'flex-start',
    "@media (max-width: 900px)": {
      marginTop: 2,
      maxWidth: "none",
    },
  },
  container: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #DFE0EB",
    borderRadius: 4,
    cursor: "pointer",
    height: 200,
    maxWidth: 200,
    padding: "10px 10px 10px 10px",
    backgroundColor:'#D4D4D4',
    ":hover": {
      borderColor: "var(--primary-color)",
      ":nth-child(n) > div": {
        color: "var(--primary-color);",
      },
    },
  },
  innerTextTitleSidebar: {
    textAlign: "center",
    borderBottom: "2px solid gray",
    color: "white",
  },
  innerTextSidebar: {
    textAlign: "center",
    color: "white",
  },
  SidebarLi:{
      
  },
  circle: {
    background: '#17a2b8',
    borderRadius: '50%',
    color: 'white',
    display: 'inline-block',
    fontWeight: 'bold',
    lineHeight: '65px',
    marginRight: '5px',
    textAlign: 'center',
    width: '65px'
  },
  calHolder:{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: '20px'
  }


});
const handleClick = (e) => {
  e.preventDefault();
  console.log("Push the concert details page for this concert");
};

function EventDetailsSidebarComponent({ className = "", event, clickHandler }) {
  //date , time , groupname
  const composedClassName = `${css(styles.container)} ${className}`;

  console.log("EVENT", event);

  console.log("its time");
  console.log(event.date.toString());

  return (
    <IconContext.Provider value={{ color: "#fff" }}>
      <div className="dark-overlay" style={{ zIndex: "2", position: "fixed" }}>
        <div id="sidebar" className={"sidebar"} style={{ zIndex: "0" }}>
          <div id="close" className="close" onClick={clickHandler}>
            <AiIcons.AiOutlineClose />
          </div>
          <div className="sb-ref" style={{ padding: "10px" }}>
            <h2 className={css(styles.innerTextTitleSidebar)}>
              Event Information{" "}
            </h2>
            <br />
            <div className={css(styles.calHolder)}>
              <ConcertCardComponent
                group={event.maestroName}
                date={event.date}
                styleSt={styles.container}
              />
            </div>
            <ul>
              <li>
                <span className="landing-text">Title: </span>
              </li>
              <li>
                <span className={css(styles.innerTextSidebar)}>{event.title}</span>
              </li>
              <li>
                <span className="landing-text">Description: </span>
              </li>
              <li>
                <span className={css(styles.innerTextSidebar)}>{event.description}</span>
              </li>

              <li>
                <span className="landing-text">Invite Code to Perform: </span>
              </li>
              <li>
                <span className={css(styles.innerTextSidebar)}>{event.passcodePerform} <AiIcons.AiFillAudio/></span>
              </li>
              <li>
                <span className="landing-text">Invite Code to Listen: </span>
              </li>
              <li>
                <span className={css(styles.innerTextSidebar)}>{event.passcodeListen} <AiIcons.AiFillCustomerService/></span>
              </li>
              <li>
                <span className="landing-text">Composer:</span>
              </li>
              <li>
              <span className={css(styles.circle)}>{event.maestroName}</span>
              </li>
              <li>
                <span className="landing-text">Performers: </span>
              </li>
              <li>
             { event.userOne != -1 ? <span className={css(styles.circle)}>{event.userOneName}</span> : ""}
             { event.userTwo != -2 ? <span className={css(styles.circle)}>, {event.userTwoName}</span> : ""}
             { event.userThree != -3 ? <span className={css(styles.circle)}>, {event.userThreeName}</span> : ""}
              </li>
            </ul>

            <br />
          </div>
        </div>
      </div>
    </IconContext.Provider>
  );
}

export default EventDetailsSidebarComponent;
