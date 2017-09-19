/* Showing Mongoose's "Populated" Method
 * =============================================== */

// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
// Requiring our Note and Article models
var Note = require("./models/Comment.js");
var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Use body parser with our app
app.use(bodyParser.urlencoded({
	extended: false
}));

// Make public a static dir
app.use(express.static("public"));

//always shows main layout, route will determine what gets rendered inside of {{{body}}}
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Database configuration with mongoose
//replace local db with mongodB_URI
mongoose.connect("mongodb://localhost/newsdb");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
	console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
	console.log("Mongoose connection successful.");
});


// Routes
// ======

app.get("/", function(req, res) {
	res.render("index", {
		"news": ["article1", "article2"],
	});
});

// A GET request to scrape the news website
app.get("/scrape", function(req, res) {
 
});

// This will get the articles we scraped from the mongoDB
app.get("/articles", function(req, res) {

});

// Grab an article by it's ObjectId
app.get("/articles/:id", function(req, res) {
	
});


// Create a new comment or replace an existing comment
app.post("/articles/:id", function(req, res) {

});


// Listen on port 8080
app.listen(8080, function() {
	console.log("App running on port 8080");
});
