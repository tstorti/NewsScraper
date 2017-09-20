// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
// title is a required string
    headline: {
        type: String,
        required: true
    },
    // link is a required string
    summary: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true,
        unique: true
    },
    // This only saves one note's ObjectId, ref refers to the Note model
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;