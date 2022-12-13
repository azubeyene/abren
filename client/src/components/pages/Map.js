import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import NavBar from "../modules/NavBar.js"
import ReactTooltip from "react-tooltip";
import MapChart from "../modules/MapChart.js"
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

import "../../utilities.css";
import "./Map.css";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "127607354942-3mbe2lp6cpb2u855o0c3r4n726i13pmk.apps.googleusercontent.com";


class Map extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {};
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    return (
      <>
        {/* <NavBar></NavBar> */}
        <MapChart></MapChart>
      </>
    );
  }
}

export default Map;
