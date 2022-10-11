import React from 'react';
import { Column } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite/no-important';
import { useHistory } from "react-router-dom";

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
            borderColor: '#3751FF',
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
        fontSize: 70,
        letterSpacing: '1px',
        lineHeight: '80px',
        textAlign: 'center'
    }
});
    



function ScheduleCardComponent({ className = '' }) { 
    const history = useHistory();
    
    const handleClick = (e) => {
      e.preventDefault();
      history.push("/schedule");
    }
    const composedClassName = `${css(styles.container)} ${className}`;
    return (
        <Column flexGrow={1} className={composedClassName} onClick={handleClick} horizontal="center" vertical="center">
              <div className={css(styles.value)}>{"+"}</div>
             <div className={css(styles.title)} >{"Schedule"}</div>
        </Column>
    );
}

export default ScheduleCardComponent;