import React, { Component } from "react";
import FeedItemProfile from "../modules/FeedItemProfile.js"

import { get } from "../../utilities";


class CardProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
    };
  }

  componentDidMount() {
    get("/api/getComments", {parentStoryId: this.props.parent}).then((comments)=> {
      let commentList = []
      comments.forEach(comment => {
        let timestamp = parseInt(comment.timestamp)
        let date = new Date(timestamp)
        commentList.push([comment.comment,comment.userName,date.toUTCString()])
      });
      this.setState({
        comments: commentList
      })
   });
  }

    // this gets called when the user pushes "Submit", so their
    // post gets added to the screen right away
    addNewComment = (commentObj) => {
      this.setState({
        comments: this.state.comments.concat([[commentObj.comment,commentObj.name,commentObj.timestamp.toUTCString()],]),
      });
    };


  render() {
    return (
        <FeedItemProfile
        comments = {this.state.comments}
        parent= {this.props.parent}
        userid = {this.props.userid}
        username = {this.props.username}
        description = {this.props.description}
        image = {this.props.image}
        addNewComment ={this.addNewComment}
      />
    );
  }
}

export default CardProfile;
