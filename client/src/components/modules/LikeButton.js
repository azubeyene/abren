import React, { Component } from "react";
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';

import { get,post } from "../../utilities";

class LikeButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      like: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    if(this.state.like) {
      post("/api/unlike", {parentStoryId: this.props.parent.slice(5,), userid: this.props.userid}).then(() => this.setState({like: false}))
    } 
    
    if(!this.state.like){
      post("/api/like", {parentStoryId: this.props.parent.slice(5,), userid: this.props.userid}).then(() => this.setState({like: true}))
    }
    
  }

  componentDidMount() {
    get("/api/getLikes", {parentStoryId: this.props.parent.slice(5,), userid: this.props.userid}).then((lik)=> {
        if(lik.length == 0) {
          this.setState({
            like: false
          })
        } else {
          this.setState({
            like: true
          })
        }
      });
  }

  render() {

    return (
      <IconButton aria-label="add to favorites" onClick={this.handleClick}>
        {this.state.like ? <FavoriteIcon style={{ color: "#e2cf9b", textDecoration: 'none', fontSize: 50}}/> : <FavoriteBorderIcon style={{ color: "#e2cf9b", textDecoration: 'none', fontSize: 50 }}/>}
      </IconButton>
    );
  }
}

export default LikeButton;
