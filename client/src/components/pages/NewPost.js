import React, { Component } from "react";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'; 
import DropHere from "../modules/DropHere.js"; 
import Button from '@material-ui/core/Button';
import { Router, navigate } from "@reach/router"; 

import { get, post } from "../../utilities";

import "../../utilities.css";
import "./Skeleton.css";
import "./NewPost.css"; 

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "127607354942-3mbe2lp6cpb2u855o0c3r4n726i13pmk.apps.googleusercontent.com";
/*
props given: 
- userId: req.user._id,
- countryName: req.body.countryName, 

states: 
photoId: imageName, 
description: "dummy desc" 

We don't make any get requests, only post 

Upload photo; 
delete or upload a different photo 

upload comment: 
post button 
*/ 


class NewPost extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      current_image: "",
      current_descrip: "", 
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
  }
  
  selectImage = (event) => {
    console.log("helloooo");
    const fileInput = event.target;
    console.log(fileInput);
    this.readImage(fileInput.files[0]).then(image => {
        this.setState({
            current_image: image, 
            current_descrip: this.state.current_descrip,
        }); 

        //fileInput.value = null
    });
  }
  
  changeDescrip = (event) => {
      console.log(event.target.value);
      this.setState({
          current_image: this.state.current_image, 
          current_descrip: event.target.value,
      })
  }

  clearForm = (event)=>{
    this.setState({
        current_image: "",
        current_descrip: "", 
    }); 
    return Promise.resolve("cleared state"); 
  }

  uploadStory = (event) => {
    //create story and upload 
    let date = new Date() 
    post("/api/postStoryNew", {image: this.state.current_image, 
      countryName: this.props.country, 
      description: this.state.current_descrip, 
      timestamp: date.getTime().toString(), 
      numLikes: "0", 
    }).then(this.clearForm).then(navigate(`/feed/${this.props.country}`)); 
  }
  
  readImage = (blob) => {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onloadend = () => {
        if (r.error) {
          reject(r.error.message);
          return;
        } else if (r.result.length < 50) {
          // too short. probably just failed to read, or ridiculously small image
          reject("small image? or truncated response");
          return;
        } else if (!r.result.startsWith("data:image/")) {
          reject("not an image!");
          return;
        } else {
          resolve(r.result);
        }
      };
      r.readAsDataURL(blob);
    });
  };

  render() {

    return (
      <>
      <div className="NewPost-container">
        <div className="NewPost-header">
          {/* <ArrowBackIosIcon 
            style={{ fontSize: 50 }}
            className="NewPost-back-arrow"
            onClick={()=>navigate(`/feed/${this.props.country}`)}>
          </ArrowBackIosIcon> */}
          <h1 className="NewPost-Title text-center">Create New Story</h1>
        </div>

        <div className="NewPost-image">
          <DropHere onSelectImage={this.selectImage} imageAddress={this.state.current_image}/>
          
        </div>

        <div className="NewPost-description">
            <textarea rows="50"value={this.state.current_descrip} onChange={this.changeDescrip}/> 
        </div>

        <div className="NewPost-buttons"> 
          <button onClick={this.clearForm} className="NewPost-Clear-Button">
              Clear
          </button>
          <button onClick={this.uploadStory} className="NewPost-Post-Button">
              Post!
          </button> 
        </div>
      </div>
      </>
    );
  }
}

export default NewPost;