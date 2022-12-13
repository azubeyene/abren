import React, { Component } from "react";
import { get, post } from "../../utilities";
import ProfileScroller from "../modules/ProfileScroller.js"; 
import ProfileScrollerTwo from "../modules/ProfileScrollerTwo.js"; 

import chairs_wooden from "./chairs_wooden.png"; 

import "../../utilities.css";
import "./Profile.css";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "127607354942-3mbe2lp6cpb2u855o0c3r4n726i13pmk.apps.googleusercontent.com";
const profilepic = require('./chairs_wooden.png');
class Profile extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      name: "", 
      email: "", 
      locale: "", 
      stories: [],
      likes:[], 
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
    console.log("hi");
    console.log(this.props.userId);
    if (this.props.userId) {
      // this.loadImages();
      // get name, email, locale
      this.loadUser() 
    }
  }
  componentDidUpdate(prevProps) {
    console.log("hiello");
    console.log(this.props.userId);
    if (prevProps.userId !== this.props.userId && this.props.userId) {
      // just logged in. reload images
      this.loadUser()
    }
  }

  loadUser = () => {
    get("/api/getUser", {userId: this.props.userId}).then(user => {
      console.log("successfully")
      console.log(this.props.userId);
      console.log(user);
      this.setState({
        name: user.name, 
        email: user.email, 
        locale: user.locale, 
        profilePic: user.profilePic, 
        stories: this.state.stories,
        likes: this.state.likes, 
      }); 
    });
  }

  render() {
    return (
      <div className="Profile-container">
          <div className="Profile-header">
          <img className="Profile-header-image" src="https://identicon-api.herokuapp.com/dsjkshajdk/96?format=png" alt=""/>
            {/* <img src={this.state.profilePic} className="Profile-header-image"/>  */}
            <div className="Profile-header-bio">
                <div className="Profile-header-name">
                    {this.state.name}
                </div>
                <div className="Profile-header-email">
                  {this.state.email}
                </div>
                <div className="Profile-header-email">
                  {this.state.locale}
                </div>
            </div>
          </div>
          <div className="Profile-stories-container">
              <ProfileScroller 
              name="Stories" 
              userId={this.props.userId} 
              isMyStory={true}
              isMyLikes={false}
              className="Profile-scroller-comp"
              /> 

              <ProfileScrollerTwo
              name="Likes" 
              userId={this.props.userId} 
              isMyStory={true}
              isMyLikes={false}
              className="Profile-scroller-comp"
              /> 
          </div>
      </div>
    );
  }
}

export default Profile;