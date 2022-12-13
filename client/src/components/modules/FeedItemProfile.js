import React, { useState } from "react"; 
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import Container from '@material-ui/core/Container';
import SendPost from "../modules/SendPost.js";
import Comment from "../modules/Comment.js";
import LikeButton from "./LikeButton.js";
import "./FeedItemProfile.css";

import { get } from "../../utilities";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fff",
    overflow: "visible"
  },
  media: {
    paddingTop: '56.25%', // 16:9
  },
  avatar: {
    backgroundColor: "#79785D",
  },
  body1: {
    padding: 30
  },
}));

export default function FeedItemProfile(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const theme = useTheme();

  return (
    <>
    {/* <Container maxWidth="sm" onClick={handleClickOpen}> */}
      <img className = "profImage" src={props.image} onClick={handleClickOpen}/>
    {/* </Container> */}
    
    <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}  fullWidth = {true} maxWidth= "md">
    <Card className={classes.root}>
      <CardMedia className={classes.media} image={props.image}/>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {props.username[0].toUpperCase()}
          </Avatar>
        }
        action={<LikeButton parent = {props.parent} userid = {props.userid}></LikeButton>}
        title={props.username}
        subheader="September 14, 2016"
      />
      <Divider variant="middle" />
      <CardContent>
        <Typography paragraph = "true" variant="body1" color="textSecondary" component="p">
          {props.description}
        </Typography>
      </CardContent>
        <CardContent>
          <List className={classes.root}>
            <ListItem alignItems="flex-start">
              <SendPost
                userid = {props.userid}
                username = {props.username}
                parent = {props.parent}
                addNewComment={props.addNewComment}
              >
              </SendPost>
            </ListItem>
            <ListItem></ListItem>
            {props.comments.length !== 0 ? props.comments.map((comment) => 
              <Comment username = {comment[1]} comment = {comment[0]} timestamp = {comment[2]}></Comment>) 
              : null }
          </List>
        </CardContent>
    </Card>
    </Dialog>
    </>
  );
}