

// Grab the articles as a json
$.getJSON("/articles", function(data) {
  
});


// Whenever someone clicks add comment button
$(document).on("click", ".js-show-comments", function() {
    $('#comments').modal('toggle');
    let id = $(this).attr("data-id");
    console.log(id);

    //set attribute so save comment will post correctly
    $("#save-comment").attr("data-id", id);

    //do a get request for the correct data
    //show comments modal with info for specific id

});

// Whenever someone clicks add comment button
$(document).on("click", ".js-save-comment", function() {
    
    //do a post request with new comment

});