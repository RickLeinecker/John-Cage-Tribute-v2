import React from 'react';
import { Column } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite/no-important';
import { useHistory } from "react-router-dom";
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import Axios from "axios";

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
    sbox: {
        alignItems: 'center',
        width: '100%'
    },
    sboxItem: {
        alignItems: 'center',
        width: '75%'
    },
    spanItem: {
        marginLeft: '0',
        width: '100%'
    },
    sboxIcon: {
        color: '#252733'
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
    



function InviteCardComponent({ className = '' }) { 
   
   
    const history = useHistory();
    
    const handleClick = async (e)  => {
      e.preventDefault();

      var token = localStorage.getItem("token");
      if (token == null )
      {
          console.log("token is null");
          return;
      }
      var parsedData = JSON.parse(token);

      console.log(token);
      var inputVal = document.getElementById("codeInput").value;
      console.log(inputVal);
      var query = JSON.stringify({id:parsedData.userId, passcode: inputVal});

      console.log("query", query)

      try {
           await Axios.post("http://localhost:3001/enterSchedule", {params: query}).then(r => {
             // this.setState({list: r.data})
             console.log("success enter schedule rerender events")
      } )} catch (error) {
    if (error.response) {
      console.log(error.response);
      }
      }


    //  history.push("/schedule");
    }
    const composedClassName = `${css(styles.container)} ${className}`;
    return (
        <Column flexGrow={1} className={composedClassName} horizontal="center" vertical="center">
             <div className={css(styles.title)} >{"Have an Invite Code?"}</div>
             <div className={css(styles.sbox)} >{
            <span className={css(styles.spanItem)}> <input className={css(styles.sboxItem)} type="text" id="codeInput" /> <AiIcons.AiOutlineArrowRight className={css(styles.sboxIcon)} onClick={handleClick}/>   </span> 
              } 
    </div>
        </Column>
    );
}

export default InviteCardComponent;