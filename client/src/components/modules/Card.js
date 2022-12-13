import React, { Component } from "react";
import FeedItem from "../modules/FeedItem.js"
import "./Card.css";

import { get } from "../../utilities";


class Card extends Component {
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
      let timestamp = parseInt(commentObj.timestamp);
      let date = new Date(timestamp);
      this.setState({
        comments: this.state.comments.concat([[commentObj.comment,commentObj.name,date.toUTCString()],]),
      });
    };


  render() {
    return (
        <FeedItem
        key = {this.props.tag}
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

export default Card;
