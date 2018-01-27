const User = require('../models/user'); // Import User Model Schema
const jwt = require("jsonwebtoken");
const Blog = require('../models/blog'); // Import blog Model Schema

const config = require("../config/database");


module.exports = (router) => {

    router.post("/newBlog", (req, res) => {
        if (!req.body.title) {
            return res.json({
                success: false,
                message: "Blog title is required"
            });
        } else {
            if (!req.body.body) {
                return res.json({
                    success: false,
                    message: "Blog body is required"
                });

            } else {
                if (!req.body.createdBy) {
                    return res.json({
                        success: false,
                        message: "Blog creator is required"
                    });

                } else {
                    const blog = new Blog({
                        title: req.body.title,
                        body: req.body.body,
                        createdBy: req.body.createdBy,

                    });

                    blog.save((err) => {
                        if (err) {

                            if (err.errors) {
                                if (err.errors.title) {
                                    return res.json({
                                        success: false,
                                        message: err.errors.title.message
                                    });

                                } else {
                                    if (err.errors.body) {
                                        return res.json({
                                            success: false,
                                            message: err.errors.body.message
                                        });

                                    } else {
                                        return res.json({
                                            success: false,
                                            message: err.errmsg
                                        });

                                    }
                                }
                            } else {
                                return res.json({
                                    success: false,
                                    message: err
                                });
                            }


                        } else {
                            return res.json({
                                success: true,
                                message: "Blog saved.!"
                            });
                        }
                    });
                }
            }
        }

    });

    ////////////////////  routerto get all blogs from database and log itin blog page



    router.get("/allBlogs", (req, res) => {
        Blog.find({}, (err, blogs) => {
            if (err) {
                return res.json({
                    success: false,
                    message: err.message
                });
            } else {
                if (!blogs) {
                    return res.json({
                        success: false,
                        message: "No Blogs Found"
                    });

                } else {
                    return res.json({
                        success: true,
                        blogs: blogs
                    });

                }
            }
        }).sort({
            "_id": -1
        });
    });

    /// router to edit single blogs 

    router.get("/singleBlog/:id", (req, res) => {
        if (!req.params.id) {
            return res.json({success :false, message:"No ID Provided ..!"});
        } else {
            
        Blog.findOne({
            _id: req.params.id
        }, (err, blog) => {
            if (err) {
                return res.json({
                    success: false,
                    message: "Not Valide Blog ID"
                });
            } else {
                if (!blog) {
                    return res.json({
                        success: false,
                        blog: "Blogs Not Foundt ..!"
                    });
                } else {

                    User.findOne({_id:req.decoded.userId},(err,user) => {
                        if (err) {
                            res.json({success:false,message:err});
                        }else{
                            if (!user) {
                                return res.json({success:false ,message:"Unable to authenticate User..!"});
                            }else{
                                if (user.username !==blog.createdBy) {
                                    return res.json({success:false , message:"You Are Not  authorized to edit this Blog  post..."});
                                         
                                     }else{
                                        return res.json({
                                            success: true,
                                            blog: blog
                                        });
                                     }   
                            }
                        }
                    });
                }
            }
        });
    }

    ///////////////// route for edit the blog
        
    router.put("/updateBlog" , (req,res) => {
        if (!req.body._id) {
            return res.json({success :false ,message:"No Blog Id Provided"});

        } else {
            Blog.findOne({_id:req.body._id},(err,blog) => {
                if (err) {
                    return res.json({success:false , message:"Blog ID Not Found"});
                } else {
                    if (!blog) {
                    return res.json({success:false , message:"Blog Not Found"});
                        
                    } else {
                        User.findOne({_id:req.decoded.userId},(err,user) => {
                            if (err) {
                                return res.json({success:false , message:err});
                            } else {
                                if (!user) {
                                  return res.json({success:false , message:"Unable to authenticate User.."});
                                } else {
                                   if (user.username !==blog.createdBy) {
                                  return res.json({success:false , message:"You Are Not  authorized to edit this Blog  post..."});
                                       
                                   } else {
                                       blog.title =   req.body.title;
                                       blog.body = req.body.body ;
                                       blog.save((err) => {
                                          if (err) {
                                              res.json({success:false ,message:err});
                                          }else{
                                            res.json({success:true ,message:"Blog Updated !"});
                                              
                                          } 
                                       });
                                   } 
                                }
                            }                         
                        });                        
                    }                    
                }               
            });
        }
    });
    });

    //// route to deleted Blog

    router.delete('/deleteBlog/:id', (req, res) => {
        // Check if ID was provided in parameters
        if (!req.params.id) {
          res.json({ success: false, message: 'No id provided' }); // Return error message
        } else {
          // Check if id is found in database
          Blog.findOne({ _id: req.params.id }, (err, blog) => {
            // Check if error was found
            if (err) {
              res.json({ success: false, message: 'Invalid id' }); // Return error message
            } else {
              // Check if blog was found in database
              if (!blog) {
                res.json({ success: false, messasge: 'Blog was not found' }); // Return error message
              } else {
                // Get info on user who is attempting to delete post
                User.findOne({ _id: req.decoded.userId }, (err, user) => {
                  // Check if error was found
                  if (err) {
                    res.json({ success: false, message: err }); // Return error message
                  } else {
                    // Check if user's id was found in database
                    if (!user) {
                      res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                    } else {
                      // Check if user attempting to delete blog is the same user who originally posted the blog
                      if (user.username !== blog.createdBy) {
                        res.json({ success: false, message: 'You are not authorized to delete this blog post' }); // Return error message
                      } else {
                        // Remove the blog from database
                        blog.remove((err) => {
                          if (err) {
                            res.json({ success: false, message: err }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Blog deleted!' }); // Return success message
                          }
                        });
                      }
                    }
                  }
                });
              }
            }
          });
        }
    });
    
 /* ===============================================================
     LIKE BLOG POST
  =============================================================== */
  router.put('/likeBlog', (req, res) => {
    // Check if id was passed provided in request body
    if (!req.body.id) {
      res.json({ success: false, message: 'No id was provided.' }); // Return error message
    } else {
      // Search the database with id
      Blog.findOne({ _id: req.body.id }, (err, blog) => {
        // Check if error was encountered
        if (err) {
          res.json({ success: false, message: 'Invalid blog id' }); // Return error message
        } else {
          // Check if id matched the id of a blog post in the database
          if (!blog) {
            res.json({ success: false, message: 'That blog was not found.' }); // Return error message
          } else {
            // Get data from user that is signed in
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: 'Something went wrong.' }); // Return error message
              } else {
                // Check if id of user in session was found in the database
                if (!user) {
                  res.json({ success: false, message: 'Could not authenticate user.' }); // Return error message
                } else {
                  // Check if user who liked post is the same user that originally created the blog post
                  if (user.username === blog.createdBy) {
                    res.json({ success: false, messagse: 'Cannot like your own post.' }); // Return error message
                  } else {
                    // Check if the user who liked the post has already liked the blog post before
                    if (blog.likesBy.includes(user.username)) {
                      res.json({ success: false, message: 'You already liked this post.' }); // Return error message
                    } else {
                      // Check if user who liked post has previously disliked a post
                      if (blog.dislikesBy.includes(user.username)) {
                        blog.dislikes--; // Reduce the total number of dislikes
                        const arrayIndex = blog.dislikesBy.indexOf(user.username); // Get the index of the username in the array for removal
                        blog.dislikesBy.splice(arrayIndex, 1); // Remove user from array
                        blog.likes++; // Increment likes
                        blog.likesBy.push(user.username); // Add username to the array of likesBy array
                        // Save blog post data
                        blog.save((err) => {
                          // Check if error was found
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Blog liked!' }); // Return success message
                          }
                        });
                      } else {
                        blog.likes++; // Incriment likes
                        blog.likesBy.push(user.username); // Add liker's username into array of likesBy
                        // Save blog post
                        blog.save((err) => {
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Blog liked!' }); // Return success message
                          }
                        });
                      }
                    }
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  /* ===============================================================
     DISLIKE BLOG POST
  =============================================================== */
  router.put('/dislikeBlog', (req, res) => {
    // Check if id was provided inside the request body
    if (!req.body.id) {
      res.json({ success: false, message: 'No id was provided.' }); // Return error message
    } else {
      // Search database for blog post using the id
      Blog.findOne({ _id: req.body.id }, (err, blog) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Invalid blog id' }); // Return error message
        } else {
          // Check if blog post with the id was found in the database
          if (!blog) {
            res.json({ success: false, message: 'That blog was not found.' }); // Return error message
          } else {
            // Get data of user who is logged in
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: 'Something went wrong.' }); // Return error message
              } else {
                // Check if user was found in the database
                if (!user) {
                  res.json({ success: false, message: 'Could not authenticate user.' }); // Return error message
                } else {
                  // Check if user who disliekd post is the same person who originated the blog post
                  if (user.username === blog.createdBy) {
                    res.json({ success: false, messagse: 'Cannot dislike your own post.' }); // Return error message
                  } else {
                    // Check if user who disliked post has already disliked it before
                    if (blog.dislikesBy.includes(user.username)) {
                      res.json({ success: false, message: 'You already disliked this post.' }); // Return error message
                    } else {
                      // Check if user has previous disliked this post
                      if (blog.likesBy.includes(user.username)) {
                        blog.likes--; // Decrease likes by one
                        const arrayIndex = blog.likesBy.indexOf(user.username); // Check where username is inside of the array
                        blog.likesBy.splice(arrayIndex, 1); // Remove username from index
                        blog.dislikes++; // Increase dislikeds by one
                        blog.dislikesBy.push(user.username); // Add username to list of dislikers
                        // Save blog data
                        blog.save((err) => {
                          // Check if error was found
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Blog disliked!' }); // Return success message
                          }
                        });
                      } else {
                        blog.dislikes++; // Increase likes by one
                        blog.dislikesBy.push(user.username); // Add username to list of likers
                        // Save blog data
                        blog.save((err) => {
                          // Check if error was found
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Blog disliked!' }); // Return success message
                          }
                        });
                      }
                    }
                  }
                }
              }
            });
          }
        }
      });
    }
});


  /* ===============================================================
     comment BLOG POST
  =============================================================== */

  router.post("/comment",(req,res) => {
    if (!req.body.comment) {
      return res.json({success:false , message:"No comment Provider"});
    } else {
      if (!req.body.id) {
      return res.json({success:false , message:"No ID Provider"});
      } else {
      Blog.findOne({_id:req.body.id},(err,blog) => {
        if (err) {
          return res.json({success:false , message:"Invalid Blog ID"});
        } else {
          if (!blog) {
          return res.json({success:false , message:" Blog Not Found..!"});
          } else {
            User.findOne({_id:req.decoded.userId},(err,user) => {
              if (err) {
                return res.json({success:false , message:" Error 616 ..!"});
                
              } else {
                if (!user) {
                  return res.json({success:false , message:" User Not Found..!"});
                } else {
                   blog.comments.push({comment:req.body.comment ,commentator:user.username});                 blog.save((err) => {
                      if (err) {
                        return res.json({success:false , message:err.message});
                      } else {
                        return res.json({success:true , message:"Commet Posted .!"});
                      }
                   });
                }
              }
            });            
          }
        }
      });        
      }
    }
  });





    return router;
};