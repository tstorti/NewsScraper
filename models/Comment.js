// Require mongoose
var mongoose = require("mongoose");
// Create a schema class
var Schema = mongoose.Schema;

// Create the Comment schema
var CommentSchema = new Schema({
  
});


// Create the Comment model with the schema
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Comment model
module.exports = Comment;
