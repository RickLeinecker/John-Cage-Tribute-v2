import React, {Fragment, useState, useEffect, Component} from "react";
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import './Navbar.css';
import { IconContext } from 'react-icons';
import axios from 'axios';
import jwt_decode from "jwt-decode";

function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const [isAuthenticated, setAuth] = useState(SidebarData.Unauthenticated);
  const [isMaestro, setIsMaestro] = useState(-1);
  const [userId, setId] = useState(0);
  const [token, setToken] = useState('');

  useEffect(() =>
    {
        refreshToken();
    },[]);

    const refreshToken = async () => {
      try {
        const response = await axios.get('http://localhost:3001/token');
          setToken(response.data.accessToken);
          const decoded = jwt_decode(response.data.accessToken);
          getIsMaestro(decoded.userId);
      } catch (error) {
          if (error.response) {
            // history.push("/");
            console.log("auth fail");
          }
        }
    }

    const getIsMaestro = async (id)=>{
      await axios.get("http://localhost:3001/userinfo", {params: {id: id}}).then(r => {
          console.log(typeof(r.data[0].isMaestro));
          console.log(r.data[0].isMaestro);
          setIsMaestro(r.data[0].isMaestro);
          console.log("SOLUTION?: " + isMaestro);
      })
 }

  const showSidebar = () => {
    let tokenData = localStorage.getItem("token")
    var parsedData = JSON.parse(tokenData);

    if (parsedData == null){
      setAuth(SidebarData.Unauthenticated);
    }
    else if(isMaestro == 0) {
    setAuth(SidebarData.Authenticated);
    }
    else {
      setAuth(SidebarData.AuthenticatedMaestro);
    }
  
    console.log(JSON.parse(tokenData));
    console.log("HERE:");
    console.log(isAuthenticated);
    setSidebar(!sidebar);
  }

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className={sidebar ? 'navbar-inactive' : 'navbar' }>
          <Link to='#' className='menu-bars'>
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle'>
              <Link to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            { isAuthenticated.map((item, index) => {
              return (
                <li key={index} className={item.cName} onClick ={ item.func? ()=> item.func() : null}> 
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;