// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({

});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;
