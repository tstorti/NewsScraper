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

});

// A GET request to scrape the news website
app.get("/scrape", function(req, res) {

	// First, we grab the body of the html with request
	request("https://www.theringer.com/", function(error, response, html) {
		// Then, we load that into cheerio and save it to $ for a shorthand selector
		var $ = cheerio.load(html);
		
		// Now, we grab every h2 within an article tag, and do the following:
		$("div.c-entry-box--compact__body").each(function(i, element) {

			// Save an empty result object
			var result = {};

			// Add the text and href of every link, and save them as properties of the result object
			result.headline = $(this).children("h2").text();
			result.url = $(this).children("h2").children("a").attr("href");
			result.summary = $(this).children("p").text();
			//console.log(result);

			var entry = new Article(result);
			
			// Now, save that entry to the db
			entry.save(function(err, doc) {
				// Log any errors
				if (err) {
					console.log(err);
				}
				// Or log the doc
				else {
					console.log(doc);
				}
			});
		});
	});
	// Tell the browser that we finished scraping the text
	res.send("Scrape Complete");
});

// This will get the articles we scraped from the mongoDB
app.get("/articles", function(req, res) {
	// Grab every doc in the Articles array
	Article.find({}, function(error, doc) {
		// Log any errors
		if (error) {
			console.log(error);
		}
		// Or send the doc to the browser as a json object
		else {
			//TODO: still an issue with the first document which is scraped
			res.render("index", {
				"articles": doc,
			});
			
		}
	});
});

// Grab an article comments by it's ObjectId
app.get("/articles/:id", function(req, res) {
	
});


// Create a new comment or replace an existing comment
app.post("/articles/:id", function(req, res) {

});

// Listen on port 8080
app.listen(8080, function() {
	console.log("App running on port 8080");
});
