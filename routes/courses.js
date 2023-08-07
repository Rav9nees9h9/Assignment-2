const express = require("express");
const router = express.Router();
const Course = require("../models/course");
// function to check if the user is authenticated
function IsLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // continue processing request
  }
  res.redirect("/login"); // not authenticated
}

async function getCourses(){
  //allows us to use the **NOW** async find function in non async routing functions
  const courses = await Course.find({});
  return courses;
}

// GET handler for course
router.get("/", (req, res, next) => {
  getCourses().then(function(courses){
    res.render("courses/index", {
      title: "Courses",
      dataset: courses,
      user: req.user,
    });
  }).catch(function(err){
    console.log(err);
  })
  
});

// GET handler for add
router.get("/add", IsLoggedIn, (req, res, next) => {
  getCourses()
  .then(function(courses){
    res.render("courses/add", {
      title: "Courses",
      dataset: courses,
      user: req.user
    })
  }
  )
  .catch(function(err){
    console.log(err);
  })
});

// POST handler for add
router.post("/add", IsLoggedIn, (req, res, next) => {
  // Course DB INSERT operation
  Course.create(
    {
      name: req.body.name,
      startDate: req.body.startDate,
      endDate: req.body.endDate,

    } ).then(function(){
      res.redirect("/courses"); // success redirect to projects page
    })
    .catch(function(err){
      console.log(err);
    })
   
});

module.exports = router;
