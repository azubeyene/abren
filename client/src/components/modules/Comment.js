import React, { Component } from "react";
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import "./Card.css";

import { get, post } from "../../utilities";

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

export default function Comment(props) {
  const classes = useStyles();
  return (
    <>
      <ListItem alignItems="flex-start">
          <ListItemAvatar>
          <Avatar aria-label="recipe" className={classes.avatar}>
              {props.username[0].toUpperCase()}
          </Avatar>
          </ListItemAvatar>
          <ListItemText
          primary = {
            <React.Fragment>
            <Typography
                component="span"
                variant='body1'
                className={classes.inline}
                color="textPrimary"
            >
                {props.comment}
            </Typography>
            </React.Fragment>
          
          }
          secondary={
              <React.Fragment>
              <Typography
                  component="span"
                  variant='subtitle2'
                  className={classes.inline}
                  color="textSecondary"
              >
                {props.timestamp}
              </Typography>
              </React.Fragment>
          }
          />
      </ListItem>
      <Divider></Divider>
    </>
  );
}
