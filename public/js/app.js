$(document).on("click", "#scrape", function() {
    
    //do a new scrape of articles
    let getArticles = new Promise(function(resolve, reject){
        $.getJSON("/scrape", function(result){
            resolve(result);
        });
    });

    // Grab the articles to render
    getArticles.then(function(result){
        $.getJSON("/articles", function(response){
            //refresh window b/c handlebars doesn't like ajax calls
            window.location.replace("/");
        });
    });

});

// Whenever someone clicks add comment button
$(document).on("click", ".js-show-comments", function() {
    let id = $(this).attr("data-id");
    let requestURL = "/articles/"+id;
    //do a get request for the correct data
    $.getJSON(requestURL, function(result) {
        let id = result[0]._id;
        $("#article-comments").text("");

        //update the modal with the comments returned for the specific article
        for(var i=0; i<result[0].comments.length;i++){
            let commentRow=$("<div>");
            let commentContainer=$("<div>");
            let deleteBtn=$("<button>")
            deleteBtn.addClass("btn btn-danger btn-margin btn-delete js-btn-delete");
            deleteBtn.text("Delete");
            deleteBtn.attr("data-id", result[0].comments[i]._id)
            commentContainer.addClass("comments");
            commentRow.attr("id", result[0].comments[i]._id);
            commentContainer.text(result[0].comments[i].message);
            $(commentRow).append(commentContainer);
            $(commentRow).append(deleteBtn);
            $("#article-comments").append(commentRow);
        }
        $('#comments').modal('toggle');
        $("#save-comment").attr("data-id", id);  
    }); 
});

// Whenever someone clicks add comment button
$(document).on("click", "#save-comment", function() {
    
    let id = $(this).attr("data-id");
    let requestURL = "/articles/"+id;
    //console.log($("#comments-new").val());
    //do a post request with new comment
    // Run a POST request to add the comment, using what's entered in the text box
    $.ajax({
        method: "POST",
        url: requestURL,
        data: {
            // Value taken from title input
            message: $("#comments-new").val(),
        },
    })
    // With that done
    .done(function(data) {  

        //put the new comment in the modal for display with a delete button
        let commentRow=$("<div>");
        let commentID = data.comments[data.comments.length-1];
        let commentContainer=$("<div>");
        let deleteBtn=$("<button>")
        deleteBtn.addClass("btn btn-danger btn-margin btn-delete js-btn-delete");
        deleteBtn.text("Delete");
        deleteBtn.attr("data-id", commentID);
        commentContainer.addClass("comments");
        commentContainer.text($("#comments-new").val());
        commentRow.attr("id", commentID);
        $(commentRow).append(commentContainer);
        $(commentRow).append(deleteBtn);
        $("#article-comments").append(commentRow);
        
        // Empty the notes section
        $("#comments-new").val("");
    });
});

//delete comment
$(document).on("click", ".js-btn-delete", function(){
    let id = $(this).attr("data-id");
    let requestURL = "/comments/" + id
    $.ajax({
        url: requestURL,
        type: 'DELETE',
        success: function(result) {
            //delete comment from modal
            let commentIDCont = "#"+result._id;
            $(commentIDCont).html("");
        }
    });
});

//delete article
$(document).on("click", ".js-delete", function(){
    let id = $(this).attr("data-id");
    let requestURL = "/articles/" + id
    $.ajax({
        url: requestURL,
        type: 'DELETE',
        success: function(result) {
            //delete comment from page
            let articleIDCont = "#"+result._id;
            $(articleIDCont).remove();
        }
    });
});



$(document).on("click", "#close-modal", function() {
    $('#comments').modal('toggle');
});