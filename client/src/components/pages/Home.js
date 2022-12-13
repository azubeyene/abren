import React, { Component } from "react";
import {Link} from "@reach/router"; 

import "../../utilities.css";
import "./Home.css"; 

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "127607354942-3mbe2lp6cpb2u855o0c3r4n726i13pmk.apps.googleusercontent.com";

class Home extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      describtion: [],
    };
  }

  componentDidMount() {
    // remember -- api calls go here!

    //import picture 
    if (this.props.userId) {
      //this.loadImages();
    }
  }

  render() {
    return (
      <div className="Home-container">
        <div className="logoWrapper">
          <img className="logo" src="https://i.imgur.com/MH2kJwk.png"/>
        </div>
        <div className="Home-header">
            Together. Explore. 
        </div>
        <div className="Home-description">
           Learn, contribute, and share about different cultures all around the world. Abren is an easy to use platform that helps people learn about the diverse people and culture around the globe.
        </div>
        <div>
            <Link to="/map" >
                <div className="Home-go-button">
                    Go to Map
                </div>
            </Link>
        </div>
      </div>
    );
  }
}

export default Home;