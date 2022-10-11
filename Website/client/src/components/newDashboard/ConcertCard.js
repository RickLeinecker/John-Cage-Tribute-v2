import React from 'react';
import { Column } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite/no-important';
import CalendarIcon from "react-calendar-icon";
import { ThemeProvider } from "@emotion/react";

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #DFE0EB',
        borderRadius: 4,
        cursor: 'pointer',
        height: 140,
        maxWidth: 140,
        padding: '10px 10px 10px 10px',
        ':hover': {
            borderColor: 'var(--primary-color)',
            ':nth-child(n) > div': {
                color: 'var(--primary-color);'
            }
        }
    },
    title: {
        color: '#9FA2B4',
        fontFamily: 'Muli',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 19,
        lineHeight: '24px',
        letterSpacing: '0.4px',
        marginBottom: 12,
        minWidth: 102,
        textAlign: 'center'
    },
    value: {
        color: '#252733',
        fontFamily: 'Muli',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 28,
        letterSpacing: '1px',
        lineHeight: '50px',
        textAlign: 'center'
    }
});
    const handleClick = (e) => {
      e.preventDefault();
      console.log('Push the concert details page for this concert');
    }
    const calendarTheme = {
        calendarIcon: {
          textColor: "white", // text color of the header and footer
          textColorFooter: "var(--primary-color);",
          primaryColor: "var(--primary-color);", // background of the header and footer
          backgroundColor: "#e8e8e8"
        }
      };



function ConcertCardComponent({ className = '', group, date }) { //date , time , groupname
    const composedClassName = `${css(styles.container)} ${className}`;
    return (
        <Column flexGrow={1} className={composedClassName} onClick={handleClick} horizontal="center" vertical="center">
            <div className={css(styles.title)} >{group}</div>
            <ThemeProvider theme={calendarTheme}>
            <div> <CalendarIcon date={new Date()} /></div>
            </ThemeProvider>
        </Column>
    );
}

export default ConcertCardComponent;