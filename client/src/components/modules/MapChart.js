import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import ReactTooltip from "react-tooltip";
import { Router, navigate } from "@reach/router";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";

import "../../utilities.css";
import "./MapChart.css";
import { BorderAll } from "@material-ui/icons";

// const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json"
const rounded = num => {
  if (num > 1000000000) {
    return Math.round(num / 100000000) / 10 + "Bn";
  } else if (num > 1000000) {
    return Math.round(num / 100000) / 10 + "M";
  } else {
    return Math.round(num / 100) / 10 + "K";
  }
};

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "127607354942-3mbe2lp6cpb2u855o0c3r4n726i13pmk.apps.googleusercontent.com";
let content = ""

class MapChart extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      country : "",
    };
  }
  render() {
    return (
      <>
      <ReactTooltip class="MapChart-Title">{this.state.country}</ReactTooltip>
      <ComposableMap data-tip="" projectionConfig={{ scale: 160 }}>
      <h1 className="MapChart-Title">{this.state.country}</h1>
        <rect width="100%" height="100%" fill="#e6f0f5" stroke="#CFD8DC"/>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    this.setState({country:geo.properties.name });
                  }}
                  onMouseLeave={() => {
                    this.setState({country: ""})
                  }}

                  onClick = {() => {
                    console.log(`/feed/${this.state.country}`)
                    navigate(`/feed/${this.state.country}`);
                  }}
                  
                  style={{
                    default: {
                      fill: "#CDD6C2",
                      outline: "none",
                    },
                    hover: {
                      fill: "#E1CA96",
                      outline: "none"
                    },
                    pressed: {
                      fill: "#e2cf9b",
                      outline: "none"
                    }
                  }}
                />
              ))
            }
          </Geographies>
      </ComposableMap>
    </>
    );
  }
}

export default MapChart;
