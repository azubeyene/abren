import React, { Component } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Map from "./pages/Map.js";
import VisualFeed from "./pages/VisualFeed.js";
import NavBar from "./modules/NavBar.js"; 
import NewPost from "./pages/NewPost.js";
import Profile from "./pages/Profile.js"; 
import Home from "./pages/Home.js";
import Skeleton from "./pages/Skeleton.js";
import "../utilities.css";

import { socket } from "../client-socket.js";
import { get, post } from "../utilities";

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
    };
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        this.setState({ userId: user._id });
      }
    });
  }

  handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      this.setState({ userId: user._id });
      post("/api/initsocket", { socketid: socket.id });
    });
    console.log(this.state.userId);
  };

  handleLogout = () => {
    this.setState({ userId: undefined });
    post("/api/logout");
  };

  render() {
    return (
      <>
        <NavBar userId = {this.state.userId} logout={this.handleLogout} login = {this.handleLogin} ></NavBar>
        <Router>
          <Map
            path="/map"
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
            userId={this.state.userId}
          /> 
          <Home path="/"/> 
          <VisualFeed path="/feed/:country"/>  
          <NewPost path="/newstory/:country"/>
          <Profile path="/profile"
            userId={this.state.userId}
          /> 
          <NotFound default />
        </Router>
      </>
    );
  }
}

export default App;
