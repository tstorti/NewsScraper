
// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
// Requiring our Note and Article models
const Comment = require("./models/Comment.js");
const Article = require("./models/Article.js");
// Our scraping tools
const request = require("request");
const cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Initialize Express
const app = express();

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
mongoose.connect("mongodb://heroku_tt8m9nmh:hs1ld3qcah9qhbn1jj0vb2m9qu@ds141524.mlab.com:41524/heroku_tt8m9nmh");
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
	res.render("home", {
	});
});

// A GET request to scrape the news website
app.get("/scrape", function(req, res) {

	// First, we grab the body of the html with request
	request("https://www.theringer.com/", function(error, response, html) {
		// Then, we load that into cheerio and save it to $ for a shorthand selector
		let $ = cheerio.load(html);
		
		// Now, we grab every h2 within an article tag, and do the following:
		$("div.c-entry-box--compact__body").each(function(i, element) {

			// Save an empty result object
			let result = {};

			// Add the text and href of every link, and save them as properties of the result object
			result.headline = $(this).children("h2").text();
			result.url = $(this).children("h2").children("a").attr("href");
			result.summary = $(this).children("p").text();
			//console.log(result);

			let entry = new Article(result);
			
			// Now, save that entry to the db
			entry.save(function(err, doc) {
				// Log any errors - will likely be some duplicate entries that are caught by mongoose
				if (err) {
					console.log(err);
				}
				else {
					console.log(doc);
				}
			});
		});
		// Return the data
		return("success");
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
		else {}
		//res.json(doc);
		res.render("index", {
			"articles": doc,
		});
	});
});

// Grab an article comments by it's ObjectId
app.get("/articles/:id", function(req, res) {
	// Grab every doc in the Articles array
	Article.find({ "_id": req.params.id })  
	.populate("comments")
	// now, execute our query
	.exec(function(error, doc) { 
		// Log any errors
		if (error) {
			console.log(error);
		}
		// Or send the doc to the browser as a json object
		else {
			console.log(doc);
			res.json(doc);
		}
	});
});


// Create a new comment
app.post("/articles/:id", function(req, res) {
	// Create a new comment and pass the req.body to the entry
	var newComment = new Comment(req.body);
	console.log(newComment);
	// And save the new note the db
	newComment.save(function(error, doc) {
		// Log any errors
		if (error) {
			console.log(error);
		}
		// Otherwise
		else {
			Article.findOneAndUpdate({ "_id": req.params.id },{$push: { "comments": doc._id }}, {new: true}, function(err, newdoc){
				// Log any errors
				if (err) {
					console.log(err);
				}
				else {
					// Or send the document to the browser
					res.send(newdoc);
				}
			});
		}
	});
});

// Delete a comment
app.delete("/comments/:id", function(req, res) {
	
	Comment.findByIdAndRemove(req.params.id, function(err, doc){
		// Log any errors
		if (err) {
			console.log(err);
		}
		// Or send the doc to the browser as a json object
		else {
			res.json(doc);
		}
	});	
});

// Delete an article
app.delete("/articles/:id", function(req, res) {
	
	Article.findByIdAndRemove(req.params.id, function(err, doc){
		// Log any errors
		if (err) {
			console.log(err);
		}
		// Or send the doc to the browser as a json object
		else {
			res.send(doc);
		}
	});	
});

// Listen on port 8080
app.listen(8080, function() {
	console.log("App running on port 8080");
});
