/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const {uploadImagePromise,downloadImagePromise,deleteImagePromise} = require("./storageTalk.js");
const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
const Story = require("./models/story");
const Comment = require("./models/comment"); 
const Like = require("./models/likes"); 

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});
router.get("/getImages", auth.ensureLoggedIn, (req, res) => {
  User.findById(req.user._id).then(user => {
    Promise.all(
      user.imageNames.map(imageName => downloadImagePromise(imageName)
        .catch(err => "Err: could not find image"))
    ).then(images => {
      res.send(images);
    }).catch(err => {
      console.log("ERR getImages this shouldn't happen");
      res.status(500).send({
        message: "unknown error"
      });
    });
  });
});
router.post("/uploadImage", auth.ensureLoggedIn, (req, res) => {
  if (typeof (req.body.image) !== 'string') {
    throw new Error("Can only handle images encoded as strings. Got type: "
      + typeof (req.body.image));
  }
  User.findById(req.user._id).then(user => {
    if (user.imageNames.length >= 30) {
      // don't allow anyone to have more than 3 images (not race condition safe)
      res.status(412).send({
        message: "You can't post a new image! You already have 3!"
      });
    }
    // only start uploading the image once we know we really want to, since
    // uploading costs money! (if you do it too much)
    return uploadImagePromise(req.body.image);
  }).then(imageName => {
    return User.updateOne({ _id: req.user._id },
      { $push: { imageNames: imageName } });
  }).then(user => {
    res.send({}); // success!
  }).catch(err => {
    console.log("ERR: upload image: " + err);
    res.status(500).send({
      message: "error uploading",
    });
  })
});
router.post("/deleteImages", auth.ensureLoggedIn, (req, res) => {
  User.findById(req.user._id).then(user => {
    return Promise.all(user.imageNames.map(imageName => {
      return Promise.all([deleteImagePromise(imageName), Promise.resolve(imageName)])
    }));
  }).then(successesAndNames => {
    // get names of removed images
    return successesAndNames.filter(
      successAndName => successAndName[0]).map(
        successAndName => successAndName[1]);
  }).then((removedNames) => {
    return User.findOneAndUpdate({ _id: req.user._id },
      { $pullAll: { imageNames: removedNames } }); // remove those names from the document
  }).then(user => {
    // success!
    res.send({});
  }).catch(err => {
    console.log("ERR: failed to delete image: " + err);
    res.status(500).send()
  });
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|
router.post("/postStory", auth.ensureLoggedIn, (req, res) => {
  if (typeof (req.body.image) !== 'string') {
    throw new Error("Can only handle images encoded as strings. Got type: "
      + typeof (req.body.image));
  }
  User.findById(req.user._id).then(user => {
    if (user.imageNames.length >= 900) {
      // don't allow anyone to have more than 3 images (not race condition safe)
      res.status(412).send({
        message: "You can't post a new image! You already have 3!"
      });  
    }
    // only start uploading the image once we know we really want to, since
    // uploading costs money! (if you do it too much)
    return uploadImagePromise(req.body.image);
  }).then(imageName => {
    const newStory = new Story({
      userId: req.user._id,
      userName:req.user.name, 
      countryName: req.body.countryName, 
      photoId: imageName, 
      description: req.body.description, 
    }); 

    newStory.save()

    return User.updateOne({ _id: req.user._id },
      { $push: { imageNames: imageName } });
  }).then(user => {
    res.send({}); // success!
  }).catch(err => {
    console.log("ERR: upload image: " + err);
    res.status(500).send({
      message: "error uploading",
    });
  })
});

router.post("/postStoryNew", auth.ensureLoggedIn, (req, res) => {
  if (typeof (req.body.image) !== 'string') {
    throw new Error("Can only handle images encoded as strings. Got type: "
      + typeof (req.body.image));
  }
  User.findById(req.user._id).then(user => {
    if (user.imageNames.length >= 900) {
      // res.status(412).send({
      //   message: "You can't post a new image! You already have 3!"
      // });
    }
    return uploadImagePromise(req.body.image);
  }).then(imageName =>{
    const newStory = new Story({
      userId: req.user._id,
      userName:req.user.name, 
      countryName: req.body.countryName, 
      photoId: imageName, 
      description: req.body.description, 
      timestamp: req.body.timestamp, 
      numLikes: req.body.numLikes, 
      
    }); 

    return newStory.save()
  }).then(storyObj => {
    return User.updateOne({ _id: req.user._id },
      { $push: { imageNames: storyObj.photoId } });
  }).then(user => {
    res.send({}); // success!
  }).catch(err => {
    console.log("ERR: upload image: " + err);
    res.status(500).send({
      message: "error uploading",
    });
  })
});

router.post("/postComment", auth.ensureLoggedIn, (req, res) => {
  const newComment = new Comment({
    userId: req.user._id,
    userName:req.user.name, 
    parentStoryId: req.body.parentStoryId, 
    timestamp: req.body.timestamp, 
    comment: req.body.comment, 
  }); 

  newComment.save().then(comment => res.send({})).catch(err =>{
    console.log("ERR: upload comment: " + err);
    res.status(500).send({
      message: "error uploading comment",
    });
  }); 
});

router.get("/getStoriesNew", (req, res) => {
  Story.find({countryName: req.query.countryName}).then(stories => {
    Promise.all(
      stories.map(story => {
        return downloadImagePromise(story.photoId)
        .then(image =>{
          //return promise containing modified story 
          let modStory = {...story}
          modStory.photoId = image 
          return Promise.resolve(modStory); 
        })
        .catch(err => "Err: could not find image")
      })
    ).then(stories => {
      res.send(stories);
    }).catch(err => {
      console.log("ERR getImages this shouldn't happen");
      res.status(500).send({
        message: "unknown error"
      });
    });
  });
});

router.get("/getMyStories", (req, res) => {
  Story.find({userId: req.query.userId}).then(stories => {
    console.log(stories.length); 
    Promise.all(
      stories.map(story => {
        console.log(story.userId)
        return downloadImagePromise(story.photoId)
        .then(image =>{
          //return promise containing modified story 
          let modStory = {...story}
          modStory.photoId = image 
          return Promise.resolve(modStory); 
        })
        .catch(err => "Err: could not find image")
      })
    ).then(stories => {
      res.send(stories);
    }).catch(err => {
      console.log("ERR getImages this shouldn't happen");
      res.status(500).send({
        message: "unknown error"
      });
    });
  });
});

router.get("/getStories",(req, res) => {
  Story.find({countryName: req.query.countryName}).then(stories => res.send(stories)); 
});

router.get("/getComments",(req, res) => {
  Comment.find({parentStoryId: req.query.parentStoryId}).then(comments => res.send(comments)); 
});

router.get("/getStoriesImages", (req, res) => {
  Story.find({countryName: req.query.countryName}).then(stories => {
    Promise.all(
      stories.map(story => downloadImagePromise(story.photoId)
        .catch(err => "Err: could not find image"))
    ).then(images => {
      res.send(images);
    }).catch(err => {
      console.log("ERR getImages this shouldn't happen");
      res.status(500).send({
        message: "unknown error"
      });
    });
  });
}); 

router.get("/getUser", auth.ensureLoggedIn, (req, res) => {
  User.findById(req.query.userId).then(user => {
    //send user info 
    res.send(user)
  });
});


router.post("/like", auth.ensureLoggedIn, (req, res) => {
  const newLike = new Like({
    userId: req.user._id,
    parentStoryId: req.body.parentStoryId, 
  }); 
  newLike.save().then(like => res.send({})).catch(err =>{
    console.log("ERR: upload comment: " + err);
    res.status(500).send({
      message: "error uploading comment",
    });
  }); 
});

router.get("/getLikes",(req, res) => {
  Like.find({parentStoryId: req.query.parentStoryId, userId: req.body.userid}).then(comments => res.send(comments)); 
});

router.get("/getLikedStories",auth.ensureLoggedIn,(req, res) => {
  Like.find({userId: req.user._id}).then(likes => {
    Promise.all( 
      likes.map( like => Story.find({_id: like.parentStoryId}))
    ).then(stories =>{
      Promise.all(
        stories.map(story => {
          return downloadImagePromise(story[0].photoId)
          .then(image => {
            return Promise.resolve([story,image]); 
          })
        })
      ).then(stories => res.send(stories)).catch(err => {
        console.log("ERR getImages this shouldn't happen");
        res.status(500).send({
          message: "unknown error"
        });
      })
    })
  });
});

router.post("/unlike",(req, res) => {
  Like.deleteOne({parentStoryId: req.body.parentStoryId, userId: req.body.userid}).then(comments => res.send(comments)); 
});

// api methods not called anywhere 
// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;