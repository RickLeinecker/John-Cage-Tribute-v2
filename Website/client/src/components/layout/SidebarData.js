import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

export const SidebarData = [
  {
    title: 'Home',
    path: '/',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  {
    title: 'Profile',
    path: '/Profile',
    icon: <IoIcons.IoMdPeople  />,
    cName: 'nav-text'
  },
  {
    title: 'Dashboard',
    path: './dashboard',
    icon: <IoIcons.IoIosAnalytics />,
    cName: 'nav-text'
  },
  {
    title: 'Recordings',
    path: '/search',
    icon: <FaIcons.FaMicrophone />,
    cName: 'nav-text'
  },
  {
    title: 'Schedule',
    path: '/schedule',
    icon: <IoIcons.IoMdCalendar />,
    cName: 'nav-text'
  },
  {
    title: 'Rooms',
    path: '/Rooms',
    icon: <IoIcons.IoMdCalendar />,
    cName: 'nav-text'
  },
];