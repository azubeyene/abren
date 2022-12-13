import React, { Component } from "react";
import CardProfile from "../modules/CardProfile.js"
import Card from "../modules/Card.js"
import Masonry from "react-masonry-css"
import { get, post } from "../../utilities";

import "../../utilities.css";
import "./ProfileScroller.css";

// import { Card } from "@material-ui/core";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "127607354942-3mbe2lp6cpb2u855o0c3r4n726i13pmk.apps.googleusercontent.com";

class ProfileScroller extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      stories: [],
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
    if (this.props.userId) {
      this.loadMyStories();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userId !== this.props.userId && this.props.userId) {
      // just logged in. reload images
      this.loadMyStories(); 
    }
  }
 
  loadMyStories = () => {
    get("/api/getMyStories", {userId: this.props.userId}).then(stories => {
      this.setState({ stories: stories });
    });
  }

    viewall = () => {
      let x = document.getElementById("masonary");
      let y = document.getElementById("scroll");
      if (x.style.display === "none") {
        x.style.display = "flex";
        y.style.display ="none"
      } else {
        x.style.display = "none";
        y.style.display = "flex";
      }
    }

  render() {
    let storiesList = null;
    let feelist = null;
    const hasStories = this.state.stories.length !== 0;
    if (hasStories) {
      console.log(this.state.stories[0]._doc.userName); 
      storiesList = this.state.stories.map((storyObj) => (
        <CardProfile
          parent={`Card_${storyObj._doc._id}`}
          userid = {storyObj.userId}
          username = {storyObj._doc.userName}
          description = {storyObj._doc.description}
          image = {storyObj.photoId}
          key = {`Card_${storyObj._doc._id}`}
          className = "ProfileScroller-card"
        />
      ));
      feelist = this.state.stories.map((storyObj) => (
        <Card
          parent={`Card_${storyObj._doc._id}`}
          userid = {storyObj.userId}
          username = {storyObj._doc.userName}
          description = {storyObj._doc.description}
          image = {storyObj.photoId}
          key = {`Card_${storyObj._doc._id}`}
          className = "ProfileScroller-card"
        />
      ));
    } else {
      storiesList = <div> <h1>No Stories</h1></div>;;
    }

    return (
      <>
      <div className="ProfileScroller-container">
          <div className="ProfileScroller-header">
            <div className="container m-0 p-0">
                <div className="ProfileScroller-Name">
                    {this.props.name} 
                </div>
                <div className="ProfileScroller-ViewAll" onClick={this.viewall}>
                    <span className="vertical">|</span>
                    View All
                </div>
              </div>
          </div>  
          <div className="ProfileScroller-scrolling-wrapper" id="scroll">
            {storiesList}
          </div>
      </div>

      <div className="contianer-fluid gridContProfile" id="masonary">
      <Masonry
        breakpointCols={3}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
          {feelist}
      </Masonry>
      </div>
    </>
    );
  }
}

export default ProfileScroller;