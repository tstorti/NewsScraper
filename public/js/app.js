$(document).on("click", "#scrape", function() {
    

    //do a new scrape of articles
    let getArticles = new Promise(function(resolve, reject){
        $.getJSON("/scrape", function(result) {
            if (err) {
                reject(err);
            }
            else{
                resolve(result); 
            }
        });
    });

    // Grab the articles to render
    getArticles.then(function(result){
        $.getJSON("/articles", function(data) {
            if (err) {
                reject(err);
            }
            else{
                resolve(data); 
            }
        });
    });

});

// Whenever someone clicks add comment button
$(document).on("click", ".js-show-comments", function() {
    let id = $(this).attr("data-id");
    let requestUrl = "/articles/"+id;
    //do a get request for the correct data
    $.getJSON(requestURL, function(result) {
        if (err) {
            reject(err);
        }
        else{
             //set attribute so save comment will post correctly
           //show comments modal with info for specific id
            $("#save-comment").attr("data-id", id);
            $('#comments').modal('toggle');
            let id = $(this).attr("data-id");
            console.log(id);
            resolve(result);
        }
    }); 
});

// Whenever someone clicks add comment button
$(document).on("click", ".js-save-comment", function() {
    
    //do a post request with new comment
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // Value taken from title input
            title: $("#comments-new").val(),
        }
    })
    // With that done
    .done(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#comments-new").empty();
    });
});

$(document).on("click", ".js-close-modal", function() {
    $('#comments').modal('toggle');
});