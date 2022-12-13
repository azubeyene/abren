import React, { Component } from "react";
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import SendOutlinedIcon from '@material-ui/icons/SendOutlined';
import "./Card.css";

import { get, post } from "../../utilities";

class SendPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
  }

  // called whenever the user types in the new post input box
  handleChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  // called when the user hits "Submit" for a new post
  handleSubmit = (event) => 
  {
    let time = new Date();
    const body = {timestamp: time.getTime().toString(), parentStoryId: this.props.parent, comment: this.state.value, _id: this.props.userid, name: this.props.username};
    post("/api/postComment", body).then((comment) => {
      this.props.addNewComment(body)
    });

    this.setState({
      value: "",
    })

    document.getElementById('standard-basic').value = "";
  };

  componentDidMount() {
  }

  render() {
    return (
        <>
            <TextField onChange = {this.handleChange} id="standard-basic" label="Comment Here" variant="outlined" fullWidth="true" multiline="true" rowsMax="5" />
            <IconButton aria-label="settings" onClick={this.handleSubmit}>
                <SendOutlinedIcon style = {{color: "#e2cf9b"}} />
            </IconButton>
        </>
    );
  }
}

export default SendPost;
