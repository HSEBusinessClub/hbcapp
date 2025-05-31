import React from 'react';
import { Link, useLocation } from "react-router-dom";
import './NavBar.css';

import PlayIcon from '../assets/navbar/play.svg?react';
import SearchIcon from '../assets/navbar/search.svg?react';
import CalendarIcon from '../assets/navbar/calendar.svg?react';
import HeartIcon from '../assets/navbar/heart.svg?react';
import InfoIcon from '../assets/navbar/info.svg?react';

const NavBar = () => {
  const location = useLocation();

  const navItems = [
    { to: "/bingo", icon: <PlayIcon />, key: "play" },
    { to: "/dating", icon: <SearchIcon />, key: "search" },
    { to: "/", icon: <CalendarIcon />, key: "calendar" },
    { to: "/favorites", icon: <HeartIcon />, key: "favorites" },
    { to: "/qa", icon: <InfoIcon />, key: "info" },
  ];

  return (
    <nav className="nav-bar">
      {navItems.map(({ to, icon, key }) => (
        <Link to={to} key={key} className={location.pathname === to ? 'active' : ''}>
          {React.cloneElement(icon, { className: 'nav-icon' })}
          {location.pathname === to && <div className="dot" />}
        </Link>
      ))}
    </nav>
  );
};

export default NavBar;
