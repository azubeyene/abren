import React, { Component } from "react";
import {Link} from "@reach/router";
import FeedItem from "../modules/FeedItem.js"
import Masonry from "react-masonry-css"
import AddPhotoAlternateOutlinedIcon from '@material-ui/icons/AddPhotoAlternateOutlined';
import IconButton from '@material-ui/core/IconButton';
import LikeButton from "../modules/LikeButton.js"
import "../../utilities.css";
import "./VisualFeed.css";
import { get } from "../../utilities";

class Feed extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State 
    
    this.state = {
        storyImages : [],
        stories: []
    };

  }

  componentDidMount() {
    // remember -- api calls go here!
    // we make an api call to mongo dp

    get("/api/getStories", {countryName: this.props.country}).then((stories)=> {
        this.setState({
            stories: stories, 
        })
    }) 
  
    get("/api/getStoriesImages", {countryName: this.props.country}).then((images)=> {
      this.setState({
        storyImages: images, 
      })
    }).then(() => {
      let tempstories = this.state.stories;
      this.state.storyImages.forEach((element, index) => {
        tempstories[index].photoId = element;
      })
      let tempDouble = tempstories.concat(tempstories)
      this.setState({
        stories: tempstories,    
      })
    });
  }


  render() {
    let storiesList = null;
    const hasStories = this.state.stories.length !== 0;
    if (hasStories) {
      storiesList = this.state.stories.map((storyObj) => (
        <FeedItem
          key = {storyObj._id}
          username = {storyObj.userName}
          description = {storyObj.description}
          image = {storyObj.photoId}
        />
      ));
    } else {
      storiesList = <div>No stories!</div>;
    }
    
    return (
      <>
      <div className="contianer-fluid">
        <h1 className="VisualFeed-Title text-center">{this.props.country}</h1>
      </div>


      <div className="contianer-fluid gridCont" >

        <Masonry
          breakpointCols={3}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
            {storiesList}
        </Masonry>
        <div className="contianer-fluid newPost">
        <Link to={`/newstory/${this.props.country}`}>
            <IconButton aria-label="add to favorites">
                <AddPhotoAlternateOutlinedIcon style={{ fontSize: 50, color: "#fff" }}/>
            </IconButton>
          </Link>
        </div>

      </div>
      <LikeButton></LikeButton>
      </>
    );
  }
}

export default Feed; 
