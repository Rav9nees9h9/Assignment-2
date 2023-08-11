// Import express and create router object
const express = require("express");
const router = express.Router();
// import mongoose model in order to interact with the DB
const Course = require("../models/course"); // to show course list
const Assignment = require("../models/assignment");

// To check user is authenticated
function IsLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // continue processing request
  }
  res.redirect("/login"); // not authenticated
}



async function getAssignments(){
  //allows us to use the **NOW** async find function in non async routing functions
  const assignments = await Assignment.find({});
  return assignments;
}

async function getCourses(){

  const courses = await Course.find({})
  return courses;
}

// Configure router object with request handlers
// GET handler for /Projects/
router.get("/", (req, res, next) => {
  getAssignments()
  .then(function(assignments){
    res.render("assignments/index", {
      title: "Assignments",
      dataset: assignments,
      user: req.user
    })
  }
  )
  .catch(function(err){
    console.log(err);
  })
});

// GET handler for add
router.get("/add", IsLoggedIn, (req, res, next) => {

  getCourses().then(function(courses){
    getAssignments().then(function(assignments){
      res.render("assignments/add", {
        title: "Task Manager",
        dataset: assignments,
        user: req.user,
        courses: courses
      })
    })
    }).catch(function(err){
      console.log(err)
    })
  .catch(function(err){
    console.log(err);
  })
});
  

// POST handler for add
router.post("/add", IsLoggedIn, (req, res, next) => {

  Assignment.create(
    {
      course: req.body.course,
      name: req.body.name,
      assignmentGrade: req.body.assignmentGrade,
      dueDate: req.body.dueDate,
      
    }
  )
  .then(function(){
    res.redirect("/assignments"); // success redirect to assignment page
  })
  .catch(function(err){
    console.log(err);
  })
 
});

// GET handler for delete
router.get("/delete/:_id", IsLoggedIn, (req, res, next) => {
  // _id can be accessed from req.params after being defined in the path above
  Assignment.deleteOne(
    {
      _id: req.params._id,
    }).then((result) => {
      res.redirect("/assignments");
    })
    .catch((err) => {
        console.log(err);
    });
});


// GET handler for Edit 
router.get("/edit/:_id", IsLoggedIn, (req, res, next) => {

Assignment.findById({ _id: req.params._id })//Find it by Id
.then(function(assignment){
  res.render("assignments/edit", {
    title: "Task Manager",
    dataset: assignment,
    user: req.user
  })
})
.catch(function(err){
  console.log(err);
  }
)
}
);
// POST handler for Edit 
router.post("/edit/:_id", IsLoggedIn, (req, res, next) => {
  Assignment.findOneAndUpdate({ _id: req.params._id },
    {

      course: req.body.course,
      name: req.body.name,
      assignmentGrade: req.body.assignmentGrade,
      dueDate: req.body.dueDate,
      status: req.body.status,
})
.then((updatedAssignment) =>{
  res.redirect("/assignments");
})
.catch(function(err){
  console.log(err);
  }
);
});

// Export router object
module.exports = router;
