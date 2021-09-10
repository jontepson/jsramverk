import React from "react";
//import { NavLink } from "react-router-dom";
import logo from '../img/logo.png'


function Header() {
  return (
    <div className="header">
          <div className="logo">
            <img className="logo" src={logo} alt="logo" />
          </div>
    </div>   
  );
}

export default Header;