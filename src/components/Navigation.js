import React from 'react';
import FacebookLogo from '../icons/FB.png';
import EtsyLogo from '../icons/Etsy.png';

function Navigation(props) {
    return(
        <div id="nav-mobile">
        <div id="nav-handle" onClick={props.toggleNav}>
          <div id="bar1" className={"bar "+props.nav} />
          <div id="bar2" className={"bar "+props.nav} />
          <div id="bar3" className={"bar "+props.nav} />
        </div>
        <div id="nav-overlay" className={props.nav} onClick={props.toggleNav}>
          <div id="social">
            <a id="instagram" href={props.renderElement("Home", "instagram", "https://www.instagram.com")}><img className="social-icon" src={EtsyLogo} alt="instagram link"></img></a>
            <a id="facebook" href={props.renderElement("Home", "facebook", "https://www.facebook.com")}><img className="social-icon" src={FacebookLogo} alt="facebook link"></img></a>
          </div>
          <div id="navigation">
            <p className="nav-text" onClick={() => {props.changeDisplay('Home'); props.toggleNav();}}>Home</p>
            <p className="nav-text" onClick={() => {props.changeDisplay('Tips'); props.toggleNav();}}>Tips</p>
            <p className="nav-text" onClick={() => {props.changeDisplay('Book'); props.toggleNav();}}>Book</p>
            <a id="email" className="nav-text" href={"mailto:"+props.renderElement("Home", "email", "")}>Email</a>
          </div>
        </div>
      </div>
    )
}

export default Navigation;
