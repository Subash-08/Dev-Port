import React from 'react';
import { Link } from 'react-router-dom';
import '../style/Navbar.css';

const Navbar = () => {

  return (
    <nav>
      <div className="navbar">
        <div className="instagram-text-logo">
          <Link to="/">DevPort</Link>
        </div>

        <div className="sub-section">
          <Link className="navlink" to="/">
            <img className="navIcon" src="https://img.icons8.com/?size=100&id=73&format=png&color=000000" />
            <span className="navText">Home</span>
          </Link>
        </div>

        <div className="sub-section">
          <Link className="navlink" to="/search">
            <img className="navIcon" src="https://img.icons8.com/?size=100&id=132&format=png&color=000000" />
            <span className="navText">Search</span>
          </Link>
        </div>

        <div className="sub-section">
          <Link className="navlink" to="/message">
            <img className="navIcon" src="https://img.icons8.com/?size=100&id=jOjH1Mt48Fp1&format=png&color=000000" />
            <span className="navText">Message</span>
          </Link>
        </div>

        <div className="sub-section">
          <Link className="navlink" to="/notification">
            <img className="navIcon" src="https://img.icons8.com/?size=100&id=85038&format=png&color=000000" />
            <span className="navText">Notification</span>
          </Link>
        </div>

         <div className="sub-section">
          <Link className="navlink" to="/explore-users">
            <img className="navIcon" src="https://img.icons8.com/?size=100&id=2yC9SZKcXDdX&format=png&color=000000" />
            <span className="navText">Expolre Frineds</span>
          </Link>
        </div>

        <div className="sub-section">
          <Link className="navlink" to="/create">
            <img className="navIcon" src="https://img.icons8.com/?size=100&id=24717&format=png&color=000000" />
            <span className="navText">Create</span>
          </Link>
        </div>

        <div className="sub-section">
          <Link className="navlink" to="/profile">
            <img className="navIcon" src="https://img.icons8.com/?size=100&id=2yC9SZKcXDdX&format=png&color=000000" />
            <span className="navText">Profile</span>
          </Link>
        </div>

        <div className="sub-section">
          <Link className="navlink" to="/more">
            <img className="navIcon" src="https://img.icons8.com/?size=100&id=aflTW0mA9OBv&format=png&color=000000" />
            <span className="navText">More</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
