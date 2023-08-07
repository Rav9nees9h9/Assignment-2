const mongoose = require('mongoose');
const schemaDefinitionObj = {
    name: {
        type: String,
        required: true
    },
    startDate:{
        type: Date
    },
    endDate:{
        type: Date
    }
}
// Create a new mongoose schema
var mongooseSchema = new mongoose.Schema(schemaDefinitionObj);
// Create and export a new mongoose model
module.exports = mongoose.model("Course", mongooseSchema);