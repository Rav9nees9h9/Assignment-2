// naming convention: singular for model names, plural for router names
// this file contains a schema definition object that will be mapped to a mongodb document
// using mongoose

// Import mongoose
const mongoose = require("mongoose");
// Create a schema definition object using mapping notation
const schemaDefinitionObj = {
    course: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    assignmentGrade:{
        type: Number, // for integer type
        required: true
    },
    dueDate: {
        type: Date
    },
   
    status: {
        type: String,
        default: "TO DO" // Default value
    },
    
}
// Create a new mongoose schema
const mongooseSchema = new mongoose.Schema(schemaDefinitionObj);
// Create and export a new mongoose model
module.exports = mongoose.model("Assignment", mongooseSchema);