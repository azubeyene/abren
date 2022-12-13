import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { get, post } from "../../utilities";

import "../../utilities.css";
import "./Skeleton.css";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "127607354942-3mbe2lp6cpb2u855o0c3r4n726i13pmk.apps.googleusercontent.com";

class Skeleton extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      images: [],
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
    if (this.props.userId) {
      this.loadImages();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userId !== this.props.userId && this.props.userId) {
      // just logged in. reload images
      this.loadImages();
    }
  }

  loadImages = () => {
    get("/api/getImages").then(images => {
      this.setState({ images: images });
    });
  }

  deleteImages = () => {
    post("/api/deleteImages").then(this.loadImages);
  }

  uploadImage = (event) => {
    const fileInput = event.target;
    console.log(fileInput);
    this.readImage(fileInput.files[0]).then(image => {
      fileInput.value = null;
      return post("/api/uploadImage", { image: image, countryName: "Nigeria" }).then(this.loadImages);
    }).catch(err => {
      console.log(err);
    });
  };

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
      <div className="Skeleton-container">
        <div className="Skeleton-controls">
          <button type="button" onClick={this.deleteImages}>
            Delete All Images
        </button>
        <button type="button" onClick={this.loadImages}>
            Images Load
        </button>
          <label htmlFor="fileInput">Click to add an image</label>
          <input id="fileInput" type="file" name="files[]" accept="image/*" onChange={this.uploadImage} />
        </div>
        <div className="Skeleton-images">
          {
            this.state.images.map((image, index) => (
              <img src={image} key={index} />
            ))
          }
        </div>
      </div>
    );
  }
}

export default Skeleton;