import React, { Component } from "react";
import {Navbar, Dropdown} from "react-bootstrap"; 
import { Link } from "@reach/router";
import GoogleLogin, { GoogleLogout } from "react-google-login";

// This identifies your application to Google's authentication service
const GOOGLE_CLIENT_ID = "127607354942-3mbe2lp6cpb2u855o0c3r4n726i13pmk.apps.googleusercontent.com";
import "./NavBar.css";
/**
 * The navigation bar at the top of all pages. Takes no props.
 */
class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
    };
  }

  render() {
    return (        
        <Navbar className="navbar navbar-expand-md NavBar-Container sticky-top">
            <span className="navbar-text">
              <Link to="/" style={{ textDecoration: 'none' }}>
                <h1 className="NavBar-Title">Abren.</h1>
              </Link> 
            </span>
            <div className="navbar-collapse collapse justify-content-stretch" id="navbar7">
                <ul className="navbar-nav ml-auto">
                    <li>
                      <Link to="/map" style={{ textDecoration: 'none' }} className="NavBar-texts"> 
                        Map
                      </Link>
                    </li>
                    <li>
                      {this.props.userId ? (
                         <Link to="/profile" style={{ textDecoration: 'none' }} className="NavBar-texts"> 
                          Profile
                       </Link>
                      ):(
                        <div className="NavBar-gone"></div> 
                      )}
                    </li>
                    
                    <li className="nav-item">
                        {this.props.userId ? (
                            <GoogleLogout
                            clientId={GOOGLE_CLIENT_ID}
                            buttonText="Logout"
                            onLogoutSuccess={this.props.logout}
                            onFailure={(err) => console.log(err)}
                            render={(renderProps) => (
                              <button onClick={renderProps.onClick} className="NavBar-Log-Button">
                                Log Out
                              </button> 
                            )}
                            className="NavBar-link NavBar-login"
                            />
                        ) : (
                            <GoogleLogin
                            clientId={GOOGLE_CLIENT_ID}
                            buttonText="Login"
                            onSuccess={this.props.login}
                            onFailure={(err) => console.log(err)}
                            render={(renderProps) => (
                              <button onClick={renderProps.onClick} className="NavBar-Log-Button">
                                Log In
                              </button> 
                            )}
                            className="NavBar-link NavBar-login"
                            />
                        )}
                    </li>
                </ul>
            </div>
        </Navbar>
    );
  }
}

export default NavBar;
